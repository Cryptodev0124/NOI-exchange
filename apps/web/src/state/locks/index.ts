import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import type {
  UnknownAsyncThunkFulfilledAction,
  UnknownAsyncThunkPendingAction,
  UnknownAsyncThunkRejectedAction,
} from '@reduxjs/toolkit/dist/matchers'
import stringify from 'fast-json-stable-stringify'
import type { AppState } from 'state'
import { chains } from 'utils/wagmi'
import { SerializedTokenLockData, SerializedTokenLocksState, SerializedLPLockData, SerializedLPLocksState, supportedChainId } from './types'
import fetchTokenLocks from './fetchTokenLocks'
import fetchLPLocks from './fetchLPLocks'

const initialTokenLocksState: SerializedTokenLocksState = {
  data: [],
  chainId: 148,
  loadingKeys: {},
}

const initialLPLocksState: SerializedLPLocksState = {
  data: [],
  chainId: 148,
  loadingKeys: {},
}

// Async thunks
export const fetchInitialTokenLocksData = createAsyncThunk<
  { tokenLocks: SerializedTokenLockData[], chainId: number },
  { chainId: number },
  {
    state: AppState
  }
>('tokenLocks/fetchInitialTokenLocksData', async ({ chainId }) => {
  return {
    tokenLocks: [],
    chainId,
  }
})

export const fetchInitialLPLocksData = createAsyncThunk<
  { lpLocks: SerializedLPLockData[], chainId: number },
  { chainId: number },
  {
    state: AppState
  }
>('lpLocks/fetchInitialLPLocksData', async ({ chainId }) => {
  return {
    lpLocks: [],
    chainId,
  }
})

export const fetchTokenLocksPublicDataAsync = createAsyncThunk<
  SerializedTokenLockData[],
  { chainId: number; start: bigint; end: bigint; },
  {
    state: AppState
  }
>(
  'tokenLocks/fetchTokenLocksPublicDataAsync',
  async ({ chainId, start, end }, { dispatch, getState }) => {
    const state = getState()
    if (state.tokenLocks.chainId !== chainId) {
      await dispatch(fetchInitialTokenLocksData({ chainId }))
    }
    const chain = chains.find((c) => c.id === chainId)
    if (!chain || !supportedChainId.includes(chainId)) throw new Error('chain not supported')
    try {
      return await fetchTokenLocks(chainId, start, end)
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  {
    condition: (arg, { getState }) => {
      const { tokenLocks } = getState()
      if (tokenLocks.loadingKeys?.[stringify({ type: fetchTokenLocksPublicDataAsync.typePrefix, arg })]) {
        console.debug('locks action is fetching, skipping here')
        return false
      }
      return true
    },
  },
)

export const fetchLPLocksPublicDataAsync = createAsyncThunk<
  SerializedLPLockData[],
  { chainId: number; start: bigint; end: bigint; },
  {
    state: AppState
  }
>(
  'lpLocks/fetchLPLocksPublicDataAsync',
  async ({ chainId, start, end }, { dispatch, getState }) => {
    const state = getState()
    if (state.lpLocks.chainId !== chainId) {
      await dispatch(fetchInitialLPLocksData({ chainId }))
    }
    const chain = chains.find((c) => c.id === chainId)
    if (!chain || !supportedChainId.includes(chainId)) throw new Error('chain not supported')
    try {
      return await fetchLPLocks(chainId, start, end)
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  {
    condition: (arg, { getState }) => {
      const { lpLocks } = getState()
      if (lpLocks.loadingKeys[stringify({ type: fetchLPLocksPublicDataAsync.typePrefix, arg })]) {
        console.debug('locks action is fetching, skipping here')
        return false
      }
      return true
    },
  },
)

type UnknownAsyncThunkFulfilledOrPendingAction =
  | UnknownAsyncThunkFulfilledAction
  | UnknownAsyncThunkPendingAction
  | UnknownAsyncThunkRejectedAction

const serializeLoadingKey = (
  action: UnknownAsyncThunkFulfilledOrPendingAction,
  suffix: UnknownAsyncThunkFulfilledOrPendingAction['meta']['requestStatus'],
) => {
  const type = action.type.split(`/${suffix}`)[0]
  return stringify({
    arg: action.meta.arg,
    type,
  })
}

export const tokenLocksSlice = createSlice({
  name: 'TokenLocks',
  initialState: initialTokenLocksState,
  reducers: {},
  extraReducers: (builder) => {
    // Init tokenLock data
    builder.addCase(fetchInitialTokenLocksData.fulfilled, (state, action) => {
      const { tokenLocks, chainId } = action.payload
      state.data = tokenLocks
      state.chainId = chainId
    })

    // Update tokenLock with live data
    builder.addCase(fetchTokenLocksPublicDataAsync.fulfilled, (state, action) => {
      const data= action.payload
      state.data = data
    })

    builder.addMatcher(isAnyOf(fetchTokenLocksPublicDataAsync.pending, fetchTokenLocksPublicDataAsync.pending), (state, action) => {
      state.loadingKeys[serializeLoadingKey(action, 'pending')] = true
    })
    builder.addMatcher(
      isAnyOf(fetchTokenLocksPublicDataAsync.rejected, fetchTokenLocksPublicDataAsync.rejected),
      (state, action) => {
        state.loadingKeys[serializeLoadingKey(action, 'rejected')] = false
      },
    )
  },
})

export const lpLocksSlice = createSlice({
  name: 'LPLocks',
  initialState: initialLPLocksState,
  reducers: {},
  extraReducers: (builder) => {
    // Init lpLock data
    builder.addCase(fetchInitialLPLocksData.fulfilled, (state, action) => {
      const { lpLocks, chainId } = action.payload
      state.data = lpLocks
      state.chainId = chainId
    })

    // Update lpLock with live data
    builder.addCase(fetchLPLocksPublicDataAsync.fulfilled, (state, action) => {
      const data= action.payload
      state.data = data
    })

    builder.addMatcher(isAnyOf(fetchLPLocksPublicDataAsync.pending, fetchLPLocksPublicDataAsync.pending), (state, action) => {
      state.loadingKeys[serializeLoadingKey(action, 'pending')] = true
    })
    builder.addMatcher(
      isAnyOf(fetchLPLocksPublicDataAsync.rejected, fetchLPLocksPublicDataAsync.rejected),
      (state, action) => {
        state.loadingKeys[serializeLoadingKey(action, 'rejected')] = false
      },
    )
  },
})
