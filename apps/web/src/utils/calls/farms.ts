import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from 'config'
import { getMasterchefContract } from 'utils/contractHelpers'

type MasterchefContract = ReturnType<typeof getMasterchefContract>

export const stakeFarm = async (masterChefContract: MasterchefContract, pid, amount, gasPrice, gasLimit?: bigint) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
  if (pid !== 0) {
    return masterChefContract.write.deposit([pid, BigInt(value)], {
      gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
      // gasPrice,
      account: masterChefContract.account ?? '0x',
      chain: masterChefContract.chain
    })
  }
  return masterChefContract.write.enterStaking([BigInt(value)], {
    gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
    account: masterChefContract.account ?? '0x',
    chain: masterChefContract.chain
  })
}

export const unstakeFarm = async (masterChefContract: MasterchefContract, pid, amount, gasPrice, gasLimit?: bigint) => {
  const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()

  if (pid !== 0) {
    return masterChefContract.write.withdraw([pid, BigInt(value)], {
      gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
      // gasPrice,
      account: masterChefContract.account ?? '0x',
      chain: masterChefContract.chain
    })
  }
  return masterChefContract.write.leaveStaking([BigInt(value)], {
    gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
    account: masterChefContract.account ?? '0x',
    chain: masterChefContract.chain
  })
}

export const harvestFarm = async (masterChefContract: MasterchefContract, pid, gasPrice, gasLimit?: bigint) => {
  if (pid !== 0) {
    return masterChefContract.write.deposit([pid, 0n], {
      gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
      // gasPrice,
      account: masterChefContract.account ?? '0x',
      chain: masterChefContract.chain
    })
  }
  return masterChefContract.write.enterStaking([0n], {
    gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
    account: masterChefContract.account ?? '0x',
    chain: masterChefContract.chain
  })
}
