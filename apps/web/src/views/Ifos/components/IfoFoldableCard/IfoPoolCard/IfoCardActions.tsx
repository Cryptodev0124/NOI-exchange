import { useTranslation } from '@pancakeswap/localization'
import { Button, NextLinkFromReactRouter, IfoSkeletonCardActions } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { Ifo, PoolIds } from 'config/constants/types'
import { WalletIfoData, PublicIfoData } from 'views/Ifos/types'
import ConnectWalletButton from 'components/ConnectWalletButton'
import ContributeButton from './ContributeButton'
import ClaimButton from './ClaimButton'
import { EnableStatus } from '../types'

interface Props {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  isLoading: boolean
  enableStatus: EnableStatus
}

const IfoCardActions: React.FC<React.PropsWithChildren<Props>> = ({
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
  isLoading,
  enableStatus,
}) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const userPoolCharacteristics = walletIfoData[poolId]

  if (isLoading) {
    return <IfoSkeletonCardActions />
  }

  if (!account) {
    return <ConnectWalletButton width="100%" />
  }

  const needClaim =
    publicIfoData.status === 'finished' &&
    !userPoolCharacteristics?.hasClaimed &&
    (userPoolCharacteristics?.offeringAmountInToken.isGreaterThan(0) ||
      userPoolCharacteristics?.refundingAmountInLP.isGreaterThan(0))

  if (needClaim) {
    return <ClaimButton poolId={poolId} ifoVersion={ifo.version} walletIfoData={walletIfoData} />
  }

  if (enableStatus !== EnableStatus.ENABLED && publicIfoData.status === 'coming_soon') {
    return null
  }

  return (
    <>
      {(publicIfoData.status === 'live' || publicIfoData.status === 'coming_soon') && (
        <ContributeButton poolId={poolId} ifo={ifo} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
      )}
    </>
  )
}

export default IfoCardActions
