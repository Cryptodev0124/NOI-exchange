import latinise from '@pancakeswap/utils/latinise'
import { SerializedTokenLockData } from 'state/locks/types'

export const filterPoolsByQuery = (pools: SerializedTokenLockData[], query: string): SerializedTokenLockData[] => {
  if (query) {
    const queryParts = latinise(query.toLowerCase()).trim().split(' ')
    return pools.filter((pool: SerializedTokenLockData) => {
      const poolSymbol = latinise(pool.address.toLowerCase())
      return queryParts.every((queryPart) => {
        return poolSymbol.includes(queryPart)
      })
    })
  }
  return pools
}
