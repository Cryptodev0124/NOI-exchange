import { ChainId } from '@pancakeswap/sdk'
import { CHAIN_IDS } from 'utils/wagmi'
import PoolFinder from 'views/PoolFinder'

const PoolFinderPage = () => <PoolFinder />

PoolFinderPage.chains = [ChainId.ETHEREUM]

export default PoolFinderPage
