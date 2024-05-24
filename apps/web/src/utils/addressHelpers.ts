import { ChainId } from '@pancakeswap/sdk'
import addresses from 'config/constants/contracts'

export interface Address {
  [chainId: number]: `0x${string}`;
}

export const getAddress = (address: Address, chainId?: number): `0x${string}` => {
  return chainId && address[chainId] ? address[chainId] : address[ChainId.ETHEREUM]
}

export const getMasterchefAddress = (chainId?: number) => {
  return getAddress(addresses.masterChef, chainId)
}
export const getMulticallAddress = (chainId?: number) => {
  return getAddress(addresses.multiCall, chainId)
}

export const getZapAddress = (chainId?: number) => {
  return getAddress(addresses.zap, chainId)
}

export const getBridgeAddress = (chainId?: number) => {
  return getAddress(addresses.bridge, chainId)
}

export const getDcpBondCalculatorAddress = (chainId?: number) => {
  return getAddress(addresses.dcpBondCalculator, chainId)
}

export const getDcpDistributorAddress = (chainId?: number) => {
  return getAddress(addresses.dcpDistributor, chainId)
}

export const getDcpStakingAddress = (chainId?: number) => {
  return getAddress(addresses.dcpStaking, chainId)
}

export const getDcpStakingHelperAddress = (chainId?: number) => {
  return getAddress(addresses.dcpStakingHelper, chainId)
}

export const getDcpTreasuryAddress = (chainId?: number) => {
  return getAddress(addresses.dcpTreasury, chainId)
}

export const getDcpWarmupAddress = (chainId?: number) => {
  return getAddress(addresses.dcpWarmup, chainId)
}

export const getMultiSenderAddress = (chainId?: number) => {
  return getAddress(addresses.multisender, chainId)
}

export const getLockerAddress = (chainId?: number) => {
  return getAddress(addresses.locker, chainId)
}

export const getLaunchpadFactoryAddress = (chainId?: number) => {
  return getAddress(addresses.launchpadFactory, chainId)
}
