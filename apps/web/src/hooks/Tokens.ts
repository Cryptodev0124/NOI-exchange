/* eslint-disable no-param-reassign */
import { Currency, ERC20Token, ChainId, NativeCurrency } from '@pancakeswap/sdk'
import { TokenAddressMap } from '@pancakeswap/token-lists'
import { GELATO_NATIVE } from 'config/constants'
import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { erc20Abi } from 'viem'
import { useToken as useToken_ } from 'wagmi'
import { useReadContracts } from '@pancakeswap/wagmi'
import useSWRImmutable from 'swr/immutable'
import { lpTokenABI } from 'config/abi/lpToken'
import { FetchStatus, TFetchStatus } from 'config/constants/types'
import { publicClient } from 'utils/wagmi'
import { isAddress } from '../utils'
import {
  combinedTokenMapFromActiveUrlsAtom,
  combinedTokenMapFromOfficialsUrlsAtom,
  useUnsupportedTokenList,
  useWarningTokenList,
} from '../state/lists/hooks'
import useUserAddedTokens from '../state/user/hooks/useUserAddedTokens'
import useNativeCurrency from './useNativeCurrency'
import { useActiveChainId } from './useActiveChainId'

const mapWithoutUrls = (tokenMap: TokenAddressMap<ChainId>, chainId: number) =>
  Object.keys(tokenMap[chainId] || {}).reduce<{ [address: string]: ERC20Token }>((newMap, address) => {
    const checksummedAddress = isAddress(address)

    if (checksummedAddress && !newMap[checksummedAddress]) {
      newMap[checksummedAddress] = tokenMap[chainId][address].token
    }

    return newMap
  }, {})

/**
 * Returns all tokens that are from active urls and user added tokens
 */
export function useAllTokens(): { [address: string]: ERC20Token } {
  const { chainId } = useActiveChainId()
  const tokenMap = useAtomValue(combinedTokenMapFromActiveUrlsAtom)
  const userAddedTokens = useUserAddedTokens()
  return useMemo(() => {
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: ERC20Token }>(
          (tokenMap_, token) => {
            const checksummedAddress = isAddress(token.address)

            if (checksummedAddress) {
              tokenMap_[checksummedAddress] = token
            }

            return tokenMap_
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          mapWithoutUrls(tokenMap, chainId),
        )
    )
  }, [userAddedTokens, tokenMap, chainId])
}

/**
 * Returns all tokens that are from officials token list and user added tokens
 */
export function useOfficialsAndUserAddedTokens(): { [address: string]: ERC20Token } {
  const { chainId } = useActiveChainId()
  const tokenMap = useAtomValue(combinedTokenMapFromOfficialsUrlsAtom)

  const userAddedTokens = useUserAddedTokens()
  return useMemo(() => {
    return (
      userAddedTokens
        // reduce into all ALL_TOKENS filtered by the current chain
        .reduce<{ [address: string]: ERC20Token }>(
          (tokenMap_, token) => {
            const checksummedAddress = isAddress(token.address)

            if (checksummedAddress) {
              tokenMap_[checksummedAddress] = token
            }

            return tokenMap_
          },
          // must make a copy because reduce modifies the map, and we do not
          // want to make a copy in every iteration
          mapWithoutUrls(tokenMap, chainId),
        )
    )
  }, [userAddedTokens, tokenMap, chainId])
}

export function useUnsupportedTokens(): { [address: string]: ERC20Token } {
  const { chainId } = useActiveChainId()
  const unsupportedTokensMap = useUnsupportedTokenList()
  return useMemo(() => mapWithoutUrls(unsupportedTokensMap, chainId), [unsupportedTokensMap, chainId])
}

export function useWarningTokens(): { [address: string]: ERC20Token } {
  const warningTokensMap = useWarningTokenList()
  const { chainId } = useActiveChainId()
  return useMemo(() => mapWithoutUrls(warningTokensMap, chainId), [warningTokensMap, chainId])
}

