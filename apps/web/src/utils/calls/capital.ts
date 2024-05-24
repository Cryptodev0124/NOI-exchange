import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from 'config'

export const harvestBond = async (bondContract, account, stake, gasPrice, gasLimit?: number) => {
  return bondContract.write.redeem([account, stake], {
    gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

export const mintBond = async (bondContract, account, value, maxPremium, gasPrice, gasLimit?: number) => {
  return bondContract.write.deposit([value, maxPremium, account], {
    gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

export const stakeVault = async (stakingContract, account, value, gasPrice, gasLimit?: number) => {
  return stakingContract.write.stake([value, account], {
    gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

export const unstakeVault = async (stakingContract, account, value, gasPrice, gasLimit?: number) => {
  return stakingContract.write.stake([value, true], {
    gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}
