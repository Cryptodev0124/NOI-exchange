import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { Flex, useToast } from '@pancakeswap/uikit'
import { BIG_TEN } from '@pancakeswap/utils/bigNumber'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
// import Column from 'components/Layout/Column'
import { AutoRow, RowBetween } from 'components/Layout/Row'
import CircleLoader from 'components/Loader/CircleLoader'
import { ApprovalState } from 'hooks/useApproveCallback'
// import ProgressSteps from 'views/Swap/components/ProgressSteps'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { CryptoFormView, DataType } from 'views/Airdrop/types'
import useSendToken from '../hooks/useSendToken'
import useSendEther from '../hooks/useSendEther'

const StyledFlex = styled(Flex)`
  width: 100%;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

interface SendCommitButtonPropsType<SendTransactionReturnType> {
  data: DataType[]
  tag: string
  account?: `0x${string}`
  approval: ApprovalState
  approveCallback: () => Promise<SendTransactionReturnType>
  approvalSubmitted: boolean
  setApprovalSubmitted: (b: boolean) => void
  currency?: Currency | null
  swapInputError?: string
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
}

export default function SendCommitButton<SendTransactionReturnType>({
  data,
  tag,
  account,
  approval,
  approveCallback,
  approvalSubmitted,
  setApprovalSubmitted,
  currency,
  swapInputError,
  // parsedAmount,
  setModalView
}: SendCommitButtonPropsType<SendTransactionReturnType>) {
  const { t } = useTranslation()

  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()

  const { onSendToken } = useSendToken()
  const { onSendEther } = useSendEther()

  const addresses = data.map((row) => row.address)
  const amounts = data.map((row) => Math.floor(row.amount * 10 ** (currency?.decimals ?? 0)))
  const amountsInString = data.map((row) => new BigNumber(row.amount).times(BIG_TEN.pow(currency?.decimals ?? 0)).toFixed())
  const totalAmount = amounts.reduce((sum, current) => sum + Number(current), 0) / 10 ** (currency?.decimals ?? 0)
  const handleCommit = async () => {
    const receipt = currency?.isNative ? 
      await fetchWithCatchTxError(() => onSendEther(totalAmount, addresses, amountsInString)) : 
      await fetchWithCatchTxError(() => onSendToken(currency?.wrapped?.address ?? "", addresses, amountsInString))
    setApprovalSubmitted(false)

    if (receipt?.status) {
      toastSuccess(
        `${t('Confirmed')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% have been sent to the receivers!', { symbol: currency?.symbol ?? "Unknown" })}
        </ToastDescriptionWithTx>,
      
      )
      setModalView(CryptoFormView.Input)
    }
  }

  if (!account) {
    return <ConnectWalletButton width="100%" />
  }

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED))

  const isValid = !swapInputError

  const approved = approval === ApprovalState.APPROVED

  if (showApproveFlow) {
    return (
      <>
        <StyledFlex>
          {showApproveFlow && <CommitButton
            variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
            onClick={approveCallback}
            disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
            width="100%"
            margin="10px"
          >
            {approval === ApprovalState.PENDING ? (
              <AutoRow gap="6px" justify="center">
                {t('Enabling')} <CircleLoader stroke="white" />
              </AutoRow>
            ) : approvalSubmitted && approved ? (
              t('Enabled')
            ) : (
              t('Enable %asset%', { asset: currency?.symbol ?? '' })
            )}
          </CommitButton>}
          <CommitButton
            variant='primary'
            onClick={handleCommit}
            width="100%"
            id="swap-button"
            disabled={!isValid || !approved || pendingTx}
            margin="10px"
          >
            {
              pendingTx ? 
                <AutoRow gap="6px" justify="center">
                  {t('Confirming')} <CircleLoader stroke="white" />
                </AutoRow> 
              : 
                t('Confirm')
            }
          </CommitButton>
        </StyledFlex>
        {/* <Column style={{ marginTop: '1rem' }}>
          <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
        </Column> */}
      </>
    )
  }

  return (
    <>
      <CommitButton
        variant='primary'
        onClick={handleCommit}
        id="swap-button"
        width="100%"
        disabled={!isValid || !approved || pendingTx}
      >
        {swapInputError ||
          (pendingTx ? 
            <AutoRow gap="6px" justify="center">
              {t('Confirming')} <CircleLoader stroke="white" />
            </AutoRow>
          : 
          t('Confirm'))}
      </CommitButton>
    </>
  )
}
