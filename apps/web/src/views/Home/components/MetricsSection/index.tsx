import styled, { keyframes } from 'styled-components'
import { Heading, Flex, Text, Skeleton, ChartIcon, CommunityIcon, SwapIcon, Box, FarmIcon, EarnIcon, LaunchPadIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import { formatLocalisedCompactNumber } from '@pancakeswap/utils/formatBalance'
import useSWRImmutable from 'swr/immutable'
import IconCard, { IconCardData } from '../IconCard'
import StatCardContent from './StatCardContent'
import GradientLogo from '../GradientLogoSvg'

const flyingAnim = () => keyframes`
  from {
    transform: translate(0,  -5px);
  }
  25% {
    transform: translate(5px, 0px);
  }
  50% {
    transform: translate(0, 5px);
  }
  75% {
    transform: translate(-5px, 0px);
  }
  to {
    transform: translate(0, -5px);
  }
`

const BunnyWrapper = styled(Flex)`
  justify-content: center;
  width: 100%;
  animation: ${flyingAnim} 2s ease-in-out infinite;
  will-change: transform;
  > span {
    overflow: visible !important; // make sure the next-image pre-build blur image not be cropped
  }
`

const StyledBox = styled(Box)`
  position: absolute; 
  top: 0px;
`

const Stats = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const { data: tvl } = useSWRImmutable('tvl')
  const { data: txCount } = useSWRImmutable('totalTx30Days')
  const { data: addressCount } = useSWRImmutable('addressCount30Days')
  const trades = formatLocalisedCompactNumber(txCount)
  const users = formatLocalisedCompactNumber(addressCount)
  const tvlString = tvl ? formatLocalisedCompactNumber(tvl) : '-'

  const tvlText = t('And those users are now entrusting the platform with over $%tvl% in funds.', { tvl: tvlString })
  const [entrusting, inFunds] = tvlText.split(tvlString)

  const UsersCardData: IconCardData = {
    icon: <CommunityIcon color="secondary" width="36px" />,
  }

  const TradesCardData: IconCardData = {
    icon: <SwapIcon color="primary" width="36px" />,
  }

  const EarnsCardData: IconCardData = {
    icon: <EarnIcon color="primary" width="36px" />,
  }

  const StakedCardData: IconCardData = {
    icon: <ChartIcon color="failure" width="32px" />,
  }

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <BunnyWrapper mb="30px">
        {/* <img src="/images/cgt.png" width="150px" alt="logo" /> */}
        <img src="/images/home/ellipse3.svg" width="250px" alt="logo" />
      </BunnyWrapper>
      <Heading textAlign="center" scale="xl" my="20px">
        {t('Explore CyberGlow Ecosystem')}
      </Heading>
      <Text textAlign="center" color="textSubtle">
        {t('Swap, earn, create token and token sale, lock liquidity and more with CyberGlow.')}
      </Text>
      <Text textAlign="center" color="textSubtle">
        {t('We build a suite of tools for the world of decentralized finance.')}
      </Text>
      {/* <Flex flexWrap="wrap">
        <Text display="inline" textAlign="center" color="textSubtle" mb="20px">
          {entrusting}
          <>{tvl ? <>{tvlString}</> : <Skeleton display="inline-block" height={16} width={70} mt="2px" />}</>
          {inFunds}
        </Text>
      </Flex> */}

      {/* <Text textAlign="center" color="textSubtle" bold mb="32px">
        {t('Will you join them?')}
      </Text> */}

      <Flex maxWidth="100%" mt="32px" flexDirection={['column', null, null, 'row']}>
        <IconCard {...TradesCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
          <StatCardContent
            headingText={t('Trade')}
            bodyText={t('')}
            highlightColor={theme?.colors.secondary}
          />
        </IconCard>
        <IconCard {...EarnsCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
          <StatCardContent
            headingText={t('Earn')}
            bodyText={t('')}
            highlightColor={theme?.colors.primary}
          />
        </IconCard>
        <IconCard {...StakedCardData}>
          <StatCardContent
            headingText={t('Sale')}
            bodyText={t('')}
            highlightColor={theme?.colors.failure}
          />
        </IconCard>
      </Flex>
    </Flex>
  )
}

export default Stats
