import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { SLOW_INTERVAL } from 'config/constants'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useSWRImmutable from 'swr/immutable'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { lpLocksSelector, tokenLocksSelector } from './selectors'
import { fetchLPLocksPublicDataAsync, fetchTokenLocksPublicDataAsync } from '.'
import { SerializedLPLocksState, SerializedTokenLocksState } from './types'

export const usePollTokenLocks = (start: bigint, end: bigint) => {
  const dispatch = useAppDispatch()
  const { account, chainId } = useAccountActiveChain()

  useSWRImmutable(
    chainId ? ['publicTokenLocksData', start, end, chainId] : null,
    async () => {
      dispatch(fetchTokenLocksPublicDataAsync({ chainId, start, end }))
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )
}

export const useTokenLocks = (): SerializedTokenLocksState | undefined => {
  const { chainId } = useActiveChainId()
  return useSelector(useMemo(() => tokenLocksSelector(chainId), [chainId]))
}

export const usePollLPLocks = (start: bigint, end: bigint) => {
  const dispatch = useAppDispatch()
  const { account, chainId } = useAccountActiveChain()

  useSWRImmutable(
    chainId ? ['publicLPLocksData', start, end, chainId] : null,
    async () => {
      dispatch(fetchLPLocksPublicDataAsync({ chainId, start, end }))
    },
    {
      refreshInterval: SLOW_INTERVAL,
    },
  )
}

export const useLPLocks = (): SerializedLPLocksState => {
  const { chainId } = useActiveChainId()
  return useSelector(useMemo(() => lpLocksSelector(chainId), [chainId]))
}
