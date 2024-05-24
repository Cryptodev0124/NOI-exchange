// import { ChainId } from '@pancakeswap/sdk'
// import { useActiveChainId } from 'hooks/useActiveChainId'
// import { useRouter } from 'next/router'
// import { useAppDispatch } from 'state'
// import LockedToken from 'views/LockedToken'

// const TokenPage = () => {
//   const router = useRouter()
//   const { chainId } = useActiveChainId()
//   const dispatch = useAppDispatch()

//   const token = router.query.token as string
//   return <LockedToken token={token} />
// }

// TokenPage.chains = [ChainId.ARBITRUM, ChainId.BSC, ChainId.POLYGON]

// export default TokenPage

import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useRouter } from 'next/router'
import { Address } from 'viem'
import { useAppDispatch } from 'state'
import LockByToken from 'views/Locks/LockByToken'

const LockByTokenPage = () => {
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()

  const token = router.query.token as Address
  return <LockByToken token={token} />
}

LockByTokenPage.chains = [ChainId.ETHEREUM]

export default LockByTokenPage