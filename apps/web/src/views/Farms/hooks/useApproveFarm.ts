import { useCallback } from 'react'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { useERC20 } from 'hooks/useContract'
import { getMasterchefAddress } from 'utils/addressHelpers'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
// import { verifyBscNetwork } from 'utils/verifyBscNetwork'

const useApproveFarm = (lpContract: ReturnType<typeof useERC20>, chainId: number) => {
  // const isBscNetwork = verifyBscNetwork(chainId)
  const contractAddress = getMasterchefAddress(chainId)

  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async () => {
    return callWithGasPrice(lpContract, 'approve', [contractAddress, MaxUint256])
  }, [lpContract, contractAddress, callWithGasPrice])

  return { onApprove: handleApprove }
}

export default useApproveFarm

export const useApproveBoostProxyFarm = (lpContract: ReturnType<typeof useERC20>, proxyAddress?: `0x${string}`) => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async () => {
    return proxyAddress && callWithGasPrice(lpContract, 'approve', [proxyAddress, MaxUint256])
  }, [lpContract, proxyAddress, callWithGasPrice])

  return { onApprove: handleApprove }
}
