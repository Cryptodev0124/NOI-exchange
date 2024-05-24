import { ChainId } from "@pancakeswap/sdk"

export interface SerializedLPLockData {
  chainId: number
  address: string
  token0Name: string
  token1Name: string
  token0Symbol: string
  token1Symbol: string
  token0Decimals: number
  token1Decimals: number
  amount: string
}

export interface SerializedTokenLockData {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  amount: string
}

export interface SerializedTokenLocksState {
  data: SerializedTokenLockData[]
  chainId: number
  loadingKeys: Record<string, boolean>
}

export interface SerializedLPLocksState {
  data: SerializedLPLockData[]
  chainId: number
  loadingKeys: Record<string, boolean>
}

export const supportedChainId = [ChainId.ETHEREUM]