export function useIsTokenActive(token: ERC20Token | undefined | null): boolean {
  const activeTokens = useAllTokens()

  if (!activeTokens || !token) {
    return false
  }

  const tokenAddress = isAddress(token.address)

  return tokenAddress && !!activeTokens[tokenAddress]
}

// Check if currency is included in custom list from user storage
export function useIsUserAddedToken(currency: Currency | undefined | null): boolean {
  const userAddedTokens = useUserAddedTokens()

  if (!currency) {
    return false
  }

  return !!userAddedTokens.find((token) => currency?.equals(token))
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): ERC20Token | undefined {
  const { chainId } = useActiveChainId()
  const tokens = useAllTokens()

  const address = isAddress(tokenAddress)

  const token: ERC20Token | undefined = address ? tokens[address] : undefined

  const { data, isLoading } = useToken_({
    address: address || undefined,
    chainId,
    query: {enabled: Boolean(!!address && !token)}
  })

  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    if (isLoading) return undefined
    if (data) {
      return new ERC20Token(
        chainId,
        data.address,
        data.decimals,
        data.symbol ?? 'UNKNOWN',
        data.name ?? 'Unknown Token',
      )
    }
    return undefined
  }, [token, chainId, address, isLoading, data])
}

export function useLPToken(tokenAddress?: string): [string, string, string] | undefined | null {
  const { chainId } = useActiveChainId()
  const client = publicClient({chainId})

  const address = isAddress(tokenAddress)

  const { data: results, isLoading } = useReadContracts({
    query: {
      enabled: Boolean(tokenAddress),
    },
    contracts: [
      {
        chainId,
        abi: lpTokenABI,
        address: address || undefined,
        functionName: 'factory'
      },
      {
        chainId,
        abi: lpTokenABI,
        address: address || undefined,
        functionName: 'token0'
      },
      {
        chainId,
        abi: lpTokenABI,
        address: address || undefined,
        functionName: 'token1'
      },
    ],
    watch: true,
  })

  const factory = results?.[0]?.result as string
  const token0 = results?.[1]?.result as `0x${string}`
  const token1 = results?.[2]?.result as `0x${string}`

  const { data: dataTokens, isLoading: status } = useReadContracts({
    query: {
      enabled: Boolean(tokenAddress) && !isLoading,
    },
    contracts: [
      {
        chainId,
        abi: erc20Abi,
        address: token0,
        functionName: 'symbol'
      },
      {
        chainId,
        abi: erc20Abi,
        address: token1,
        functionName: 'symbol'
      },
    ],
    watch: true,
  })

  const token0_ = dataTokens?.[0]?.result as string
  const token1_ = dataTokens?.[1]?.result as string

  return useMemo(() => {
    if (!chainId || !address) return undefined
    if (status) return null
    if (token1 && token1_) {
      return [factory, token0_, token1_]
    }
    return undefined
  }, [address, chainId, status, factory, token0, token1, token0_, token1_])
}

export function useCurrency(currencyId: string | undefined): Currency | ERC20Token | null | undefined {
  const native = useNativeCurrency()
  const isNative =
    currencyId?.toUpperCase() === native.symbol?.toUpperCase() || currencyId?.toLowerCase() === GELATO_NATIVE
  const token = useToken(isNative ? undefined : currencyId)
  return isNative ? native : token
}

export function useTokenSymbol(symbol?: string): ERC20Token | undefined | null {
  const { chainId } = useActiveChainId()
  const tokens = useAllTokens()

  const allTokens = Object.values(tokens).filter((t) => t.symbol !== "WKNB" && t.symbol !== "WMATIC")

  const token = allTokens.filter((t) => t.symbol === symbol)

  return useMemo(() => {
    if (token.length > 0) return token[0]
    if (!chainId) return undefined
    return undefined
  }, [chainId, token])
}

export function useCurrencyBridge(currencyId: string | undefined): Currency | ERC20Token | null | undefined {
  const native = useNativeCurrency()
  const isNative =
    currencyId?.toUpperCase() === native.symbol?.toUpperCase() || currencyId?.toLowerCase() === GELATO_NATIVE
  const token = useTokenSymbol(isNative ? undefined : currencyId)
  return isNative ? native : token ?? native
}
