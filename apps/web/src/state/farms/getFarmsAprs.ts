import BigNumber from 'bignumber.js'
import { SerializedFarm } from '@pancakeswap/farms'

// copy from src/config, should merge them later
const BSC_BLOCK_TIME = 0.3
const BLOCKS_PER_YEAR = (60 / BSC_BLOCK_TIME) * 60 * 24 * 365 // 10512000

const getFarmsAprs = (farms: SerializedFarm[], cakePriceBusd: number, regularCakePerBlock: number) => {
  const farmsWithAprs = farms.map((farm) => {
    let cakeRewardsAprAsString = '0'
    if (!cakePriceBusd) {
      return cakeRewardsAprAsString
    }

    const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken!).times(farm.quoteTokenPriceBusd!)
    const poolWeight = new BigNumber(farm.poolWeight!)
    if (totalLiquidity.isZero() || poolWeight.isZero()) {
      return cakeRewardsAprAsString
    }
    const yearlyCakeRewardAllocation = poolWeight
      ? poolWeight.times(BLOCKS_PER_YEAR).times(regularCakePerBlock)
      : new BigNumber(0)
    const cakeRewardsApr = yearlyCakeRewardAllocation.times(cakePriceBusd).div(totalLiquidity).times(100)
    
    if (!cakeRewardsApr.isZero()) {
      cakeRewardsAprAsString = cakeRewardsApr.toFixed(2)
    }

    return {
      ...farm,
      apr: cakeRewardsAprAsString,
    }
  })

  return farmsWithAprs
}

export default getFarmsAprs
