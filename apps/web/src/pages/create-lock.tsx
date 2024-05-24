import { ChainId } from '@pancakeswap/sdk'
import CreateLock from 'views/CreateLock'

const CreateLockPage = () => {
  return <CreateLock />
}

CreateLockPage.chains = [ChainId.ETHEREUM]

export default CreateLockPage