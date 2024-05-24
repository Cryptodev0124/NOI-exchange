import {masterchefABI} from 'config/abi/masterchef'
import chunk from 'lodash/chunk'
import { ChainId } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { notEmpty } from 'utils/notEmpty'
import { publicClient } from 'utils/wagmi'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
// import { farmFetcher } from 'state/farms'
import { SerializedFarm } from '@pancakeswap/farms'
import { SerializedFarmConfig } from '../../config/constants/types'
import { getMasterchefAddress } from '../../utils/addressHelpers'

export const fetchMasterChefFarmPoolLength = async (chainId: number) => {
  try {
    const client = publicClient({chainId})
    const [poolLength] = await client.multicall({
      contracts: [
        {
          abi: masterchefABI,
          functionName: 'poolLength',
          address: getMasterchefAddress(chainId),
        },
      ],
    })

    return poolLength
  } catch (error) {
    console.error('Fetch MasterChef Farm Pool Length Error: ', error)
    return 0n
  }
}

const masterChefFarmCalls = async (farm: SerializedFarm, chainId: number) => {
  const { pid } = farm
  // const multiCallChainId = farmFetcher.isTestnet(quoteToken.chainId) ? ChainId.BSC_TESTNET : ChainId.BSC
  // const multiCallChainId = ChainId.ETHEREUM
  const masterChefAddress = getMasterchefAddress(chainId)
  const masterChefPid = pid

  return masterChefPid || masterChefPid === 0
    ? [
        {
          abi: masterchefABI,
          address: masterChefAddress,
          functionName: 'poolInfo',
          args: [masterChefPid],
        },
        {
          abi: masterchefABI,
          address: masterChefAddress,
          // name: 'totalRegularAllocPoint',
          functionName: 'totalAllocPoint',
        },
      ]
    : [null, null]
}

export const fetchMasterChefData = async (farms: SerializedFarmConfig[], chainId: number): Promise<any[]> => {
  const masterChefCalls = await Promise.all(farms.map((farm) => masterChefFarmCalls(farm, chainId)))
  const chunkSize = masterChefCalls.flat().length / farms.length
  const masterChefAggregatedCalls = masterChefCalls
    .filter((masterChefCall) => masterChefCall[0] !== null && masterChefCall[1] !== null)
    .flat()
    .filter(notEmpty)

  // const multiCallChainId = farmFetcher.isTestnet(chainId) ? ChainId.BSC_TESTNET : ChainId.BSC
  // const multiCallChainId = ChainId.ETHEREUM
  const client = publicClient({chainId})
  const masterChefMultiCallResult = await client.multicall({
    contracts: masterChefAggregatedCalls,
    allowFailure: false,
  })
  const masterChefChunkedResultRaw = chunk(masterChefMultiCallResult, chunkSize)

  let masterChefChunkedResultCounter = 0
  return masterChefCalls.map((masterChefCall) => {
    if (masterChefCall[0] === null && masterChefCall[1] === null) {
      return [null, null]
    }
    const data = masterChefChunkedResultRaw[masterChefChunkedResultCounter]
    masterChefChunkedResultCounter++
    return data
  })
}
