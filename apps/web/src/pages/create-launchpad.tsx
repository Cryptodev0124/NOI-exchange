import { ChainId } from '@pancakeswap/sdk'
import Launchpad from 'views/CreateLaunchpad'

const LaunchpadPage = () => {
  return <Launchpad />
}

LaunchpadPage.chains = [ChainId.ETHEREUM]

export default LaunchpadPage