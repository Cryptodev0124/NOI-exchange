import { GTOKEN } from '@pancakeswap/tokens'

// Addresses
import {
  getMasterchefAddress,
  getBridgeAddress,
  getDcpBondCalculatorAddress,
  getDcpDistributorAddress,
  getDcpStakingAddress,
  getDcpStakingHelperAddress,
  getDcpTreasuryAddress,
  getDcpWarmupAddress,
  getMultiSenderAddress,
  getLockerAddress,
  getLaunchpadFactoryAddress,
} from 'utils/addressHelpers'

// ABI
import { lpTokenABI } from 'config/abi/lpToken'
import { ifoV2ABI } from 'config/abi/ifoV2'
import { masterchefABI } from 'config/abi/masterchef'
import { bridgeABI } from 'config/abi/bridge'
import { dcpBondABI } from 'config/abi/dcpBond'
import { multisenderABI } from 'config/abi/multisender'
import { lockerABI } from 'config/abi/locker'
import { launchpadFactoryABI } from 'config/abi/launchpadFactory'
import { launchpadForETHABI } from 'config/abi/launchpadForETH'
import { launchpadForTokenABI } from 'config/abi/launchpadForToken'
import { dcpBondCalculatorABI } from 'config/abi/dcpBondCalculator'
import { dcpDistributorABI } from 'config/abi/dcpDistributor'
import { dcpStakingABI } from 'config/abi/dcpStaking'
import { dcpStakingHelperABI } from 'config/abi/dcpStakingHelper'
import { dcpStakingWarmupABI } from 'config/abi/dcpStakingWarmup'
import { dcpTreasuryABI } from 'config/abi/dcpTreasury'
import { chainlinkOracleABI } from 'config/abi/chainlinkOracle'

import { ChainId } from '@pancakeswap/sdk'
import { getViemClients, viemClients } from 'utils/viem'
import {
  Abi,
  Address,
  GetContractReturnType,
  PublicClient,
  WalletClient,
  erc20Abi,
  erc721Abi,
  getContract as viemGetContract,
} from 'viem'

export const getContract = <TAbi extends Abi | readonly unknown[], TWalletClient extends WalletClient>({
  abi,
  address,
  chainId = ChainId.ETHEREUM,
  publicClient,
  signer,
}: {
  abi: TAbi | readonly unknown[]
  address: Address
  chainId?: ChainId
  signer?: TWalletClient
  publicClient?: PublicClient
}) => {
  const c = viemGetContract({
    abi,
    address,
    client: {
      public: publicClient ?? viemClients[chainId],
      wallet: signer,
    },
  }) as unknown as GetContractReturnType<TAbi, PublicClient, Address>

  return {
    ...c,
    account: signer?.account,
    chain: signer?.chain,
  }
}

export const getBep20Contract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: erc20Abi, address, signer, chainId })
}

export const getLpContract = (address: Address, chainId?: number, signer?: WalletClient) => {
  return getContract({ abi: lpTokenABI, address, signer, chainId })
}

export const getIfoV2Contract = (address: Address, chainId?: number, signer?: WalletClient) => {
  return getContract({ abi: ifoV2ABI, address, signer, chainId })
}

export const getCakeContract = (chainId?: number) => {
  return getContract({
    abi: erc20Abi,
    address: chainId ? GTOKEN[chainId]?.address : GTOKEN[ChainId.BSC].address,
    chainId,
  })
}

export const getMasterchefContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({
    abi: masterchefABI,
    address: getMasterchefAddress(chainId),
    chainId,
    signer,
  })
}

export const getChainlinkOracleContract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: chainlinkOracleABI, address, signer, chainId })
}

export const getBridgeContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: bridgeABI, address: getBridgeAddress(chainId), signer, chainId })
}

export const getDcpBondCalculatorContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: dcpBondCalculatorABI, address: getDcpBondCalculatorAddress(chainId), signer, chainId })
}

export const getDcpDistributorContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: dcpDistributorABI, address: getDcpDistributorAddress(chainId), signer, chainId })
}

export const getDcpStakingContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: dcpStakingABI, address: getDcpStakingAddress(chainId), signer, chainId })
}

export const getDcpStakingHelperContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: dcpStakingHelperABI, address: getDcpStakingHelperAddress(chainId), signer, chainId })
}

export const getDcpTreasuryContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: dcpTreasuryABI, address: getDcpTreasuryAddress(chainId), signer, chainId })
}

export const getDcpWarmupContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: dcpStakingWarmupABI, address: getDcpWarmupAddress(chainId), signer, chainId })
}

export const getBondContract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: dcpBondABI, address, signer, chainId })
}

export const getMultisenderContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: multisenderABI, address: getMultiSenderAddress(chainId), signer, chainId })
}

export const getLockerContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: lockerABI, address: getLockerAddress(chainId), signer, chainId })
}

export const getLaunchpadFactoryContract = (signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: launchpadFactoryABI, address: getLaunchpadFactoryAddress(chainId), signer, chainId })
}

export const getLaunchpadETHContract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: launchpadForETHABI, address, signer, chainId })
}

export const getLaunchpadTokenContract = (address: Address, signer?: WalletClient, chainId?: number) => {
  return getContract({ abi: launchpadForTokenABI, address, signer, chainId })
}