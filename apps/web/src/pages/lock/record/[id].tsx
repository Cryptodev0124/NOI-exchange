// import { ChainId } from '@pancakeswap/sdk'
// import { useActiveChainId } from 'hooks/useActiveChainId'
// import { useRouter } from 'next/router'
// import { useAppDispatch } from 'state'
// import LockedRecord from 'views/LockedRecord'

// const RecordPage = () => {
//   const router = useRouter()
//   const { chainId } = useActiveChainId()
//   const dispatch = useAppDispatch()

//   const id = router.query.id as string
//   return <LockedRecord id={id} />
// }

// RecordPage.chains = [ChainId.ARBITRUM, ChainId.BSC, ChainId.POLYGON]

// export default RecordPage

import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'state'
import LockById from 'views/Locks/LockById'

const LockByIdPage = () => {
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()

  const id = router.query.id as string
  return <LockById id={id} />
}

LockByIdPage.chains = [ChainId.ETHEREUM]

export default LockByIdPage