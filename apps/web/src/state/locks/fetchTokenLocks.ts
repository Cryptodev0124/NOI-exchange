import BigNumber from 'bignumber.js'
import {lockerABI} from 'config/abi/locker'
import { erc20Abi } from 'viem'
import { ZERO_ADDRESS } from 'config/constants'
import { publicClient } from 'utils/wagmi'
import { getLockerAddress } from 'utils/addressHelpers'
import { SerializedTokenLockData } from './types'

const calls = (chainId: number, start: bigint, end: bigint) => {
  const locker = getLockerAddress(chainId)
  return [
    {
      abi: lockerABI,
      address: locker,
      functionName: "getCumulativeNormalTokenLockInfo",
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

  const names = await client.multicall({
    contracts: locks[0].map((lock) => {
      return {
        abi: erc20Abi ,
        address: lock.token,
        functionName: "name",
      }
    }),
  })

  const symbols = await client.multicall({
    contracts: locks[0].map((lock) => {
      return {
        abi: erc20Abi ,
        address: lock.token,
        name: "symbol",
      }
    }),
  })

  const decimals = await client.multicall({
    contracts: locks[0].map((lock) => {
      return {
        abi: erc20Abi ,
        address: lock.token,
        name: "decimals",
      }
    }),
  })

  const result: any[] = []

  for (let index = 0; index < locks[0].length; index++) {
    const lock = locks[0][index];

    result.push({
      chainId,
      address: lock.token,
      name: names[index][0],
      symbol: symbols[index][0],
      decimals: Number(decimals[index][0]),
      amount: new BigNumber(lock.amount._hex).toString(),
    })
  }

  return result
}

const fetchTokenLocks = async (chainId: number, start: bigint, end: bigint): Promise<SerializedTokenLockData[]> => {
  const client = publicClient({chainId})
  const [[_length]] = await Promise.all([
    client.multicall({
      contracts: [
        {
          abi: lockerABI,
          address: getLockerAddress(chainId),
          functionName: "allNormalTokenLockedCount"
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

export default fetchTokenLocks
