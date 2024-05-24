import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { Text, Box, Flex, LinkExternal } from '@pancakeswap/uikit'
import { Currency } from '@pancakeswap/sdk'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
// import Row from 'components/Layout/Row'
import { CurrencyLogo } from 'components/Logo'
import { CryptoFormView, DataType } from 'views/Airdrop/types'
import { useAccount } from 'wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getMultiSenderAddress } from 'utils/addressHelpers'
import { FormHeader } from './FormHeader'
import { FormContainer } from './FormContainer'
import DataTable from './DataTable'
import SendCommitButton from './SendCommitButton'
import { useAccountInfo } from '../hooks/useAccountInfo'

export function QuoteForm({
  setModalView,
  data,
  tag,
  currency,
}: {
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
  data: DataType[]
  tag: string
  currency: Currency | null
}) {
  const { t } = useTranslation()
  const {chainId} = useActiveChainId()
  const { address: account } = useAccount()

  const amounts = data.map((row) => Math.floor(row.amount * 10 ** (currency?.decimals ?? 0))/10 ** (currency?.decimals ?? 0))
  const totalAmounts = amounts.reduce((amount0, amount1) => amount0 + Math.floor(amount1 * 10 ** (currency?.decimals ?? 0)), 0) / 10 ** (currency?.decimals ?? 0)

  const {
    parsedAmount,
    inputError
  } = useAccountInfo(totalAmounts.toFixed((currency?.decimals ?? 0)), currency)

  const {approvalState, approveCallback} = useApproveCallback(parsedAmount, getMultiSenderAddress(chainId))

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])

  return (
    <Box p="4px" position="inherit">
      <FormHeader title={t('Confirm Allocation')} subTitle={t('Let review your information')} backTo={() => setModalView(CryptoFormView.Input)} />
      <FormContainer>
        <Box>
          <Flex width="100%" px="20px" my="10px">
            <CurrencyLogo size="32px" currency={currency} />
            <Text fontSize="20px" ml="8px">{currency?.symbol ?? "Unknown"}</Text>
          </Flex>
          {!currency?.isNative && <Flex width="100%" justifyContent="space-between" px="20px" mb="10px">
            <Text>{t("Token Address")}</Text>
            <Text>{`${currency?.wrapped.address.substring(0, 6)}...${currency?.wrapped.address.substring(currency?.wrapped.address.length - 4)}`}</Text>
          </Flex>}
          <Text mt="30px">{t("Allocation")}</Text>
          <DataTable data={data} />
          <Flex width="100%" justifyContent="space-between" px="20px" mt="50px">
            <Text>{t("Total Receivers")}</Text>
            <Text>{data.length}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="20px" mt="10px">
            <Text>{t("Total Amount to send")}</Text>
            <Text>{Number(totalAmounts.toFixed(currency?.decimals))}</Text>
          </Flex>
        </Box>
        <SendCommitButton
          data={data}
          tag={tag}
          account={account}
          approval={approvalState}
          approveCallback={approveCallback}
          approvalSubmitted={approvalSubmitted}
          setApprovalSubmitted={setApprovalSubmitted}
          currency={currency}
          swapInputError={inputError}
          setModalView={setModalView}
        />
      </FormContainer>
    </Box>
  )
}
