import { useCallback } from 'react'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { Ifo } from 'config/constants/types'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20 } from 'hooks/useContract'

const useIfoApprove = (ifo: Ifo, spenderAddress?: string) => {
  const raisingTokenContract = useERC20(ifo.currency.address)
  const { callWithGasPrice } = useCallWithGasPrice()
  const onApprove = useCallback(async () => {
    return callWithGasPrice(raisingTokenContract, 'approve', [spenderAddress as `0x${string}`, MaxUint256])
  }, [spenderAddress, raisingTokenContract, callWithGasPrice])

  return onApprove
}

export default useIfoApprove
