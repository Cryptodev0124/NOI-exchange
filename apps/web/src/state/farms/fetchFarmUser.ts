import BigNumber from 'bignumber.js'
import { ChainId } from '@pancakeswap/sdk'
import { erc20Abi , Address } from 'viem'
import {masterchefABI} from 'config/abi/masterchef'
import { publicClient } from 'utils/wagmi'
import { getMasterchefAddress } from 'utils/addressHelpers'
import { SerializedFarmConfig } from 'config/constants/types'

export const fetchFarmUserAllowances = async (
  account: Address,
  farmsToFetch: SerializedFarmConfig[],
  chainId: number,
) => {
  const masterChefAddress = getMasterchefAddress(chainId)

  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = farm.lpAddress
    // return { address: lpContractAddress, name: 'allowance', params: [account, proxyAddress || masterChefAddress] }
    return { address: lpContractAddress, functionName: 'allowance', args: [account, masterChefAddress], abi: erc20Abi  }
  })

  const client = publicClient({chainId})

  const rawLpAllowances = await client.multicall({contracts: calls})

  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return lpBalance.toString()
  })

  return parsedLpAllowances
}

export const fetchFarmUserTokenBalances = async (
  account: string,
  farmsToFetch: SerializedFarmConfig[],
  chainId: number,
) => {
  const calls = farmsToFetch.map((farm) => {
    const lpContractAddress = farm.lpAddress
    return {
      address: lpContractAddress,
      functionName: 'balanceOf',
      args: [account],
      abi: erc20Abi 
    }
  })

  const client = publicClient({chainId})

  const rawTokenBalances = await client.multicall({contracts: calls})
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return tokenBalance.toString()
  })
  return parsedTokenBalances
}

export const fetchFarmUserStakedBalances = async (
  account: string,
  farmsToFetch: SerializedFarmConfig[],
  chainId: number,
) => {
  const masterChefAddress = getMasterchefAddress(chainId)

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      functionName: 'userInfo',
      args: [farm.pid, account],
      abi: masterchefABI
    }
  })

  const client = publicClient({chainId})

  const rawStakedBalances = await client.multicall({
    contracts: calls,
  })
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: SerializedFarmConfig[], chainId: number) => {
  const userAddress = account
  const masterChefAddress = getMasterchefAddress(chainId)

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      // name: 'pendingCake',
      functionName: 'pendingCGT',
      args: [farm.pid, userAddress],
      abi: masterchefABI
    }
  })

  const client = publicClient({chainId})

  const rawEarnings = await client.multicall({ contracts: calls})
  const parsedEarnings = rawEarnings.map((earnings) => {
    return earnings.toString()
  })
  return parsedEarnings
}
