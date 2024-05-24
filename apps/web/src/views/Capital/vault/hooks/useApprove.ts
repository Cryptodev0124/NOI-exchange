import { useCallback } from 'react'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { useERC20 } from 'hooks/useContract'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

const useApprove = (contract: ReturnType<typeof useERC20>, address: string) => {
  const { callWithGasPrice } = useCallWithGasPrice()
  const handleApprove = useCallback(async () => {
    return callWithGasPrice(contract, 'approve', [address as `0x${string}`, MaxUint256])
  }, [contract, address, callWithGasPrice])

  return { onApprove: handleApprove }
}

export default useApprove
