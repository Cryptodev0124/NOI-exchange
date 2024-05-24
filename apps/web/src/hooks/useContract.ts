import { Abi, Address, erc20Abi } from 'viem'
import { usePublicClient, useWalletClient } from 'wagmi'

import { useActiveChainId } from 'hooks/useActiveChainId'

import { useMemo } from 'react'
import { getMulticallAddress, getZapAddress, getMultiSenderAddress } from 'utils/addressHelpers'
import {
  getContract,
  getChainlinkOracleContract,
  getMasterchefContract,
  getBridgeContract,
  getBondContract,
  getDcpStakingHelperContract,
  getDcpStakingContract,
  getMultisenderContract,
  getLockerContract,
  getLaunchpadFactoryContract,
  getLaunchpadETHContract,
  getLaunchpadTokenContract,
} from 'utils/contractHelpers'

// Imports below migrated from Exchange useContract.ts
import { ChainId, WNATIVE, pancakePairV2ABI } from '@pancakeswap/sdk'
import { GTOKEN } from '@pancakeswap/tokens'
import { multicallABI } from 'config/abi/Multicall'
import { erc20Bytes32ABI } from 'config/abi/erc20_bytes32'
import { ifoV2ABI } from 'config/abi/ifoV2'
import { multisenderABI } from 'config/abi/multisender'
import { wethABI } from 'config/abi/weth'
import { zapABI } from 'config/abi/zap'

export const useIfoV2Contract = (address: Address) => {
  return useContract(address, ifoV2ABI)
}

export const useERC20 = (address: Address) => {
  return useContract(address, erc20Abi)
}

export const useCake = () => {
  const { chainId } = useActiveChainId()

  return useContract(GTOKEN[chainId].address ?? GTOKEN[ChainId.BSC].address, erc20Abi)
}

export const useMasterchef = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMasterchefContract(signer, chainId), [signer, chainId])
}

export const useChainlinkOracleContract = (address) => {
  const { data: signer } = useWalletClient()
  return useMemo(() => getChainlinkOracleContract(address, signer), [signer, address])
}

// Code below migrated from Exchange useContract.ts

// returns null on errors

type UseContractOptions = {
  chainId?: ChainId
}

export function useContract<TAbi extends Abi>(
  addressOrAddressMap?: Address | { [chainId: number]: Address },
  abi?: TAbi,
  options?: UseContractOptions,
) {
  const { chainId: currentChainId } = useActiveChainId()
  const chainId = options?.chainId || currentChainId
  const { data: walletClient } = useWalletClient()

  return useMemo(() => {
    if (!addressOrAddressMap || !abi || !chainId) return null
    let address: Address | undefined
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap
    else address = addressOrAddressMap[chainId]
    if (!address) return null
    try {
      return getContract({
        abi,
        address,
        chainId,
        signer: walletClient ?? undefined,
      })
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [addressOrAddressMap, abi, chainId, walletClient])
}

export function useTokenContract(tokenAddress?: Address) {
  return useContract(tokenAddress, erc20Abi)
}

export function useWNativeContract() {
  const { chainId } = useActiveChainId()
  return useContract(chainId ? WNATIVE[chainId]?.address : undefined, wethABI)
}

export function useBytes32TokenContract(tokenAddress?: Address) {
  return useContract(tokenAddress, erc20Bytes32ABI)
}

export function usePairContract(pairAddress?: Address) {
  return useContract(pairAddress, pancakePairV2ABI)
}

export function useMulticallContract() {
  const { chainId } = useActiveChainId()
  return useContract(getMulticallAddress(chainId), multicallABI)
}

export function useZapContract() {
  const { chainId } = useActiveChainId()
  return useContract(getZapAddress(chainId), zapABI)
}

export const useBridge = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getBridgeContract(signer, chainId), [signer, chainId])
}

export const useBond = (address: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getBondContract(address, signer, chainId), [address, signer, chainId])
}

export const useDcpStaking = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getDcpStakingContract(signer, chainId), [signer, chainId])
}

export const useDcpStakingHelper = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getDcpStakingHelperContract(signer, chainId), [signer, chainId])
}

export const useMultisender = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getMultisenderContract(signer, chainId), [signer, chainId])
}

export function useMultisenderContract() {
  const { chainId } = useActiveChainId()
  return useContract(getMultiSenderAddress(chainId), multisenderABI)
}

export const useLocker = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getLockerContract(signer, chainId), [signer, chainId])
}

export const useLaunchpadFactory = () => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getLaunchpadFactoryContract(signer, chainId), [signer, chainId])
}

export const useLaunchpadETH = (address: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getLaunchpadETHContract(address, signer, chainId), [address, signer, chainId])
}

export const useLaunchpadToken = (address: Address) => {
  const { chainId } = useActiveChainId()
  const { data: signer } = useWalletClient()
  return useMemo(() => getLaunchpadTokenContract(address, signer, chainId), [address, signer, chainId])
}