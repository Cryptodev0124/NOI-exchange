import type { FarmConfigBaseProps, SerializedFarmConfig } from '@pancakeswap/farms'
import { ChainId, Currency, Token, Trade, TradeType } from '@pancakeswap/sdk'
import { TradeWithStableSwap } from '@pancakeswap/smart-router/evm'
import BigNumber from 'bignumber.js'
// a list of tokens by chain
export type ChainMap<T> = {
  readonly [chainId in ChainId]: T
}

export type ChainTokenList = ChainMap<Token[]>

export type TranslatableText =
  | string
  | {
      key: string
      data?: {
        [key: string]: string | number
      }
    }
export interface Address {
  56: string
  [chainId: number]: string
}

export enum PoolIds {
  poolBasic = 'poolBasic',
  poolUnlimited = 'poolUnlimited',
}

export type IfoStatus = 'idle' | 'coming_soon' | 'live' | 'finished'

interface IfoPoolInfo {
  saleAmount?: string
  raiseAmount: string
  cakeToBurn?: string
  distributionRatio?: number // Range [0-1]
}

export interface Ifo {
  id: string
  isActive: boolean
  address: `0x${string}`
  name: string
  currency: Token
  token: Token
  articleUrl: string
  campaignId: string
  tokenOfferingPrice: number
  description?: string
  twitterUrl?: string
  telegramUrl?: string
  version: number
  vestingTitle?: string
  cIFO?: boolean
  plannedStartTime?: number
  [PoolIds.poolBasic]?: IfoPoolInfo
  [PoolIds.poolUnlimited]?: IfoPoolInfo
}

export enum PoolCategory {
  'COMMUNITY' = 'Community',
  'CORE' = 'Core',
  'BINANCE' = 'Binance', // Pools using native BNB behave differently than pools using a token
  'AUTO' = 'Auto',
}

export type { SerializedFarmConfig, FarmConfigBaseProps }

export type Images = {
  lg: string
  md: string
  sm: string
  ipfs?: string
}

export type TeamImages = {
  alt: string
} & Images

export type Team = {
  id: number
  name: string
  description: string
  isJoinable?: boolean
  users: number
  points: number
  images: TeamImages
  background: string
  textColor: string
}

export type CampaignType = 'ifo' | 'teambattle' | 'participation'

export type Campaign = {
  id: string
  type: CampaignType
  title?: TranslatableText
  description?: TranslatableText
  badge?: string
}

export type PageMeta = {
  title: string
  description?: string
  image?: string
}

export enum LotteryStatus {
  PENDING = 'pending',
  OPEN = 'open',
  CLOSE = 'close',
  CLAIMABLE = 'claimable',
}

export interface LotteryTicket {
  id: string
  number: string
  status: boolean
  rewardBracket?: number
  roundId?: string
  cakeReward?: string
}

export interface LotteryTicketClaimData {
  ticketsWithUnclaimedRewards: LotteryTicket[]
  allWinningTickets: LotteryTicket[]
  cakeTotal: BigNumber
  roundId: string
}

// Farm Auction
export interface FarmAuctionBidderConfig {
  account: string
  farmName: string
  tokenAddress: string
  quoteToken: Token
  tokenName: string
  projectSite?: string
  lpAddress?: string
}

// Note: this status is slightly different compared to 'status' config
// from Farm Auction smart contract
export enum AuctionStatus {
  ToBeAnnounced, // No specific dates/blocks to display
  Pending, // Auction is scheduled but not live yet (i.e. waiting for startBlock)
  Open, // Auction is open for bids
  Finished, // Auction end block is reached, bidding is not possible
  Closed, // Auction was closed in smart contract
}

export interface Auction {
  id: number
  status: AuctionStatus
  startBlock: number
  startDate: Date
  endBlock: number
  endDate: Date
  auctionDuration: number
  initialBidAmount: number
  topLeaderboard: number
  leaderboardThreshold: BigNumber
}

export interface BidderAuction {
  id: number
  amount: BigNumber
  claimed: boolean
}

export interface Bidder extends FarmAuctionBidderConfig {
  position?: number
  isTopPosition: boolean
  samePositionAsAbove: boolean
  amount: BigNumber
}

export interface ConnectedBidder {
  account: string
  isWhitelisted: boolean
  bidderData?: Bidder
}

export const FetchStatus = {
  Idle: 'idle',
  Fetching: 'loading',
  Fetched: 'success',
  Failed: 'error',
} as const

export type TFetchStatus = (typeof FetchStatus)[keyof typeof FetchStatus]

export const isV2SwapOrStableSwap = (trade: ITrade): trade is V2TradeAndStableSwap => {
  return Boolean((trade as V2TradeAndStableSwap)?.maximumAmountIn)
}

export const isV2SwapOrMixSwap = (
  trade: ITrade,
): trade is Trade<Currency, Currency, TradeType> | TradeWithStableSwap<Currency, Currency, TradeType> => {
  return Boolean(
    (trade as Trade<Currency, Currency, TradeType> | TradeWithStableSwap<Currency, Currency, TradeType>)?.route,
  )
}

export type ITrade =
  | Trade<Currency, Currency, TradeType>
  | TradeWithStableSwap<Currency, Currency, TradeType>

export type V2TradeAndStableSwap = Trade<Currency, Currency, TradeType>
