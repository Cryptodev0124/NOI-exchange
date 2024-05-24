import BigNumber from 'bignumber.js'
import { Address } from 'viem'
import {launchpadForETHABI} from 'config/abi/launchpadForETH'
import {fairLaunchForETHABI} from 'config/abi/fairLaunchForETH'
import { publicClient } from 'utils/wagmi'
import { SerializedLaunchpad } from './types'

const LAUNCHPAD_VARIABLES = ['presaleType', 'token', 'buyToken', 'presaleStartTimestamp', 'presaleEndTimestamp', 'softCap', 'hardCap', 'minBuy', 'maxBuy', 'rate', 'listingRate', 'lockPeriod', 'isAutoListing', 'vestingFirst', 'vestingPeriod', 'vestingEach', 'mainFee', 'tokenFee', 'liquidity', 'router', 'locker', 'feeAddress', 'tokenBackAddress', 'whiteListEnableTime', 'totalDepositedBalance', 'totalClaimedAmount', 'investors', 'refundable', 'claimable', 'initialized', 'info', 'logoUrl', 'website', 'twitter', 'facebook', 'github', 'telegram', 'instagram', 'discord', 'reddit', 'youtube', 'whitelist', 'getWhiteListLength']
const FAIRLAUNCH_VARIABLES = ['presaleType', 'token', 'buyToken', 'presaleStartTimestamp', 'presaleEndTimestamp', 'softCap', 'maxBuy', 'total', 'listingRate', 'lockPeriod', 'vestingFirst', 'vestingPeriod', 'vestingEach', 'mainFee', 'tokenFee', 'liquidity', 'router', 'locker', 'feeAddress', 'totalDepositedBalance', 'totalClaimedAmount', 'investors', 'refundable', 'claimable', 'initialized', 'info', 'logoUrl', 'website', 'twitter', 'facebook', 'github', 'telegram', 'instagram', 'discord', 'reddit', 'youtube', 'whitelist', 'getWhiteListLength']

const calls = (launchpad: Address, presaleType: string) => {
  if (presaleType === "standard")
    return LAUNCHPAD_VARIABLES.map((val) => { return {
      abi: launchpadForETHABI,
      address: launchpad,
      functionName: val,
    }})
  return FAIRLAUNCH_VARIABLES.map((val) => { return {
    abi: fairLaunchForETHABI,
    address: launchpad,
    functionName: val,
  }})
}

export const fetchLaunchpadData = async (launchpad: Address, chainId: number, presaleType?: string): Promise<any[]> => {
  const client = publicClient({chainId})
  // @ts-ignore
  const launchpadMultiCallResult = await client.multicall({ contracts: calls(launchpad, presaleType), allowFailure: true })
  return launchpadMultiCallResult
}

function launchpadTransformer (chainId: number, launchpadResult : any[]) {
  const [
    presaleType,
    token,
    buyToken,
    presaleStartTimestamp,
    presaleEndTimestamp,
    softCap,
    hardCap,
    minBuy,
    maxBuy,
    rate,
    listingRate,
    lockPeriod,
    isAutoListing,
    vestingFirst,
    vestingPeriod,
    vestingEach,
    mainFee,
    tokenFee,
    liquidity,
    router,
    locker,
    feeAddress,
    tokenBackAddress,
    whiteListEnableTime,
    totalDepositedBalance,
    totalClaimedAmount,
    investors,
    refundable,
    claimable,
    initialized,
    info,
    logoUrl,
    website,
    twitter,
    facebook,
    github,
    telegram,
    instagram,
    discord,
    reddit,
    youtube,
    whitelist,
    whitelistLength
  ] = launchpadResult

  return {
    chainId,
    presaleType,
    token,
    buyToken,
    presaleStartTimestamp,
    presaleEndTimestamp,
    softCap,
    hardCap,
    minBuy,
    maxBuy,
    rate,
    listingRate,
    lockPeriod,
    isAutoListing,
    vestingFirst,
    vestingPeriod,
    vestingEach,
    mainFee,
    tokenFee,
    liquidity,
    router,
    locker,
    feeAddress,
    tokenBackAddress,
    whiteListEnableTime,
    totalDepositedBalance,
    totalClaimedAmount,
    investors,
    refundable,
    claimable,
    initialized,
    info,
    logoUrl,
    website,
    twitter,
    facebook,
    github,
    telegram,
    instagram,
    discord,
    reddit,
    youtube,
    whitelist,
    whitelistLength,
  }
}

function fairlaunchTransformer (chainId: number, launchpadResult : any[]) {
  const [
    presaleType,
    token,
    buyToken,
    presaleStartTimestamp,
    presaleEndTimestamp,
    softCap,
    maxBuy,
    total,
    listingRate,
    lockPeriod,
    vestingFirst,
    vestingPeriod,
    vestingEach,
    mainFee,
    tokenFee,
    liquidity,
    router,
    locker,
    feeAddress,
    totalDepositedBalance,
    totalClaimedAmount,
    investors,
    refundable,
    claimable,
    initialized,
    info,
    logoUrl,
    website,
    twitter,
    facebook,
    github,
    telegram,
    instagram,
    discord,
    reddit,
    youtube,
    whitelist,
    whitelistLength
  ] = launchpadResult

  return {
    chainId,
    presaleType,
    token,
    buyToken,
    presaleStartTimestamp,
    presaleEndTimestamp,
    softCap,
    hardCap: 0,
    maxBuy,
    minBuy: 0,
    rate: 0,
    isAutoListing: true,
    whiteListEnableTime: 0,
    tokenBackAddress: "0",
    total,
    listingRate,
    lockPeriod,
    vestingFirst,
    vestingPeriod,
    vestingEach,
    mainFee,
    tokenFee,
    liquidity,
    router,
    locker,
    feeAddress,
    totalDepositedBalance,
    totalClaimedAmount,
    investors,
    refundable,
    claimable,
    initialized,
    info,
    logoUrl,
    website,
    twitter,
    facebook,
    github,
    telegram,
    instagram,
    discord,
    reddit,
    youtube,
    whitelist,
    whitelistLength,
  }
}

const fetchLaunchpad = async (launchpad: Address, chainId: number): Promise<SerializedLaunchpad> => {
  const client = publicClient({chainId})
  const [[presaleType]] = await Promise.all([
    client.multicall({
      contracts: [
        {
          address: launchpad,
          functionName: "presaleType",
          abi: launchpadForETHABI,
        }
      ],
    })
  ])

  const [launchpadResult] = await Promise.all([
    fetchLaunchpadData(launchpad, chainId, presaleType?.result)
  ])

  if (presaleType.result === "standard")
    return launchpadTransformer(chainId, launchpadResult)
  return fairlaunchTransformer(chainId, launchpadResult)
}

export default fetchLaunchpad
