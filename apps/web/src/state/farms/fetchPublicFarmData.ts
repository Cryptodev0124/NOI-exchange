// import { ChainId } from '@pancakeswap/sdk'
import { erc20Abi } from 'viem'
import chunk from 'lodash/chunk'
import { getMasterchefAddress } from 'utils/addressHelpers'
import { publicClient } from 'utils/wagmi'
import { SerializedFarm } from '@pancakeswap/farms'
import { SerializedFarmConfig } from '../../config/constants/types'

const fetchFarmCalls = (farm: SerializedFarm, chainId: number) => {
  const { lpAddress, token, quoteToken } = farm
  return [
    // Balance of token in the LP contract
    {
      abi: erc20Abi ,
      address: token.address,
      functionName: 'balanceOf',
      args: [lpAddress],
    },
    // Balance of quote token on LP contract
    {
      abi: erc20Abi ,
      address: quoteToken.address,
      functionName: 'balanceOf',
      args: [lpAddress],
    },
    // Balance of LP tokens in the master chef contract
    {
      abi: erc20Abi ,
      address: lpAddress,
      functionName: 'balanceOf',
      args: [getMasterchefAddress(chainId)],
    },
    // Total supply of LP tokens
    {
      abi: erc20Abi ,
      address: lpAddress,
      functionName: 'totalSupply',
    },
    // Token decimals
    {
      abi: erc20Abi ,
      address: token.address,
      functionName: 'decimals',
    },
    // Quote token decimals
    {
      abi: erc20Abi ,
      address: quoteToken.address,
      functionName: 'decimals',
    },
  ]
}

export const fetchPublicFarmsData = async (farms: SerializedFarmConfig[], chainId: number): Promise<any[]> => {
  const farmCalls = farms.flatMap((farm) => fetchFarmCalls(farm, chainId))
  const chunkSize = farmCalls.length / farms.length
  const client = publicClient({chainId})
  const farmMultiCallResult = await client.multicall({ contracts: farmCalls })
  return chunk(farmMultiCallResult, chunkSize)
}
