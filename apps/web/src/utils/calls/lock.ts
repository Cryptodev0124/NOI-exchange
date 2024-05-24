// import { ethers } from "ethers"

export const lock = async (lockerContract, token, owner, isLP, amount, unlockDate, title, gasPrice, gasLimit?: number) => {
  return lockerContract.write.lock([owner, token, isLP, amount, unlockDate, title], {
    // gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

export const vestingLock = async (lockerContract, token, owner, isLP, amount, unlockDate, tgeBps, cycle, cycleBps, title, gasPrice, gasLimit?: number) => {
  return lockerContract.write.vestingLock([owner, token, isLP, amount, unlockDate, tgeBps, cycle, cycleBps, title], {
    // gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

export const transferOwnership = async (lockerContract, id, owner, gasPrice, gasLimit?: number) => {
  return lockerContract.write.transferLockOwnership([id, owner], {
    // gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

export const renounceOwnership = async (lockerContract, id, gasPrice, gasLimit?: number) => {
  return lockerContract.write.renounceLockOwnership([id], {
    // gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

export const editLockDescription = async (lockerContract, id, description, gasPrice, gasLimit?: number) => {
  return lockerContract.write.editLockDescription([id, description], {
    // gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

export const editLock = async (lockerContract, id, amount, date, gasPrice, gasLimit?: number) => {
  return lockerContract.write.editLock([id, amount, date], {
    // gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

export const unlock = async (lockerContract, id, gasPrice, gasLimit?: number) => {
  return lockerContract.write.unlock([id], {
    // gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}
