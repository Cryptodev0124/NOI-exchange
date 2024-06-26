import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'state'
import Launchpad from 'views/Launchpad'

const LaunchpadPage = () => {
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()

  const pool = router.query.pool as `0x${string}`
  return <Launchpad pool={pool} />
}

LaunchpadPage.chains = [ChainId.ETHEREUM]

export default LaunchpadPage