import { useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
// import { ChainId } from '@pancakeswap/sdk'
import { GTOKEN, USDT, arbitrumTokens } from '@pancakeswap/tokens'
import { Text, Box, Card, LinkExternal, Flex, MessageText } from '@pancakeswap/uikit'
// import { isAddress } from 'utils'
import styled from 'styled-components'
import { ZERO_ADDRESS } from 'config/constants'
import { useAccount, useChainId } from 'wagmi'
import { Address } from 'viem'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useLockedCountForToken, useLocksForToken, useTokenInfo } from 'hooks/useLocks'
import { getBlockExploreLink } from 'utils'
import Page from '../Page'
import { FormHeader } from './components/FormHeader'
import { FormContainer } from './components/FormContainer'
import LockRecords from './components/LockRecords'

enum TOKEN_TYPE {
  NORMAL,
  LP
}

export const StyledAppBody = styled(Card)`
  margin-top: 10px;
  border-radius: 8px;
  max-width: 1080px;
  width: 100%;
  z-index: 1;
`

const accountEllipsis = (address: Address) => {
  return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : null
}

const MAX_ITEMS = 10

const LockByToken = ({token} : {token: Address}) => {
  const { t } = useTranslation()
  const {chainId} = useActiveChainId()
  const { address: account } = useAccount()
  const length = useLockedCountForToken(token)
  const tokenInfo = useTokenInfo(token, chainId)

  const type = tokenInfo?.factory === ZERO_ADDRESS ? TOKEN_TYPE.NORMAL : TOKEN_TYPE.LP

  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(1)

  const [page, setPage] = useState(1)

  const _lockData = useLocksForToken(token, BigInt(start), BigInt(end), chainId)

  const lockData = useMemo(() => _lockData.reverse(), [_lockData])

  useEffect(() => {
    setStart(Number(length) > MAX_ITEMS * page ? Number(length) - MAX_ITEMS * page : 0)
    setEnd(Number(length) > MAX_ITEMS * (page - 1) + 1 ? Number(length) - MAX_ITEMS * (page - 1) - 1 : 0)
  }, [page, length])

  return (
    <Page>
      <StyledAppBody mb="16px">
        <Box p="4px" position="inherit">
          <FormHeader title={t('Lock Info')} subTitle={t('')} />
          <FormContainer>
            <Box>
              <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                <Text color="primary">{type === TOKEN_TYPE.NORMAL ? t("Token Address") : t("Liquidity Address")}</Text>
                <LinkExternal href={getBlockExploreLink(tokenInfo.address, 'address', chainId)}>
                  <Text color="primary">{accountEllipsis(tokenInfo.address)}</Text>
                </LinkExternal>
              </Flex>
              {type === TOKEN_TYPE.NORMAL && <>
                <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text color="primary">{t("Token Name")}</Text>
                    <Text>{tokenInfo.name}</Text>
                </Flex>
                <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text color="primary">{t("Token Symbol")}</Text>
                    <Text>{tokenInfo.symbol}</Text>
                </Flex>
                <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text color="primary">{t("Token Decimals")}</Text>
                    <Text>{tokenInfo.decimals}</Text>
                </Flex>
              </>}
              {type === TOKEN_TYPE.LP && <>
                <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text color="primary">{t("Pair Name")}</Text>
                    <Text>{tokenInfo.token0Symbol}/{tokenInfo.token1Symbol}</Text>
                </Flex>
                <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text color="primary">{t("Factory Address")}</Text>
                    <LinkExternal href={getBlockExploreLink(tokenInfo.factory, 'address', chainId)}>
                      <Text color="primary">{accountEllipsis(tokenInfo.factory)}</Text>
                    </LinkExternal>
                </Flex>
              </>}
              <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                <Text color="primary">{t("Current Locked Amount")}</Text>
                <Text>{new BigNumber(tokenInfo.amount).div(10 ** tokenInfo.decimals).toJSON()}</Text>
              </Flex>
            </Box>
          </FormContainer>
        </Box>
      </StyledAppBody>
      <StyledAppBody mb="24px">
        <Box p="4px" position="inherit">
          <FormHeader title={t('Lock Records')} subTitle={t('')} />
            {lockData && <LockRecords
              data={lockData}
              length={Number(length)}
              page={page}
              setPage={setPage}
            />}
        </Box>
      </StyledAppBody>
    </Page>
  )
}

export default LockByToken
