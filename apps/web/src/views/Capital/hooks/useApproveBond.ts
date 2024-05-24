import { useCallback } from 'react'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { useERC20 } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

const useApproveBond = (lpContract: ReturnType<typeof useERC20>, bondAddress: string) => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async () => {
    return callWithGasPrice(lpContract, 'approve', [bondAddress as `0x${string}`, MaxUint256])
  }, [lpContract, bondAddress, callWithGasPrice])

  return { onApprove: handleApprove }
}

export default useApproveBond
