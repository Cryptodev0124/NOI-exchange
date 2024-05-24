import { useTranslation } from '@pancakeswap/localization'
import { Flex, Skeleton, Text } from '@pancakeswap/uikit'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useContext } from 'react'
import styled from 'styled-components'
import { FarmWithStakedValue } from '@pancakeswap/farms'
import { HarvestActionContainer } from '../FarmTable/Actions/HarvestAction'
import { StakedContainer } from '../FarmTable/Actions/StakedAction'
import HarvestAction from './HarvestAction'
import StakeAction from './StakeAction'

const Action = styled.div`
  padding-top: 16px;
`

const ActionContainer = styled.div`
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  account?: string
  addLiquidityUrl?: string
  lpLabel?: string
  displayApr?: string
}

const CardActions: React.FC<React.PropsWithChildren<FarmCardActionsProps>> = ({
  farm,
  account,
  addLiquidityUrl,
  lpLabel,
  displayApr,
}) => {
  const { t } = useTranslation()
  const { pid, token, quoteToken, vaultPid, lpSymbol, lpAddress, isTokenOnly } = farm
  const { earnings, stakedBalance, tokenBalance, proxy } = farm.userData || {}
  const isReady = farm.multiplier !== undefined

  return (
    <Action>
      <Flex>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
        CGT
        </Text>
        <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
          {t('Earned')}
        </Text>
      </Flex>
      <HarvestActionContainer
        earnings={earnings}
        pid={pid}
        vaultPid={vaultPid}
        token={token}
        quoteToken={quoteToken}
        lpSymbol={lpSymbol}
      >
        {(props) => <HarvestAction {...props} />}
      </HarvestActionContainer>
      {isReady ? (
        <Flex>
          <Text bold textTransform="uppercase" color="secondary" fontSize="12px" pr="4px">
            {farm.lpSymbol}
          </Text>
          <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
            {t('Staked')}
          </Text>
        </Flex>
      ) : (
        <Skeleton width={80} height={18} mb="4px" />
      )}
      {!account ? (
        <ConnectWalletButton mt="8px" width="100%" />
      ) : <StakedContainer {...farm} lpLabel={lpLabel} addLiquidityUrl={addLiquidityUrl} displayApr={displayApr} isTokenOnly={isTokenOnly}>
        {(props) => <StakeAction {...props} />}
      </StakedContainer>}
    </Action>
  )
}

export default CardActions
