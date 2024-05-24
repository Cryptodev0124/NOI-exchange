import { useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
// import { ChainId } from '@pancakeswap/sdk'
import { GTOKEN, USDT, arbitrumTokens } from '@pancakeswap/tokens'
import { Text, Box, Card, LinkExternal, Flex, Button, useModal, EditIcon, IconButton } from '@pancakeswap/uikit'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
// import { isAddress } from 'utils'
import styled from 'styled-components'
import { ZERO_ADDRESS } from 'config/constants'
import { useAccount, useChainId } from 'wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useLockById, useLockedCountForToken, useLocksForToken, useTokenInfo } from 'hooks/useLocks'
import { getBlockExploreLink } from 'utils'
import Page from '../Page'
import { FormHeader } from './components/FormHeader'
import { FormContainer } from './components/FormContainer'
import LockRecords from './components/LockRecords'
import TransferModal from './components/TransferModal'
import RenounceModal from './components/RenounceModal'
import UnlockModal from './components/UnlockModal'
import useCountdown from './hooks/useCountdown'
import EditModal from './components/EditModal'
import { editButtonClass, editIconClass } from "./EditButton.css";
import EditDescriptionModal from './components/EditDescriptionModal'

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

const accountEllipsis = (address: string) => {
  return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : null
}

const StyledBox = styled(Box)`
  background: ${({theme}) => theme.colors.backgroundAlt2};
  border: 1px solid ${({theme}) => theme.colors.primary};
  border-radius: 4px;
  padding: 4px;
`

const padTime = (num: number) => num.toString().padStart(2, '0')

const formatRoundTime = (secondsBetweenBlocks: number) => {
  const { days, hours, minutes, seconds } = getTimePeriods(secondsBetweenBlocks)
  const minutesSeconds = `${padTime(days)}:${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`

  return minutesSeconds
}

const LockById = ({id} : {id: string}) => {
  const { t } = useTranslation()
  const {chainId} = useActiveChainId()
  const { address: account } = useAccount()
  const lockInfo = useLockById(BigInt(id), chainId)

  const type = lockInfo?.factory === undefined ? TOKEN_TYPE.NORMAL : TOKEN_TYPE.LP

  const { secondsRemaining } = useCountdown(Number(lockInfo.tgeDate))
  
  const countdown = formatRoundTime(secondsRemaining).split(":")

  const [onPresentTransferModal] = useModal(
    <TransferModal
      chainId={chainId}
      id={id}
    />,
    true,
    true,
    `lock-transfer-modal-${id}`,
  )

  const [onPresentDescriptionModal] = useModal(
    <EditDescriptionModal
      chainId={chainId}
      id={id}
    />,
    true,
    true,
    `lock-description-modal-${id}`,
  )

  const [onPresentRenounceModal] = useModal(
    <RenounceModal
      chainId={chainId}
      id={id}
    />,
    true,
    true,
    `lock-renounce-modal-${id}`,
  )

  const [onPresentUnlockModal] = useModal(
    <UnlockModal
      chainId={chainId}
      id={id}
    />,
    true,
    true,
    `lock-unlock-modal-${id}`,
  )

  const [onPresentEditModal] = useModal(
    <EditModal
      chainId={chainId}
      id={id}
      account={account}
      token={lockInfo.address}
      oldAmount={new BigNumber(lockInfo.amount).div(10 ** lockInfo.decimals).toJSON()}
      oldDate={lockInfo.tgeDate*1000}
    />,
    true,
    true,
    `lock-edit-modal-${id}`,
  )

  return (
    <Page>
      <StyledAppBody mb="16px">
        <Box pt="12px" pb="20px">
          <Flex width="100%" justifyContent="center" mb="12px">
            <Text color="primary" bold fontSize="18px">{t("Unlock in")}</Text>
          </Flex>
          <Flex width="100%" justifyContent="center">
            <StyledBox><Text fontSize="18px">{countdown[0]}</Text></StyledBox>
            <StyledBox ml="5px"><Text fontSize="18px">{countdown[1]}</Text></StyledBox>
            <StyledBox ml="5px"><Text fontSize="18px">{countdown[2]}</Text></StyledBox>
            <StyledBox ml="5px"><Text fontSize="18px">{countdown[3]}</Text></StyledBox>
          </Flex>
        </Box>
      </StyledAppBody>
      <StyledAppBody mb="16px">
        <Box p="4px" position="inherit">
          <FormHeader title={type === TOKEN_TYPE.NORMAL ? t('Token Info') : t('Pair Info')} subTitle={t('')} />
          <FormContainer>
            <Box>
              <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                <Text color="primary">{type === TOKEN_TYPE.NORMAL ? t("Token Address") : t("Pair Address")}</Text>
                <LinkExternal href={getBlockExploreLink(lockInfo.address, 'address', chainId)}>
                  <Text color="primary">{accountEllipsis(lockInfo.address)}</Text>
                </LinkExternal>
              </Flex>
              {type === TOKEN_TYPE.NORMAL && <>
                <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text color="primary">{t("Token Name")}</Text>
                    <Text>{lockInfo.name}</Text>
                </Flex>
                <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text color="primary">{t("Token Symbol")}</Text>
                    <Text>{lockInfo.symbol}</Text>
                </Flex>
                <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text color="primary">{t("Token Decimals")}</Text>
                    <Text>{lockInfo.decimals}</Text>
                </Flex>
              </>}
              {type === TOKEN_TYPE.LP && <>
                <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text color="primary">{t("Pair Name")}</Text>
                    <Text>{lockInfo.token0Symbol}/{lockInfo.token1Symbol}</Text>
                </Flex>
                <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                    <Text color="primary">{t("Factory Address")}</Text>
                    <LinkExternal href={getBlockExploreLink(lockInfo.factory, 'address', chainId)}>
                      <Text color="primary">{accountEllipsis(lockInfo.factory)}</Text>
                    </LinkExternal>
                </Flex>
              </>}
            </Box>
          </FormContainer>
        </Box>
      </StyledAppBody>
      <StyledAppBody mb="16px">
        <Box p="4px" position="inherit">
          <FormHeader title={t('Lock Info')} subTitle={t('')} />
          <FormContainer>
            <Box>
              <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                <Text color="primary">{t("Title")}</Text>
                <Button variant="text" height="24px" p="0" onClick={onPresentDescriptionModal}>
                  <Flex>
                    <Box mr="10px"><Text>{lockInfo.description}</Text></Box>
                    <EditIcon color="text" width="16px" />
                  </Flex>
                </Button>
              </Flex>
              <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                <Text color="primary">{t("Amount Locked")}</Text>
                <Text>{new BigNumber(lockInfo.amount).div(10 ** lockInfo.decimals).toJSON()}</Text>
              </Flex>
              <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                <Text color="primary">{t("Owner")}</Text>
                <LinkExternal href={getBlockExploreLink(lockInfo.owner, 'address', chainId)}>
                  <Text color="primary">{accountEllipsis(lockInfo.owner)}</Text>
                </LinkExternal>
              </Flex>
              <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                <Text color="primary">{t("Lock Date")}</Text>
                <Text>{new Date(Number(lockInfo.lockDate) * 1000).toLocaleString()}</Text>
              </Flex>
              <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                <Text color="primary">{t("Unlock Date")}</Text>
                <Text>{new Date(Number(lockInfo.tgeDate) * 1000).toLocaleString()}</Text>
              </Flex>
              <Flex width="100%" justifyContent="space-between" px="5px" mb="10px">
                <Text color="primary">{t("Unlocked Amount")}</Text>
                <Text>{new BigNumber(lockInfo.unlockedAmount).div(10 ** lockInfo.decimals).toJSON()}</Text>
              </Flex>
            </Box>
          </FormContainer>
          {lockInfo.owner === account && <FormContainer>
            <Flex width="100%" alignItems="center" flexDirection={["column", "column", "row"]}>
              <Box mr={["0", "0", "15px"]} mb={["10px", "10px", "0"]} width="100%">
                <Button
                  width="100%"
                  onClick={onPresentTransferModal}
                ><Text color="invertedContrast" bold fontSize="14px">{t("Transfer Lock Ownership")}</Text></Button>
              </Box>
              <Box width="100%">
                <Button
                  width="100%"
                  onClick={onPresentRenounceModal}
                ><Text color="invertedContrast" bold fontSize="14px">{t("Renounce Lock Ownership")}</Text></Button>
              </Box>
            </Flex>
            <Flex width="100%" alignItems="center" flexDirection={["column", "column", "row"]}>
              <Box mr={["0", "0", "15px"]} mb={["10px", "10px", "0"]} width="100%">
                <Button
                  width="100%"
                  onClick={onPresentEditModal}
                ><Text color="invertedContrast" bold fontSize="14px">{t("Update")}</Text></Button>
              </Box>
              <Box width="100%">
                <Button
                  width="100%"
                  disabled={Number(lockInfo.tgeDate) * 1000 >= Date.now() }
                  onClick={onPresentUnlockModal}
                ><Text color="invertedContrast" bold fontSize="14px">{t("Unlock")}</Text></Button>
              </Box>
            </Flex>
          </FormContainer>}
        </Box>
      </StyledAppBody>
    </Page>
  )
}

export default LockById
