import { useMemo } from 'react'

import { useBridge} from './useContract'
import { useSingleCallResult } from '../state/multicall/hooks'

function useBridgePool(pid?: bigint) {
  const bridgeContract = useBridge()
  const inputs = useMemo(() => [pid] as const, [pid])
  const poolInfo = useSingleCallResult({contract: bridgeContract, functionName: 'poolInfo', args: inputs}).result

  return useMemo(
    () => (poolInfo ?? undefined),
    [poolInfo],
  )
}

export default useBridgePool
