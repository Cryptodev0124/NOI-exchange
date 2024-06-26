import { useMemo } from 'react'
import {
  Text,
  Flex,
  Box,
  CheckmarkCircleIcon,
  FlexProps,
  HelpIcon,
  useTooltip,
  Button,
  AutoRenewIcon,
  BunnyPlaceholderIcon,
  Message,
  MessageText,
  ErrorIcon,
  BalanceWithLoading,
  IfoSkeletonCardTokens,
  IfoPercentageOfTotal,
  IfoVestingAvailableToClaim,
} from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { Token } from '@pancakeswap/sdk'
import { Ifo, PoolIds } from 'config/constants/types'
import { bscTokens } from '@pancakeswap/tokens'
import { cakeBnbLpToken } from 'config/constants/ifo'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import { useTranslation } from '@pancakeswap/localization'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { getBalanceNumber, formatNumber } from '@pancakeswap/utils/formatBalance'
import { TokenImage, TokenPairImage } from 'components/TokenImage'
import { EnableStatus } from '../types'
import IFORequirements from './IFORequirements'
import { MessageTextLink } from '../../IfoCardStyles'
import StakeVaultButton from '../StakeVaultButton'

interface TokenSectionProps extends FlexProps {
  primaryToken?: Token
  secondaryToken?: Token
}

const TokenSection: React.FC<React.PropsWithChildren<TokenSectionProps>> = ({
  primaryToken,
  secondaryToken,
  children,
  ...props
}) => {
  const renderTokenComponent = () => {
    if (!primaryToken) {
      return <BunnyPlaceholderIcon width={32} mr="16px" />
    }

    if (primaryToken && secondaryToken) {
      return (
        <TokenPairImage
          variant="inverted"
          primaryToken={primaryToken}
          height={32}
          width={32}
          secondaryToken={secondaryToken}
          mr="16px"
        />
      )
    }

    return <TokenImage token={primaryToken} height={32} width={32} mr="16px" />
  }

  return (
    <Flex {...props}>
      {renderTokenComponent()}
      <div>{children}</div>
    </Flex>
  )
}

const CommitTokenSection: React.FC<React.PropsWithChildren<TokenSectionProps & { commitToken: Token }>> = ({
  commitToken,
  ...props
}) => {
  if (commitToken.equals(cakeBnbLpToken)) {
    return <TokenSection primaryToken={bscTokens.cake} secondaryToken={bscTokens.wbnb} {...props} />
  }
  return <TokenSection primaryToken={commitToken} {...props} />
}

const Label = (props) => <Text bold fontSize="12px" color="secondary" textTransform="uppercase" {...props} />

const Value = (props) => <Text bold fontSize="20px" style={{ wordBreak: 'break-all' }} {...props} />

interface IfoCardTokensProps {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  isLoading: boolean
  onApprove: () => Promise<any>
  enableStatus: EnableStatus
}

const OnSaleInfo = ({ token, saleAmount, distributionRatio }) => {
  const { t } = useTranslation()
  return (
    <TokenSection primaryToken={token}>
      <Flex flexDirection="column">
        <Label textTransform="uppercase">{t('On sale')}</Label>
        <Value>
          {typeof saleAmount === 'string'
            ? saleAmount
            : `${formatNumber(getBalanceNumber(saleAmount), 0, 0)} ${token.symbol}`}
        </Value>
        <Text fontSize="14px" color="textSubtle">
          {t('%ratio%% of total sale', { ratio: distributionRatio })}
        </Text>
      </Flex>
    </TokenSection>
  )
}

