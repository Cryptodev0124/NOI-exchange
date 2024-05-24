import { ChainId } from '@pancakeswap/sdk'
import Locks from 'views/Locks'

const LocksPage = () => {
  return <Locks />
}

LocksPage.chains = [ChainId.ETHEREUM]

export default LocksPage