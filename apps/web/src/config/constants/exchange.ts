import { ChainId, Percent, Token, WNATIVE } from '@pancakeswap/sdk'
import { bscTokens, USDC, USDT, WBTC_ETH, DAI_ETH, WBTC_ARB, DAI_ARB, GTOKEN, arbitrumTokens, shimmer2Tokens, WBTC_POLYGON, DAI_POLYGON} from '@pancakeswap/tokens'
import { ChainMap, ChainTokenList } from './types'

export const ROUTER_ADDRESS: ChainMap<string> = {
  [ChainId.ETHEREUM]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  [ChainId.ARBITRUM]: '0xac6495Faa2f209B7d07A4e5E0595df8221626DFA',
  [ChainId.BSC]: '0xac6495Faa2f209B7d07A4e5E0595df8221626DFA',
  [ChainId.POLYGON]: '0xac6495Faa2f209B7d07A4e5E0595df8221626DFA',
  [ChainId.SHIMMER2]: '0xac6495Faa2f209B7d07A4e5E0595df8221626DFA',
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.ETHEREUM]: [WNATIVE[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WBTC_ETH],
  [ChainId.ARBITRUM]: [WNATIVE[ChainId.ARBITRUM], USDC[ChainId.ARBITRUM], USDT[ChainId.ARBITRUM], WBTC_ARB],
  [ChainId.POLYGON]: [WNATIVE[ChainId.POLYGON], USDC[ChainId.POLYGON], USDT[ChainId.POLYGON], WBTC_POLYGON],
  [ChainId.BSC]: [
    bscTokens.wbnb,
    bscTokens.cake,
    bscTokens.busd,
    bscTokens.usdt,
    bscTokens.btcb,
    bscTokens.eth,
    bscTokens.usdc,
  ],
  [ChainId.SHIMMER2]: [
    shimmer2Tokens.smr,
    shimmer2Tokens.gtoken,
    shimmer2Tokens.usdc,
    shimmer2Tokens.usdt,
    shimmer2Tokens.wbtc,
    shimmer2Tokens.eth,
  ],
}

/**
 * Additional bases for specific tokens
 * @example { [WBTC.address]: [renBTC], [renBTC.address]: [WBTC] }
 */
export const ADDITIONAL_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.BSC]: {
    // SNFTS-SFUND
    [bscTokens.snfts.address]: [bscTokens.sfund],
  },
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 * @example [AMPL.address]: [DAI, WNATIVE[ChainId.BSC]]
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.BSC]: {},
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  [ChainId.ETHEREUM]: [WNATIVE[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WBTC_ETH, DAI_ETH],
  [ChainId.POLYGON]: [WNATIVE[ChainId.POLYGON], USDC[ChainId.POLYGON], USDT[ChainId.POLYGON], WBTC_POLYGON, DAI_POLYGON],
  [ChainId.ARBITRUM]: [WNATIVE[ChainId.ARBITRUM], arbitrumTokens.arb, GTOKEN[ChainId.ARBITRUM], arbitrumTokens.dcp, DAI_ARB, USDC[ChainId.ARBITRUM], USDT[ChainId.ARBITRUM], WBTC_ARB],
  [ChainId.BSC]: [WNATIVE[ChainId.BSC], GTOKEN[ChainId.BSC], bscTokens.usdt, bscTokens.usdc, bscTokens.dai, bscTokens.eth, bscTokens.btcb, bscTokens.cake],
  [ChainId.SHIMMER2]: [shimmer2Tokens.smr, shimmer2Tokens.gtoken, shimmer2Tokens.usdc, shimmer2Tokens.usdt, shimmer2Tokens.wbtc, shimmer2Tokens.eth],
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  [ChainId.ETHEREUM]: [USDC[ChainId.ETHEREUM], WNATIVE[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM], WBTC_ETH],
  [ChainId.POLYGON]: [USDC[ChainId.POLYGON], WNATIVE[ChainId.POLYGON], USDT[ChainId.POLYGON], WBTC_POLYGON],
  [ChainId.ARBITRUM]: [USDC[ChainId.ARBITRUM], WNATIVE[ChainId.ARBITRUM], USDT[ChainId.ARBITRUM], WBTC_ARB],
  [ChainId.BSC]: [bscTokens.wbnb, bscTokens.dai, bscTokens.busd, bscTokens.usdt, bscTokens.cake],
  [ChainId.SHIMMER2]: [shimmer2Tokens.smr, shimmer2Tokens.gtoken, shimmer2Tokens.usdc, shimmer2Tokens.usdt, shimmer2Tokens.wbtc, shimmer2Tokens.eth],
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.ETHEREUM]: [
    [WNATIVE[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM]],
    [WBTC_ETH, WNATIVE[ChainId.ETHEREUM]],
    [WNATIVE[ChainId.ETHEREUM], USDT[ChainId.ETHEREUM]],
  ],
  [ChainId.POLYGON]: [
    [WNATIVE[ChainId.POLYGON], USDC[ChainId.POLYGON]],
    [WBTC_POLYGON, WNATIVE[ChainId.POLYGON]],
    [WNATIVE[ChainId.POLYGON], USDT[ChainId.POLYGON]],
  ],
  [ChainId.ARBITRUM]: [
    [WNATIVE[ChainId.ARBITRUM], USDC[ChainId.ARBITRUM]],
    [WBTC_ARB, WNATIVE[ChainId.ARBITRUM]],
    [WNATIVE[ChainId.ARBITRUM], USDT[ChainId.ARBITRUM]],
  ],
  [ChainId.BSC]: [
    [bscTokens.cake, bscTokens.wbnb],
    [bscTokens.busd, bscTokens.usdt],
    [bscTokens.dai, bscTokens.usdt],
  ],
  [ChainId.SHIMMER2]: [
    [shimmer2Tokens.gtoken, shimmer2Tokens.smr],
    [shimmer2Tokens.smr, shimmer2Tokens.usdt],
    [shimmer2Tokens.smr, shimmer2Tokens.usdt],
  ],
}

export const BIG_INT_ZERO = 0n
export const BIG_INT_TEN = 10n

// one basis point
export const BIPS_BASE = 10000n
export const ONE_BIPS = new Percent(1n, BIPS_BASE)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(100n, BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(300n, BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(500n, BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(1000n, BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(1500n, BIPS_BASE) // 15%

// used to ensure the user doesn't send so much BNB so they end up with <.01
export const MIN_BNB: bigint = BIG_INT_TEN ** 15n // .001 BNB
export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(50n, BIPS_BASE)

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

export const BASE_FEE = new Percent(25n, BIPS_BASE)
export const INPUT_FRACTION_AFTER_FEE = ONE_HUNDRED_PERCENT.subtract(BASE_FEE)

// BNB
export const DEFAULT_INPUT_CURRENCY = 'ETH'
// CAKE
export const DEFAULT_OUTPUT_CURRENCY = '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82'

export const EXCHANGE_PAGE_PATHS = ['/swap', 'liquidity', '/add', '/find', '/remove']
