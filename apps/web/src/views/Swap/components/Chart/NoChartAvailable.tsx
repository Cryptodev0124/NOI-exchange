import { Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

interface NoChartAvailableProps {
  token0Address: string
  token1Address: string
  pairAddress?: `0x${string}`
  isMobile: boolean
}

const NoChartAvailable: React.FC<React.PropsWithChildren<NoChartAvailableProps>> = ({
  token0Address,
  token1Address,
  pairAddress,
  isMobile,
}) => {
  const { t } = useTranslation()
  return (
    <>
      <Flex justifyContent="center" alignItems="center" height="100%" flexDirection="column">
        <Text mb={['8px', '8px', '0px']}>{t('Failed to load price chart for this pair')}</Text>
        <Text
          textAlign={isMobile ? 'center' : 'left'}
          mb={['8px', '8px', '0px']}
          color="textSubtle"
          small
          style={isMobile ? { wordSpacing: '100vw' } : undefined}
        >
          Token0: {token0Address ?? 'null'}
        </Text>
        <Text
          textAlign={isMobile ? 'center' : 'left'}
          mb={['8px', '8px', '0px']}
          color="textSubtle"
          small
          style={isMobile ? { wordSpacing: '100vw' } : undefined}
        >
          Token1: {token1Address ?? 'null'}
        </Text>
        <Text
          textAlign={isMobile ? 'center' : 'left'}
          mb={['8px', '8px', '0px']}
          color="textSubtle"
          small
          style={isMobile ? { wordSpacing: '100vw' } : undefined}
        >
          Pair: {pairAddress ?? 'null'}
        </Text>
      </Flex>
    </>
  )
}

export default NoChartAvailable
