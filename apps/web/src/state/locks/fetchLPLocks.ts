import BigNumber from 'bignumber.js'
import {lockerABI} from 'config/abi/locker'
import { erc20Abi } from 'viem'
import {lpTokenABI} from 'config/abi/lpToken'
import { ZERO_ADDRESS } from 'config/constants'
import { publicClient } from 'utils/wagmi'
import { getLockerAddress } from 'utils/addressHelpers'
import { SerializedLPLockData } from './types'

const calls = (chainId: number, start: bigint, end: bigint) => {
  const locker = getLockerAddress(chainId)
  return [
    {
      abi: lockerABI,
      address: locker,
      functionName: "getCumulativeLpTokenLockInfo",
      args: [start, end]
    }
  ]
}

export const fetchLocksData = async (chainId: number, start: bigint, end: bigint): Promise<any[]> => {
  const client = publicClient({chainId})
  const locksMultiCallResult = await client.multicall({ contracts: calls(chainId, start, end), allowFailure: true })
  return locksMultiCallResult
}

const locksTransformer = async (chainId: number, locksResult : any[]) : Promise<any[]> => {
  const [locks] = locksResult

  const client = publicClient({chainId})

  const token0s = await client.multicall({
    contracts: locks[0].map((lock) => {
      return {
        abi: lpTokenABI,
        address: lock.token,
        functionName: "token0",
      }
    }),
  })

  const token1s = await client.multicall({
    contracts: locks[0].map((lock) => {
      return {
        abi: lpTokenABI,
        address: lock.token,
        functionName: "token1",
      }
    }),
  })

  const name0s = await client.multicall({
    contracts: token0s.map((token0) => {
      return {
        abi: erc20Abi ,
        address: token0[0],
        functionName: "name",
      }
    }),
  })

  const name1s = await client.multicall({
    contracts: token1s.map((token1) => {
      return {
        abi: erc20Abi ,
        address: token1[0],
        functionName: "name",
      }
    }),
  })

  const symbol0s = await client.multicall({
    contracts: token0s.map((token0) => {
      return {
        abi: erc20Abi ,
        address: token0[0],
        functionName: "symbol",
      }
    }),
  })

  const symbol1s = await client.multicall({
    contracts: token1s.map((token1) => {
      return {
        abi: erc20Abi ,
        address: token1[0],
        functionName: "symbol",
      }
    }),
  })

  const decimals0s = await client.multicall({
    contracts: token0s.map((token0) => {
      return {
        abi: erc20Abi ,
        address: token0[0],
        functionName: "decimals",
      }
    }),
  })

  const decimals1s = await client.multicall({
    contracts: token1s.map((token1) => {
      return {
        abi: erc20Abi ,
        address: token1[0],
        functionName: "decimals",
      }
    }),
  })

  const result : any[] = []

  for (let index = 0; index < locks[0].length; index++) {
    const lock = locks[0][index];

    result.push({
      chainId,
      address: lock.token,
      token0Name: name0s[index],
      token1Name: name1s[index],
      token0Symbol: symbol0s[index],
      token1Symbol: symbol1s[index],
      token0Decimals: Number(decimals0s[index]),
      token1Decimals: Number(decimals1s[index]),
      amount: lock.amount.toString(),
    })
  }

  return result
}

const fetchLPLocks = async (chainId: number, start: bigint, end: bigint): Promise<SerializedLPLockData[]> => {
  const client = publicClient({chainId})
  const [[_length]] = await Promise.all([
    client.multicall({
      contracts: [
        {
          abi: lockerABI,
          address: getLockerAddress(chainId),
          functionName: "allLpTokenLockedCount"
        }
      ],
    })
  ])

  const length = _length

  const [locksResult] = await Promise.all([
    fetchLocksData(chainId, start, end)
  ])
  
  const [result] = await Promise.all([locksTransformer(chainId, locksResult)])

  return result
}

export default fetchLPLocks
