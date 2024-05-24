import { Token } from "@pancakeswap/sdk"

export enum TokenFormView {
  Create,
  Finish,
}

export interface TokenData {
  name: string
  symbol: string
  decimals: string
  totalSupply: string
  type: string
  liquidityGen?: LiquidityGen
  baby?: Baby
  buyBackBaby?: BuyBackBaby
}

export interface LiquidityGen {
  taxFee1: string
  liquidityFee1: string
  charityAddr1: string
  charityFee1: string
}

export interface Baby {
  rewardToken2: Token | null
  minBalance2: string
  rewardFee2: string
  liquidity2: string
  charityAddr2: string
  charityFee2: string
}

export interface BuyBackBaby {
  rewardToken3: Token | null
  liquidityFee3: string
  buyBackFee3: string
  reflectionFee3: string
  charityFee3: string
}

export interface FinishData {
  address?: `0x${string}` | null
  hash: string
  chainId: number
}