const IfoCardTokens: React.FC<React.PropsWithChildren<IfoCardTokensProps>> = ({
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
  isLoading,
  onApprove,
  enableStatus,
}) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'Sorry, you didn’t contribute enough CAKE to meet the minimum threshold. You didn’t buy anything in this sale, but you can still reclaim your CAKE.',
    ),
    { placement: 'bottom' },
  )

  const publicPoolCharacteristics = publicIfoData[poolId]
  const userPoolCharacteristics = walletIfoData[poolId]
  const { offeringAmountInToken, amountTokenCommittedInLP, refundingAmountInLP } = userPoolCharacteristics || {}
  const spentAmount = amountTokenCommittedInLP?.minus(refundingAmountInLP?.toNumber() ?? 0)

  const { currency, token, version } = ifo
  const { hasClaimed } = userPoolCharacteristics || {}
  // const distributionRatio =
  //   (ifo.version >= 3 ? publicIfoData[poolId].distributionRatio : ifo[poolId].distributionRatio) * 100
  const distributionRatio = publicIfoData?.[poolId]?.distributionRatio ?? 0 * 100

  const tooltipContentOfSpent = t(
    'Based on "overflow" sales method. %refundingAmount% unspent %spentToken% are available to claim after the sale is completed.',
    {
      refundingAmount: getBalanceNumber(refundingAmountInLP, ifo.currency.decimals).toFixed(4),
      spentToken: ifo.currency.symbol,
    },
  )
  const {
    targetRef: tagTargetRefOfSpent,
    tooltip: tagTooltipOfSpent,
    tooltipVisible: tagTooltipVisibleOfSpent,
  } = useTooltip(tooltipContentOfSpent, {
    placement: 'bottom',
  })

  const renderTokenSection = () => {
    if (isLoading) {
      return <IfoSkeletonCardTokens />
    }
    if (!account) {
      return (
        <OnSaleInfo
          token={token}
          distributionRatio={distributionRatio}
          // saleAmount={ifo.version >= 3 ? publicIfoData[poolId].offeringAmountPool : ifo[poolId].saleAmount}
          saleAmount={ifo.version >= 3 ? publicIfoData?.[poolId]?.offeringAmountPool : publicIfoData?.[poolId]?.offeringAmountPool}
        />
      )
    }

    if (publicIfoData.status === 'coming_soon') {
      return (
        <>
          <TokenSection primaryToken={ifo.token}>
            <Label>{t('On sale')}</Label>
            <Value>{`${formatNumber(getBalanceNumber(publicIfoData?.[poolId]?.offeringAmountPool), 0, 0)} ${
              token.symbol
            }`}</Value>
          </TokenSection>
          <Text fontSize="14px" color="textSubtle" pl="48px">
            {t('%ratio%% of total sale', { ratio: distributionRatio })}
          </Text>
        </>
      )
    }
    if (publicIfoData.status === 'live') {
      return (
        <>
          <CommitTokenSection commitToken={ifo.currency} mb="24px">
            <Label>{t('Your %symbol% committed', { symbol: currency.symbol })}</Label>
            <Value>{getBalanceNumber(amountTokenCommittedInLP, 18)}</Value>
            <IfoPercentageOfTotal
              userAmount={amountTokenCommittedInLP || BIG_ZERO}
              totalAmount={publicPoolCharacteristics?.totalAmountPool || BIG_ZERO}
            />
            <Flex>
              <Box>
                <Flex>
                  <Label>{t('Your %symbol% spent', { symbol: currency.symbol })}</Label>
                  {tagTooltipVisibleOfSpent && tagTooltipOfSpent}
                  <span ref={tagTargetRefOfSpent}>
                    <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                  </span>
                </Flex>
                <BalanceWithLoading
                  bold
                  decimals={4}
                  fontSize="20px"
                  value={getBalanceNumber(spentAmount, 18)}
                />
              </Box>
            </Flex>
          </CommitTokenSection>
          <TokenSection primaryToken={ifo.token}>
            <Label>{t('%symbol% to receive', { symbol: token.symbol })}</Label>
            <Value>{getBalanceNumber(offeringAmountInToken, token.decimals)}</Value>
            {version >= 3.2 && publicPoolCharacteristics?.vestingInformation?.percentage && 
            publicPoolCharacteristics.vestingInformation.percentage > 0 && (
              <IfoVestingAvailableToClaim
                amountToReceive={offeringAmountInToken ?? BIG_ZERO}
                percentage={publicPoolCharacteristics.vestingInformation.percentage}
                decimals={token.decimals}
                displayDecimals={2}
              />
            )}
          </TokenSection>
        </>
      )
    }

    if (publicIfoData.status === 'finished') {
      return amountTokenCommittedInLP?.isEqualTo(0) ? (
        <Flex flexDirection="column" alignItems="center">
          <BunnyPlaceholderIcon width={80} mb="16px" />
          <Text fontWeight={600}>{t('You didn’t participate in this sale!')}</Text>
        </Flex>
      ) : (
        <>
          <CommitTokenSection commitToken={ifo.currency} mb="24px">
            <Label>
              {hasClaimed
                ? t('Your %symbol% RECLAIMED', { symbol: currency.symbol })
                : t('Your %symbol% TO RECLAIM', { symbol: currency.symbol })}
            </Label>
            <Flex alignItems="center">
              <Value>{getBalanceNumber(refundingAmountInLP, 18)}</Value>
              {hasClaimed && <CheckmarkCircleIcon color="success" ml="8px" />}
            </Flex>
            <IfoPercentageOfTotal
              userAmount={amountTokenCommittedInLP ?? BIG_ZERO}
              totalAmount={publicPoolCharacteristics?.totalAmountPool ?? BIG_ZERO}
            />
          </CommitTokenSection>
          <TokenSection primaryToken={ifo.token}>
            <Label>
              {' '}
              {hasClaimed
                ? t('%symbol% received', { symbol: token.symbol })
                : t('%symbol% to receive', { symbol: token.symbol })}
            </Label>
            <Flex alignItems="center">
              <Value>{getBalanceNumber(offeringAmountInToken, token.decimals)}</Value>
              {!hasClaimed && offeringAmountInToken?.isEqualTo(0) && (
                <div ref={targetRef} style={{ display: 'flex', marginLeft: '8px' }}>
                  <HelpIcon />
                </div>
              )}
              {hasClaimed && <CheckmarkCircleIcon color="success" ml="8px" />}
            </Flex>
          </TokenSection>
          {hasClaimed && (
            <Message my="24px" p="8px" variant="success">
              <MessageText>{t('You’ve successfully claimed tokens back.')}</MessageText>
            </Message>
          )}
        </>
      )
    }
    return null
  }
  return (
    <Box>
      {tooltipVisible && tooltip}
      {renderTokenSection()}
    </Box>
  )
}

export default IfoCardTokens
