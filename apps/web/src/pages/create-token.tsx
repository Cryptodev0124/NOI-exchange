import { ChainId } from '@pancakeswap/sdk'
import CreateToken from 'views/CreateToken'

const CreateTokenPage = () => {
  return <CreateToken />
}

CreateTokenPage.chains = [ChainId.ETHEREUM]

export default CreateTokenPage