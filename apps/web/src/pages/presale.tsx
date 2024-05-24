import { CHAIN_IDS } from 'utils/wagmi'
import { IfoPageLayout } from 'views/Ifos'
import Ifo from 'views/Ifos/Ifo'

const CurrentIfoPage = () => {
  return <Ifo />
}

CurrentIfoPage.Layout = IfoPageLayout
CurrentIfoPage.chains = CHAIN_IDS

export default CurrentIfoPage