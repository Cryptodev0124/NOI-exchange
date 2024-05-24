import { ethers } from "ethers"

export const multiSendToken = async (multisenderContract, token, addresses, amounts, gasPrice, gasLimit?: number) => {
  return multisenderContract.write.multisendToken([token, false, addresses, amounts], {
    // gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

export const multiSendEther = async (multisenderContract, totalAmount, addresses, amounts, gasPrice, gasLimit?: number) => {
  return multisenderContract.write.multisendEther([addresses, amounts], {
    value: ethers.utils.parseEther(totalAmount.toString()),
    // gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

// export const burnETH = async (bridgeContract: Contract, pid, amount, gasPrice, gasLimit?: number) => {
//   return bridgeContract.burnETH(pid, {
//     value: ethers.utils.parseEther(new BigNumber(amount).toString()),
//     gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
//     gasPrice,
//   })
// }
