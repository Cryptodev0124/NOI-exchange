import { useCallback } from 'react'
import { lock, vestingLock } from 'utils/calls'
import { useLocker } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const useCreateLock = () => {
  const gasPrice = useGasPrice()
  const locker = useLocker()

  const handleCreateLock = useCallback(
    async (token, owner, isLP, amount, unlockDate, title) => {
      return lock(locker, token, owner, isLP, amount, unlockDate, title, gasPrice)
    },
    [locker, gasPrice],
  )

  const handleCreateVestingLock = useCallback(
    async (token, owner, isLP, amount, unlockDate, tgeBps, cycle, cycleBps, title) => {
      return vestingLock(locker, token, owner, isLP, amount, unlockDate, tgeBps, cycle, cycleBps, title, gasPrice)
    },
    [locker, gasPrice],
  )

  return { onCreateLock: handleCreateLock, onCreateVestingLock: handleCreateVestingLock }
}

export default useCreateLock
