import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

export const tokenLocksSelector = (chainId: number) =>
  createSelector(
    (state: State) => state.tokenLocks,
    (tokenLocks) => {
      const { data, loadingKeys } = tokenLocks

      return {
        data,
        chainId,
        loadingKeys
      }
    },
  )

export const lpLocksSelector = (chainId: number) =>
  createSelector(
    (state: State) => state.lpLocks,
    (lpLocks) => {
      const { data, loadingKeys } = lpLocks

      return {
        data,
        chainId,
        loadingKeys
      }
    },
  )
