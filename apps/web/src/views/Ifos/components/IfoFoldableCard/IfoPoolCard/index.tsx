import { ContextApi, useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  HelpIcon,
  Text,
  useTooltip,
  ExpandableLabel,
  CardFooter,
} from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { Ifo, PoolIds } from 'config/constants/types'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import { CardConfigReturn, EnableStatus } from '../types'
import IfoCardActions from './IfoCardActions'
import IfoCardDetails from './IfoCardDetails'
import IfoCardTokens from './IfoCardTokens'
import IfoVestingCard from './IfoVestingCard'

const StyledCard = styled(Card)`
  width: 100%;
  margin: 0 auto;
  padding: 0 0 3px 0;
  height: fit-content;
  background: none;
`
const StyledCardFooter = styled(CardFooter)`
  padding: 16px;
  margin: 0 -12px -12px;
  background: ${({ theme }) => theme.colors.background};
  text-align: center;
`

const StyledCardHeader = styled(CardHeader)`
  background: none;
`

interface IfoCardProps {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  onApprove: () => Promise<any>
  enableStatus: EnableStatus
}

export const cardConfig = (
  t: ContextApi['t'],
  poolId: PoolIds,
  meta: {
    version: number
    needQualifiedPoints?: boolean
    needQualifiedNFT?: boolean
  },
): CardConfigReturn => {
  switch (poolId) {
    case PoolIds.poolBasic:
      if (meta?.version >= 3.1) {
        const MSG_MAP = {
          needQualifiedNFT: t('Set PancakeSquad NFT as Pancake Profile avatar.'),
          needQualifiedPoints: t('Reach a certain Pancake Profile Points threshold.'),
        }

        const msgs = Object.keys(meta)
          .filter((criteria) => meta[criteria])
          .map((criteria) => MSG_MAP[criteria])
          .filter(Boolean)

        return {
          title: t('Private Sale'),
          variant: 'blue',
          tooltip: msgs?.length ? (
            <>
              <Text>
                {msgs.length > 1 // one or multiple
                  ? t('Meet any one of the requirements to join:')
                  : t('Meet the following requirement to join:')}
              </Text>
              {msgs.map((msg) => (
                <Text ml="16px" key={msg} as="li">
                  {msg}
                </Text>
              ))}
            </>
          ) : <></>,
        }
      }

      return {
        title: t('Basic Sale'),
        variant: 'blue',
        tooltip: t(
          'Every person can only commit a limited amount, but may expect a higher return per token committed.',
        ),
      }
    case PoolIds.poolUnlimited:
      return {
        title: meta?.version >= 3.1 ? t('Public Sale') : t('Unlimited Sale'),
        variant: 'violet',
        tooltip: t('No limits on the amount you can commit. Additional fee applies when claiming.'),
      }

    default:
      return { title: '', variant: 'blue', tooltip: '' }
  }
}

const SmallCard: React.FC<React.PropsWithChildren<IfoCardProps>> = ({
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
  onApprove,
  enableStatus,
}) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()

  const { admissionProfile, pointThreshold, vestingInformation } = publicIfoData[poolId] || {}

  const { needQualifiedNFT, needQualifiedPoints } = useMemo(() => {
    return ifo.version >= 3.1 && poolId === PoolIds.poolBasic
      ? {
          needQualifiedNFT: Boolean(admissionProfile),
          needQualifiedPoints: pointThreshold ? pointThreshold > 0 : false,
        }
      : {}
  }, [ifo.version, admissionProfile, pointThreshold, poolId])

  const config = cardConfig(t, poolId, {
    version: ifo.version,
    needQualifiedNFT,
    needQualifiedPoints,
  })

  const { targetRef, tooltip, tooltipVisible } = useTooltip(config.tooltip, { placement: 'bottom' })

  const isLoading = publicIfoData.status === 'idle'

  const cardTitle = ifo.cIFO ? `${config.title} (cIFO)` : config.title

  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      {tooltipVisible && tooltip}
      <StyledCard>
        <StyledCardHeader p="16px 24px" variant={config.variant}>
          <Flex justifyContent="space-between" alignItems="center">
            <Text bold fontSize="20px" lineHeight={1}>
              {cardTitle}
            </Text>
            <div ref={targetRef}>
              <HelpIcon />
            </div>
          </Flex>
        </StyledCardHeader>
        <CardBody p="12px">
          <>
            <IfoCardTokens
              poolId={poolId}
              ifo={ifo}
              publicIfoData={publicIfoData}
              walletIfoData={walletIfoData}
              isLoading={isLoading}
              onApprove={onApprove}
              enableStatus={enableStatus}
            />
            <Box mt="24px">
              <IfoCardActions
                poolId={poolId}
                ifo={ifo}
                publicIfoData={publicIfoData}
                walletIfoData={walletIfoData}
                isLoading={isLoading}
                enableStatus={enableStatus}
              />
            </Box>
            <Box pt="24px">
              <IfoCardDetails
                poolId={poolId}
                ifo={ifo}
                publicIfoData={publicIfoData}
                walletIfoData={walletIfoData}
              />
            </Box>
          </>
        </CardBody>
      </StyledCard>
    </>
  )
}

export default SmallCard
