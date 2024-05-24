import styled from 'styled-components'
import every from 'lodash/every'
import {
  Balance,
  Box,
  Button,
  Card,
  CardBody,
  CheckmarkIcon,
  Container,
  Flex,
  FlexGap,
  Heading,
  Link,
  LogoRoundIcon,
  NextLinkFromReactRouter as RouterLink,
  Skeleton,
  Step,
  StepStatus,
  Stepper,
  Text,
  TooltipText,
  useTooltip,
} from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'

import { useTranslation } from '@pancakeswap/localization'
import useTokenBalance from 'hooks/useTokenBalance'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'

interface TypeProps {
  ifoCurrencyAddress: `0x${string}`
  hasClaimed: boolean
  isCommitted: boolean
  isLive?: boolean
}

const SmallStakePoolCard = styled(Box)`
  margin-top: 16px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

const Wrapper = styled(Container)`
  margin-left: -16px;
  margin-right: -16px;
  padding-top: 48px;
  padding-bottom: 48px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: -24px;
    margin-right: -24px;
  }
`

const InlineLink = styled(Link)`
  display: inline;
`

const IfoSteps: React.FC<React.PropsWithChildren<TypeProps>> = ({
  isCommitted,
  hasClaimed,
  isLive,
  ifoCurrencyAddress,
}) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const { balance } = useTokenBalance(ifoCurrencyAddress)
  const stepsValidationStatus = [false, hasClaimed, hasClaimed]

  const getStatusProp = (index: number): StepStatus => {
    const arePreviousValid = index === 0 ? true : every(stepsValidationStatus.slice(0, index), Boolean)
    if (stepsValidationStatus[index]) {
      return arePreviousValid ? 'past' : 'future'
    }
    return arePreviousValid ? 'current' : 'future'
  }

  const renderCardBody = (step: number) => {
    const isStepValid = stepsValidationStatus[step]

    const renderAccountStatus = () => {
      if (!account) {
        return <ConnectWalletButton />
      }

      if (isStepValid) {
        return (
          <Flex alignItems="center">
            <Text color="success" bold mr="8px">
              {t('Profile Active!')}
            </Text>
            <CheckmarkIcon color="success" />
          </Flex>
        )
      }

      return (
        <Button as={RouterLink} to={`/profile/${account.toLowerCase()}`}>
          {t('Activate your Profile')}
        </Button>
      )
    }

    switch (step) {
      case 0:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Take SMR')}
            </Heading>
            <Text color="textSubtle" small mb="16px">
              {t('You’ll need SMR in your wallet to take part in the Presale!')}
            </Text>
            {/* {renderAccountStatus()} */}
          </CardBody>
        )
      // case 1:
      //   return <Step1 hasProfile={hasActiveProfile} />
      // case 2:
      //   return <Step2 hasProfile={hasActiveProfile} isLive={isLive} isCommitted={isCommitted} />
      case 1:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Commit SMR')}
            </Heading>
            <Text color="textSubtle" small>
              {t(
                'When the presale is live, you can “commit” your SMR to buy the CGT tokens being sold.',
              )}
            </Text>
          </CardBody>
        )
      case 2:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Claim CGT')}
            </Heading>
            <Text color="textSubtle" small>
              {t(
                'After the Presale finish, you can claim CGT that you bought, and any unspent SMR will be returned to your wallet.',
              )}
            </Text>
          </CardBody>
        )
      default:
        return null
    }
  }

  return (
    <Wrapper>
      <Heading id="ifo-how-to" as="h2" scale="xl" color="secondary" mb="24px" textAlign="center">
        {t('How to Take Part in the Presale')}
      </Heading>
      <Stepper>
        {stepsValidationStatus.map((_, index) => (
          <Step
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            index={index}
            statusFirstPart={getStatusProp(index)}
            statusSecondPart={getStatusProp(index + 1)}
          >
            <Card>{renderCardBody(index)}</Card>
          </Step>
        ))}
      </Stepper>
    </Wrapper>
  )
}

export default IfoSteps
