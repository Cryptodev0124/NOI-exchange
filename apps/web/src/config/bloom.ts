import {
  ChainNotConfiguredError,
  ProviderNotFoundError,
  createConnector,
  normalizeChainId,
} from '@wagmi/core'
import type { Evaluate, Omit } from '@wagmi/core/internal'
import { EthereumProvider } from '@walletconnect/ethereum-provider'
import {
  type Address,
  type ProviderConnectInfo,
  type ProviderRpcError,
  SwitchChainError,
  UserRejectedRequestError,
  getAddress,
  numberToHex,
  WalletClient,
  createWalletClient,
  custom
} from 'viem'

type EthereumProviderOptions = Parameters<typeof EthereumProvider['init']>[0]

export type WalletConnectParameters = Evaluate<
  Omit<
    EthereumProviderOptions,
    | 'chains'
    | 'events'
    | 'optionalChains'
    | 'optionalEvents'
    | 'optionalMethods'
    | 'methods'
    | 'rpcMap'
    | 'showQrModal'
  >
>

bloomWallet.type = 'bloomWallet' as const
export function bloomWallet(parameters: WalletConnectParameters) {

  type Provider = Awaited<ReturnType<typeof EthereumProvider['init']>>
  type NamespaceMethods =
    | 'wallet_addEthereumChain'
    | 'wallet_switchEthereumChain'
  type Properties = {
    connect(parameters?: { chainId?: number; pairingTopic?: string }): Promise<{
      accounts: readonly Address[]
      chainId: number
    }>
    getNamespaceChainsIds(): number[]
    getNamespaceMethods(): NamespaceMethods[]
    getRequestedChainsIds(): Promise<number[]>
    isChainsStale(): Promise<boolean>
    onConnect(connectInfo: ProviderConnectInfo): void
    onDisplayUri(uri: string): void
    onSessionDelete(data: { topic: string }): void
    setRequestedChainsIds(chains: number[]): void
    requestedChainsStorageKey: `${string}.requestedChains`
  }
  type StorageItem = {
    [_ in Properties['requestedChainsStorageKey']]: number[]
  }

  let provider_: Provider | undefined
  let providerPromise: Promise<typeof provider_>
  const NAMESPACE = 'eip155'

  return createConnector<Provider, Properties, StorageItem>((config) => ({
    id: 'bloomWallet',
    name: 'bloomWallet',
    type: bloomWallet.type,
    async setup() {
      const provider = await this.getProvider().catch(() => null)
      if (!provider) return
      provider.on('connect', this.onConnect.bind(this))
      provider.on('session_delete', this.onSessionDelete.bind(this))
    },
    async connect({ chainId, ...rest }: {chainId?: number, pairingTopic?: string} = {}) {
      try {
        const provider = await this.getProvider()
        if (!provider) throw new ProviderNotFoundError()
        provider.on('display_uri', this.onDisplayUri)

        let targetChainId = chainId
        if (!targetChainId) {
          const state = (await config.storage?.getItem('state')) ?? {}
          const isChainSupported = config.chains.some(
            (x) => x.id === state.chainId,
          )
          if (isChainSupported) targetChainId = state.chainId
          else targetChainId = config.chains[0]?.id
        }
        if (!targetChainId) throw new Error('No chains found on connector.')

        const isChainsStale = await this.isChainsStale()
        // If there is an active session with stale chains, disconnect current session.
        if (provider.session && isChainsStale) await provider.disconnect()

        // If there isn't an active session or chains are stale, connect.
        if (!provider.session || isChainsStale) {
          const optionalChains = config.chains
            .filter((chain) => chain.id !== targetChainId)
            .map((optionalChain) => optionalChain.id)
          await provider.connect({
            optionalChains: [targetChainId, ...optionalChains],
            ...('pairingTopic' in rest
              ? { pairingTopic: rest.pairingTopic }
              : {}),
          })

          this.setRequestedChainsIds(config.chains.map((x) => x.id))
        }

        // If session exists and chains are authorized, enable provider for required chain
        const accounts = (await provider.enable()).map((x) => getAddress(x))
        const currentChainId = await this.getChainId()

        provider.removeListener('display_uri', this.onDisplayUri)
        provider.removeListener('connect', this.onConnect.bind(this))
        provider.on('accountsChanged', this.onAccountsChanged.bind(this))
        provider.on('chainChanged', this.onChainChanged)
        provider.on('disconnect', this.onDisconnect.bind(this))
        provider.on('session_delete', this.onSessionDelete.bind(this))

        return { accounts, chainId: currentChainId }
      } catch (error) {
        if (
          /(user rejected|connection request reset)/i.test(
            (error as ProviderRpcError)?.message,
          )
        ) {
          throw new UserRejectedRequestError(error as Error)
        }
        throw error
      }
    },
    async disconnect() {
      const provider = await this.getProvider()
      try {
        await provider?.disconnect()
      } catch (error) {
        if (!/No matching key/i.test((error as Error).message)) throw error
      } finally {
        provider?.removeListener(
          'accountsChanged',
          this.onAccountsChanged.bind(this),
        )
        provider?.removeListener('chainChanged', this.onChainChanged)
        provider?.removeListener('disconnect', this.onDisconnect.bind(this))
        provider?.removeListener(
          'session_delete',
          this.onSessionDelete.bind(this),
        )
        provider?.on('connect', this.onConnect.bind(this))

        this.setRequestedChainsIds([])
      }
    },
    async getAccounts() {
      const provider = await this.getProvider()
      return provider.accounts.map((x) => getAddress(x))
    },
    async getProvider({ chainId } = {}) {
      async function initProvider() {
        const optionalChains = config.chains.map((x) => x.id) as [number]
        if (!optionalChains.length) return undefined
        
        // eslint-disable-next-line consistent-return
        const result = await EthereumProvider.init({
          ...parameters,
          disableProviderPing: true,
          optionalChains,
          projectId: parameters.projectId,
          rpcMap: Object.fromEntries(
            config.chains.map((chain) => [
              chain.id,
              chain.rpcUrls.default.http[0]!,
            ]),
          ),
          methods: ['eth_sendTransaction'],
          showQrModal: false,
        })

        return result
      }

      if (!provider_) {
        if (!providerPromise) providerPromise = initProvider()
        provider_ = await providerPromise
        provider_?.events.setMaxListeners(Infinity)
      }
      if (chainId) await this.switchChain?.({ chainId })
      return provider_!
    },
    async getChainId() {
      const provider = await this.getProvider()
      return provider.chainId
    },
    async isAuthorized() {
      try {
        const [accounts, provider] = await Promise.all([
          this.getAccounts(),
          this.getProvider(),
        ])

        // If an account does not exist on the session, then the connector is unauthorized.
        if (!accounts.length) return false

        // If the chains are stale on the session, then the connector is unauthorized.
        const isChainsStale = await this.isChainsStale()
        if (isChainsStale && provider.session) {

          // eslint-disable-next-line @typescript-eslint/no-empty-function
          await provider.disconnect().catch(() => {})
          return false
        }
        return true
      } catch {
        return false
      }
    },
    async switchChain({ chainId }) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const chain = config.chains.find((chain) => chain.id === chainId)
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError())

      try {
        const provider = await this.getProvider()
        const namespaceChains = this.getNamespaceChainsIds()
        const namespaceMethods = this.getNamespaceMethods()
        const isChainApproved = namespaceChains.includes(chainId)

        if (
          !isChainApproved &&
          namespaceMethods.includes('wallet_addEthereumChain')
        ) {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: numberToHex(chain.id),
                blockExplorerUrls: [chain.blockExplorers?.default.url],
                chainName: chain.name,
                nativeCurrency: chain.nativeCurrency,
                rpcUrls: [...chain.rpcUrls.default.http],
              },
            ],
          })
          const requestedChains = await this.getRequestedChainsIds()
          this.setRequestedChainsIds([...requestedChains, chainId])
        }

        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: numberToHex(chainId) }],
        })
        return chain
      } catch (error) {
        const message =
          typeof error === 'string'
            ? error
            : (error as ProviderRpcError)?.message
        if (/user rejected request/i.test(message))
          throw new UserRejectedRequestError(error as Error)
        throw new SwitchChainError(error as Error)
      }
    },
    onAccountsChanged(accounts) {
      if (accounts.length === 0) this.onDisconnect()
      else
        config.emitter.emit('change', {
          accounts: accounts.map((x) => getAddress(x)),
        })
    },
    onChainChanged(chain) {
      const chainId = normalizeChainId(chain)
      config.emitter.emit('change', { chainId })
    },
    async onConnect(connectInfo) {
      const chainId = normalizeChainId(connectInfo.chainId)
      const accounts = await this.getAccounts()
      config.emitter.emit('connect', { accounts, chainId })
    },
    async onDisconnect(_error) {
      this.setRequestedChainsIds([])
      config.emitter.emit('disconnect')

      const provider = await this.getProvider()
      provider.removeListener(
        'accountsChanged',
        this.onAccountsChanged.bind(this),
      )
      provider.removeListener('chainChanged', this.onChainChanged)
      provider.removeListener('disconnect', this.onDisconnect.bind(this))
      provider.removeListener('session_delete', this.onSessionDelete.bind(this))
      provider.on('connect', this.onConnect.bind(this))
    },
    onDisplayUri(uri) {
      const deeplink = `bloom://wallet-connect/connect?uri=${encodeURIComponent(
        uri,
      )}`;

      const isSafari = typeof navigator !== 'undefined' && /Version\/([0-9._]+).*Safari/.test(navigator.userAgent)
      window.open(deeplink, isSafari ? '_blank' : '_self');
    },
    onSessionDelete() {
      this.onDisconnect()
    },
    getNamespaceChainsIds() {
      if (!provider_) return []
      const chainIds = provider_.session?.namespaces[NAMESPACE]?.chains?.map(
        (chain) => parseInt(chain.split(':')[1] || ''),
      )
      return chainIds ?? []
    },
    getNamespaceMethods() {
      if (!provider_) return []
      const methods = provider_.session?.namespaces[NAMESPACE]
        ?.methods as NamespaceMethods[]
      return methods ?? []
    },
    async getRequestedChainsIds() {
      return (
        (await config.storage?.getItem(this.requestedChainsStorageKey)) ?? []
      )
    },
    /**
     * Checks if the target chains match the chains that were
     * initially requested by the connector for the WalletConnect session.
     * If there is a mismatch, this means that the chains on the connector
     * are considered stale, and need to be revalidated at a later point (via
     * connection).
     *
     * There may be a scenario where a dapp adds a chain to the
     * connector later on, however, this chain will not have been approved or rejected
     * by the wallet. In this case, the chain is considered stale.
     *
     * There are exceptions however:
     * -  If the wallet supports dynamic chain addition via `eth_addEthereumChain`,
     *    then the chain is not considered stale.
     *
     * For the above cases, chain validation occurs dynamically when the user
     * attempts to switch chain.
     *
     * Also check that dapp supports at least 1 chain from previously approved session.
     */
    async isChainsStale() {
      const namespaceMethods = this.getNamespaceMethods()
      if (namespaceMethods.includes('wallet_addEthereumChain')) return false

      const connectorChains = config.chains.map((x) => x.id)
      const namespaceChains = this.getNamespaceChainsIds()
      if (
        namespaceChains.length &&
        !namespaceChains.some((id) => connectorChains.includes(id))
      )
        return false

      const requestedChains = await this.getRequestedChainsIds()
      return !connectorChains.every((id) => requestedChains.includes(id))
    },
    async setRequestedChainsIds(chains) {
      await config.storage?.setItem(this.requestedChainsStorageKey, chains)
    },
    get requestedChainsStorageKey() {
      return `${this.id}.requestedChains` as Properties['requestedChainsStorageKey']
    },
  }))
}

export async function getWalletConnectUri(provider): Promise<string> {
    return new Promise<string>((resolve) => provider.once('display_uri', resolve))
  }