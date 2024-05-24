import { ifosConfig } from 'config/constants'
import IfoCardV2Data from './components/IfoCardV2Data'

const activeIfo = ifosConfig.find((ifo) => ifo.isActive)

const PastIfo = () => {
  return (
      <IfoCardV2Data key={activeIfo?.id} ifo={activeIfo!} />
  )
}

export default PastIfo
