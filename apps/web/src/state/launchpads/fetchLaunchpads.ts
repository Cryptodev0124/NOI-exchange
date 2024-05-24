import BigNumber from 'bignumber.js'
import {launchpadFactoryABI} from 'config/abi/launchpadFactory'
import { erc20Abi } from 'viem'
import { ZERO_ADDRESS } from 'config/constants'
import { publicClient } from 'utils/wagmi'
import { getLaunchpadFactoryAddress } from 'utils/addressHelpers'
import { SerializedLaunchpadData } from './types'

const calls = (chainId: number, size: bigint, cursor: bigint) => {
  const launchpadFactory = getLaunchpadFactoryAddress(chainId)
  return [
    {
      abi: launchpadFactoryABI,
      address: launchpadFactory,
      functionName: "getLaunchpads",
      args: [size, cursor]
    }
  ]
}

export const fetchLaunchpadsData = async (chainId: number, size: bigint, cursor: bigint): Promise<any[]> => {
  const client = publicClient({chainId})
  const launchpadsMultiCallResult = await client.multicall({ contracts: calls(chainId, size, cursor), allowFailure: true })
  return launchpadsMultiCallResult
}

const tokenCalls = (token: string) => {
  return [
    {
      address: token,
      functionName: "name",
    },
    {
      address: token,
      functionName: "symbol",
    },
    {
      address: token,
      functionName: "decimals",
    }
  ]
}

const launchpadsTransformer = async (chainId: number, launchpadsResult : any[]) : Promise<any[]> => {
  const [launchpads] = launchpadsResult

  const now = Date.now() / 1000

  const client = publicClient({chainId})

  const names = await client.multicall({
    contracts: launchpads[0].map((lp) => {
      return {
        abi: erc20Abi ,
        address: lp.token,
        functionName: "name",
      }
    }),
  })

  const symbols = await client.multicall({
    contracts: launchpads[0].map((lp) => {
      return {
        abi: erc20Abi ,
        address: lp.token,
        functionName: "symbol",
      }
    }),
  })

  const decimals = await client.multicall({
    contracts: launchpads[0].map((lp) => {
      return {
        abi: erc20Abi ,
        address: lp.token,
        functionName: "decimals",
      }
    }),
  })

  const result : any[] = []

  for (let index = 0; index < launchpads[0].length; index++) {
    const lp = launchpads[0][index];

    let status = ""

    if (lp.refundable)
      status = "canceled"
    else if (lp.claimable)
      status = "success"
    else if (lp.startTime > now)
      status = "upcoming"
    else if (lp.startTime < now && lp.endTime > now)
      status = "live"
    else if (lp.endTime < now)
      status = "ended"
    else
      status = ""

    result.push({
      chainId,
      presaleType: lp.presaleType,
      address: lp.addr,
      logoUrl: lp.logoUrl,
      token: lp.token,
      buyToken: lp.buyToken,
      tokenName: names[index],
      tokenSymbol: symbols[index],
      tokenDecimals: decimals[index],
      total: lp.total,
      rate: lp.rate,
      hardCap: lp.hardCap,
      softCap: lp.softCap,
      maxBuy: lp.maxBuy,
      amount: lp.amount,
      liquidity: lp.liquidity,
      lockTime: lp.lockTime,
      startTime: lp.startTime,
      endTime: lp.endTime,
      refundable: lp.refundable,
      claimable: lp.claimable,
      whitelist: lp.whitelist,
      whiteListEnableTime: lp.whiteListEnableTime,
      status,
    })
  }

  return result
}

const fetchLaunchpads = async (chainId: number, size: bigint, cursor: bigint): Promise<SerializedLaunchpadData[]> => {
  const client = publicClient({chainId})
  const [[_lpLength]] = await Promise.all([
    client.multicall({
      contracts: [
        {
          abi: launchpadFactoryABI,
          address: getLaunchpadFactoryAddress(chainId),
          functionName: "getContributionsLength"
        }
      ],
    })[0].result
  ])

  const lpLength = _lpLength
  let size_ = size
  let cursor_ = cursor
  if (lpLength < cursor)
    cursor_ = 0n
  else if (lpLength.lt(size + cursor))
    size_ = lpLength.toNumber() - cursor

  const [launchpadsResult] = await Promise.all([
    fetchLaunchpadsData(chainId, size_, cursor_)
  ])
  
  const [result] = await Promise.all([launchpadsTransformer(chainId, launchpadsResult)])

  return result
}

export default fetchLaunchpads
