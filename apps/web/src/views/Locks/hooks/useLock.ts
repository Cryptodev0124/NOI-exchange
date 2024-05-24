import { useCallback } from 'react'
import { unlock, transferOwnership, renounceOwnership, editLock, editLockDescription } from 'utils/calls'
import { useLocker } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'

const useLock = () => {
  const gasPrice = useGasPrice()
  const locker = useLocker()

  const handleUnlock = useCallback(
    async (id) => {
      return unlock(locker, id, gasPrice)
    },
    [locker, gasPrice],
  )

  const handleTransferOwnership = useCallback(
    async (id, owner) => {
      return transferOwnership(locker, id, owner, gasPrice)
    },
    [locker, gasPrice],
  )

  const handleRenounceOwnership = useCallback(
    async (id) => {
      return renounceOwnership(locker, id, gasPrice)
    },
    [locker, gasPrice],
  )

  const handleEditLock = useCallback(
    async (id, amount, date) => {
      return editLock(locker, id, amount, date, gasPrice)
    },
    [locker, gasPrice],
  )

  const handleEditLockDescription = useCallback(
    async (id, description) => {
      return editLockDescription(locker, id, description, gasPrice)
    },
    [locker, gasPrice],
  )

  return { 
    onUnlock: handleUnlock, 
    onTransferOwnership: handleTransferOwnership,
    onRenounceOwnership: handleRenounceOwnership,
    onEditLock: handleEditLock,
    onEditLockDescription: handleEditLockDescription,
  }
}

export default useLock
