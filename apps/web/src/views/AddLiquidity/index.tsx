import { useCallback, useEffect, useMemo, useState } from 'react'
import { CurrencyAmount, Token, WNATIVE, MINIMUM_LIQUIDITY, Percent } from '@pancakeswap/sdk'
import {
  Button,
  Text,
  AddIcon,
  CardBody,
  Message,
  useModal,
  TooltipText,
  useTooltip,
  MessageText,
  IconButton,
  PencilIcon,
  // Coming1,
} from '@pancakeswap/uikit'
import { logError } from 'utils/sentry'
import { useIsTransactionUnsupported, useIsTransactionWarning } from 'hooks/Trades'
import { useTranslation } from '@pancakeswap/localization'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import { useZapContract } from 'hooks/useContract'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getZapAddress } from 'utils/addressHelpers'
import { CommitButton } from 'components/CommitButton'
// import StyledDisableFlex from 'components/StyledDisableFlex'
import { getLPSymbol } from 'utils/getLpSymbol'
import { useRouter } from 'next/router'
import { callWithEstimateGas } from 'utils/calls'
import { SUPPORT_ZAP } from 'config/constants/supportChains'
// import { ContractMethodName } from 'utils/types'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'
import { ROUTER_ADDRESS } from 'config/constants/exchange'
import { useLPApr } from 'state/swap/useLPApr'
import { LightCard } from '../../components/Card'
import { AutoColumn, ColumnCenter } from '../../components/Layout/Column'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import { AppHeader, AppBody } from '../../components/App'
import { MinimalPositionCard } from '../../components/PositionCard'
import { RowBetween, RowFixed } from '../../components/Layout/Row'
import ConnectWalletButton from '../../components/ConnectWalletButton'

import { PairState } from '../../hooks/usePairs'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import { Field } from '../../state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from '../../state/mint/hooks'

import { useTransactionAdder } from '../../state/transactions/hooks'
import {
  useGasPrice,
  useIsExpertMode,
  usePairAdder,
  useUserSlippageTolerance,
  useZapModeManager,
} from '../../state/user/hooks'
import { calculateGasMargin } from '../../utils'
import { calculateSlippageAmount, useRouterContract } from '../../utils/exchange'
import { maxAmountSpend } from '../../utils/maxAmountSpend'
import { wrappedCurrency } from '../../utils/wrappedCurrency'
import Dots from '../../components/Loader/Dots'
import PoolPriceBar from './PoolPriceBar'
import Page from '../Page'
import ConfirmAddLiquidityModal from './components/ConfirmAddLiquidityModal'
import { ChoosePair } from './ChoosePair'
import { ZapCheckbox } from '../../components/CurrencyInputPanel/ZapCheckbox'
import { formatAmount } from '../../utils/formatInfoNumbers'
import { useCurrencySelectRoute } from './useCurrencySelectRoute'
import { CommonBasesType } from '../../components/SearchModal/types'
import SettingsModal from '../../components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from '../../components/Menu/GlobalSettings/types'

enum Steps {
  Choose,
  Add,
}

export default function AddLiquidity({ currencyA, currencyB }) {
  const router = useRouter()
  const { account, chainId } = useAccountActiveChain()
  const { isWrongNetwork } = useActiveWeb3React()

  const addPair = usePairAdder()
  const [zapMode] = useZapModeManager()
  const expertMode = useIsExpertMode()
  const zapAddress = getZapAddress(chainId)

  const [temporarilyZapMode, setTemporarilyZapMode] = useState(true)

  const [steps, setSteps] = useState(Steps.Choose)

  const { t } = useTranslation()
  const gasPrice = useGasPrice()

  useEffect(() => {
    if (router.query.step === '1') {
      setSteps(Steps.Add)
    }
  }, [router.query])

  const zapModeStatus = useMemo(() => !!zapMode && temporarilyZapMode, [zapMode, temporarilyZapMode])

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts: mintParsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
    addError,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const poolData = useLPApr(pair)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(`Based on last 7 days' performance. Does not account for impermanent loss`),
    {
      placement: 'bottom',
    },
  )

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  // modal and loading
  const [{ attemptingTxn, liquidityErrorMessage, txHash }, setLiquidityState] = useState<{
    attemptingTxn: boolean
    liquidityErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    attemptingTxn: false,
    liquidityErrorMessage: undefined,
    txHash: undefined,
  })

  // Zap state
  const [zapTokenToggleA, setZapTokenToggleA] = useState(true)
  const [zapTokenToggleB, setZapTokenToggleB] = useState(true)
  const zapTokenCheckedA = zapTokenToggleA && currencyBalances?.[Field.CURRENCY_A]?.greaterThan(0)
  const zapTokenCheckedB = zapTokenToggleB && currencyBalances?.[Field.CURRENCY_B]?.greaterThan(0)

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: CurrencyAmount<Token> } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )

  const canZap = false

  const { handleCurrencyASelect, handleCurrencyBSelect } = useCurrencySelectRoute()

  // const { zapInEstimating, rebalancing, ...zapIn } = useZapIn({
  //   pair,
  //   canZap,
  //   currencyA,
  //   currencyB,
  //   currencyBalances,
  //   zapTokenCheckedA,
  //   zapTokenCheckedB,
  //   maxAmounts,
  // })

  const parsedAmounts = mintParsedAmounts

  const preferZapInstead = false

  // get formatted amounts
  const formattedAmounts = useMemo(
    () => ({
      [independentField]:
        canZap &&
        ((independentField === Field.CURRENCY_A && !zapTokenCheckedA) ||
          (independentField === Field.CURRENCY_B && !zapTokenCheckedB))
          ? ''
          : typedValue,
      [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    }),
    [
      canZap,
      dependentField,
      independentField,
      noLiquidity,
      otherTypedValue,
      parsedAmounts,
      typedValue,
      zapTokenCheckedA,
      zapTokenCheckedB,
    ],
  )

  // // check whether the user has approved the router on the tokens
  // const [approvalA, approveACallback] = useApproveCallback(
  //   parsedAmounts[Field.CURRENCY_A],
  //   preferZapInstead ? zapAddress : ROUTER_ADDRESS[chainId],
  // )
  // const [approvalB, approveBCallback] = useApproveCallback(
  //   parsedAmounts[Field.CURRENCY_B],
  //   preferZapInstead ? zapAddress : ROUTER_ADDRESS[chainId],
  // )

  const {
    approvalState: approvalA,
    approveCallback: approveACallback,
    revokeCallback: revokeACallback,
    currentAllowance: currentAllowanceA,
  } = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS[chainId])
  const {
    approvalState: approvalB,
    approveCallback: approveBCallback,
    revokeCallback: revokeBCallback,
    currentAllowance: currentAllowanceB,
  } = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS[chainId])

  const addTransaction = useTransactionAdder()

  const routerContract = useRouterContract()

  async function onAdd() {
    if (!chainId || !account || !routerContract) return

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = mintParsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    }

    let estimate: any
    let method: any
    let args: Array<string | string[] | number | bigint>
    let value: bigint | null
    if (currencyA?.isNative || currencyB?.isNative) {
      const tokenBIsNative = currencyB?.isNative
      estimate = routerContract.estimateGas.addLiquidityETH
      method = routerContract.write.addLiquidityETH
      args = [
        (tokenBIsNative ? currencyA : currencyB)?.wrapped?.address ?? '', // token
        (tokenBIsNative ? parsedAmountA : parsedAmountB).quotient.toString(), // token desired
        amountsMin[tokenBIsNative ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsNative ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline,
      ]
      value = (tokenBIsNative ? parsedAmountB : parsedAmountA).quotient
    } else {
      estimate = routerContract.estimateGas.addLiquidity
      method = routerContract.write.addLiquidity
      args = [
        currencyA?.wrapped?.address ?? '',
        currencyB?.wrapped?.address ?? '',
        parsedAmountA.quotient.toString(),
        parsedAmountB.quotient.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline,
      ]
      value = null
    }

    setLiquidityState({ attemptingTxn: true, liquidityErrorMessage: undefined, txHash: undefined })
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
          // gasPrice,
        }).then((response) => {
          setLiquidityState({ attemptingTxn: false, liquidityErrorMessage: undefined, txHash: response.hash })

          const symbolA = currencies[Field.CURRENCY_A]?.symbol
          const amountA = parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)
          const symbolB = currencies[Field.CURRENCY_B]?.symbol
          const amountB = parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)
          addTransaction(response, {
            summary: `Add ${amountA} ${symbolA} and ${amountB} ${symbolB}`,
            translatableSummary: {
              text: 'Add %amountA% %symbolA% and %amountB% %symbolB%',
              data: { amountA: amountA ?? "", symbolA: symbolA ?? "", amountB: amountB ?? "", symbolB: symbolB ?? "" },
            },
            type: 'add-liquidity',
          })

          if (pair) {
            addPair(pair)
          }
        }),
      )
      .catch((err) => {
        if (err && err.code !== 4001) {
          logError(err)
          console.error(`Add Liquidity failed`, err, args, value)
        }
        setLiquidityState({
          attemptingTxn: false,
          liquidityErrorMessage:
            err && err.code !== 4001
              ? t('Add liquidity failed: %message%', { message: transactionErrorToUserReadableMessage(err, t) })
              : undefined,
          txHash: undefined,
        })
      })
  }

  const pendingText = t('Supplying %amountA% %symbolA% and %amountB% %symbolB%', {
    amountA: parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    symbolA: currencies[Field.CURRENCY_A]?.symbol ?? '',
    amountB: parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
    symbolB: currencies[Field.CURRENCY_B]?.symbol ?? '',
  })

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
  }, [onFieldAInput, txHash])

  const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)
  const addIsWarning = useIsTransactionWarning(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  const [onPresentAddLiquidityModal] = useModal(
    <ConfirmAddLiquidityModal
      title={noLiquidity ? t('You are creating a trading pair') : t('You will receive')}
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      pendingText={pendingText}
      currencyToAdd={pair?.liquidityToken}
      allowedSlippage={allowedSlippage}
      onAdd={onAdd}
      parsedAmounts={parsedAmounts}
      currencies={currencies}
      liquidityErrorMessage={liquidityErrorMessage}
      price={price}
      noLiquidity={noLiquidity}
      poolTokenPercentage={poolTokenPercentage}
      liquidityMinted={liquidityMinted}
    />,
    true,
    true,
    'addLiquidityModal',
  )

  const isValid = !error && !addError
  const errorText = error ?? addError

  const buttonDisabled =
    !isValid ||
    (approvalA !== ApprovalState.APPROVED) ||
    (approvalB !== ApprovalState.APPROVED)

  const showFieldAApproval =
    (approvalA === ApprovalState.NOT_APPROVED || approvalA === ApprovalState.PENDING)
  const showFieldBApproval =
    (approvalB === ApprovalState.NOT_APPROVED || approvalB === ApprovalState.PENDING)

  const shouldShowApprovalGroup = (showFieldAApproval || showFieldBApproval) && isValid

  const oneCurrencyIsWNATIVE = Boolean(
    chainId && ((currencyA && currencyA.equals(WNATIVE[chainId])) || (currencyB && currencyB.equals(WNATIVE[chainId]))),
  )

  const noAnyInputAmount = !parsedAmounts[Field.CURRENCY_A] && !parsedAmounts[Field.CURRENCY_B]

  const showAddLiquidity =
    (!!currencies[Field.CURRENCY_A] && !!currencies[Field.CURRENCY_B] && steps === Steps.Add)

  const showRebalancingConvert =
    !noAnyInputAmount


  const [onPresentSettingsModal] = useModal(<SettingsModal mode={SettingsMode.SWAP_LIQUIDITY} />)

  return (
    <Page>
      {/* <Coming1 />
      <StyledDisableFlex> */}
      <AppBody>
        {!showAddLiquidity && (
          <ChoosePair
            error={error}
            currencyA={currencies[Field.CURRENCY_A]}
            currencyB={currencies[Field.CURRENCY_B]}
            onNext={() => setSteps(Steps.Add)}
          />
        )}
        {showAddLiquidity && (
          <>
            <AppHeader
              title={
                currencies[Field.CURRENCY_A]?.symbol && currencies[Field.CURRENCY_B]?.symbol
                  ? `${getLPSymbol(currencies[Field.CURRENCY_A].symbol, currencies[Field.CURRENCY_B].symbol, chainId)}`
                  : t('Add Liquidity')
              }
              subtitle={t('Receive LP tokens and earn 0.17% trading fees')}
              helper={t(
                'Liquidity providers earn a 0.17% trading fee on all trades made for that token pair, proportional to their share of the liquidity pair.',
              )}
              backTo={canZap ? () => setSteps(Steps.Choose) : '/liquidity'}
            />
            <CardBody>
              <AutoColumn gap="20px">
                {noLiquidity && (
                  <ColumnCenter>
                    <Message variant="warning">
                      <div>
                        <Text bold mb="8px">
                          {t('You are the first liquidity provider.')}
                        </Text>
                        <Text mb="8px">{t('The ratio of tokens you add will set the price of this pair.')}</Text>
                        <Text>{t('Once you are happy with the rate click supply to review.')}</Text>
                      </div>
                    </Message>
                  </ColumnCenter>
                )}
                <CurrencyInputPanel
                  disableCurrencySelect={canZap}
                  showBUSD
                  onInputBlur={undefined}
                  error={false}
                  disabled={false}
                  beforeButton={<></>}
                  onCurrencySelect={handleCurrencyASelect}
                  zapStyle={canZap ? 'zap' : 'noZap'}
                  value={formattedAmounts[Field.CURRENCY_A]}
                  onUserInput={onFieldAInput}
                  onPercentInput={(percent) => {
                    if (maxAmounts[Field.CURRENCY_A]) {
                      onFieldAInput(maxAmounts[Field.CURRENCY_A]?.multiply(new Percent(percent, 100)).toExact() ?? '')
                    }
                  }}
                  onMax={() => {
                    onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                  }}
                  showQuickInputButton
                  showMaxButton
                  maxAmount={maxAmounts[Field.CURRENCY_A]}
                  currency={currencies[Field.CURRENCY_A]}
                  id="add-liquidity-input-tokena"
                  showCommonBases
                  commonBasesType={CommonBasesType.LIQUIDITY}
                />
                <ColumnCenter>
                  <AddIcon width="16px" />
                </ColumnCenter>
                <CurrencyInputPanel
                  showBUSD
                  onInputBlur={undefined}
                  disabled={canZap && !zapTokenCheckedB}
                  error={false}
                  beforeButton={
                    canZap && (
                      <ZapCheckbox
                        disabled={currencyBalances?.[Field.CURRENCY_B]?.equalTo(0)}
                        checked={zapTokenCheckedB}
                        onChange={(e) => {
                          setZapTokenToggleB(e.target.checked)
                        }}
                      />
                    )
                  }
                  onCurrencySelect={handleCurrencyBSelect}
                  disableCurrencySelect={canZap}
                  zapStyle={canZap ? 'zap' : 'noZap'}
                  value={formattedAmounts[Field.CURRENCY_B]}
                  onUserInput={onFieldBInput}
                  onPercentInput={(percent) => {
                    if (maxAmounts[Field.CURRENCY_B]) {
                      onFieldBInput(maxAmounts[Field.CURRENCY_B]?.multiply(new Percent(percent, 100)).toExact() ?? '')
                    }
                  }}
                  onMax={() => {
                    onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                  }}
                  showQuickInputButton
                  showMaxButton
                  maxAmount={maxAmounts[Field.CURRENCY_B]}
                  currency={currencies[Field.CURRENCY_B]}
                  id="add-liquidity-input-tokenb"
                  showCommonBases
                  commonBasesType={CommonBasesType.LIQUIDITY}
                />

                {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
                  <>
                    <LightCard padding="0px" borderRadius="20px">
                      <RowBetween padding="1rem">
                        <Text fontSize="14px">
                          {noLiquidity ? t('Initial prices and share in the pair') : t('Prices and Share')}
                        </Text>
                      </RowBetween>{' '}
                      <LightCard padding="1rem" borderRadius="20px">
                        <PoolPriceBar
                          currencies={currencies}
                          poolTokenPercentage={poolTokenPercentage}
                          noLiquidity={noLiquidity}
                          price={price}
                        />
                      </LightCard>
                    </LightCard>
                  </>
                )}

                <RowBetween>
                  <Text bold fontSize="12px" color="secondary">
                    {t('Slippage Tolerance')}
                    <IconButton scale="sm" variant="text" onClick={onPresentSettingsModal}>
                      <PencilIcon color="primary" width="10px" />
                    </IconButton>
                  </Text>
                  <Text bold color="primary">
                    {allowedSlippage / 100}%
                  </Text>
                </RowBetween>

                {pair && poolData && (
                  <RowBetween>
                    <TooltipText ref={targetRef} bold fontSize="12px" color="secondary">
                      {t('LP reward APR')}
                    </TooltipText>
                    {tooltipVisible && tooltip}
                    <Text bold color="primary">
                      {formatAmount(poolData.lpApr7d)}%
                    </Text>
                  </RowBetween>
                )}

                {addIsUnsupported || addIsWarning ? (
                  <Button disabled mb="4px">
                    {t('Unsupported Asset')}
                  </Button>
                ) : !account ? (
                  <ConnectWalletButton />
                ) : isWrongNetwork ? (
                  <CommitButton />
                ) : (
                  <AutoColumn gap="md">
                    {shouldShowApprovalGroup && (
                      <RowBetween style={{ gap: '8px' }}>
                        {showFieldAApproval && (
                          <Button
                            onClick={approveACallback}
                            disabled={approvalA === ApprovalState.PENDING}
                            width="100%"
                          >
                            {approvalA === ApprovalState.PENDING ? (
                              <Dots>{t('Enabling %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol ?? 'Unknown' })}</Dots>
                            ) : (
                              t('Enable %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol ?? 'Unknown' })
                            )}
                          </Button>
                        )}
                        {showFieldBApproval && (
                          <Button
                            onClick={approveBCallback}
                            disabled={approvalB === ApprovalState.PENDING}
                            width="100%"
                          >
                            {approvalB === ApprovalState.PENDING ? (
                              <Dots>{t('Enabling %asset%', { asset: currencies[Field.CURRENCY_B]?.symbol ?? 'Unknown' })}</Dots>
                            ) : (
                              t('Enable %asset%', { asset: currencies[Field.CURRENCY_B]?.symbol ?? 'Unknown' })
                            )}
                          </Button>
                        )}
                      </RowBetween>
                    )}
                    <CommitButton
                      isLoading={preferZapInstead}
                      variant={!isValid ? 'danger' : 'primary'}
                      onClick={() => {
                        if (expertMode) {
                          onAdd()
                        } else {
                          setLiquidityState({
                            attemptingTxn: false,
                            liquidityErrorMessage: undefined,
                            txHash: undefined,
                          })
                          onPresentAddLiquidityModal()
                        }
                      }}
                      disabled={buttonDisabled}
                    >
                      {errorText || t('Supply')}
                    </CommitButton>
                  </AutoColumn>
                )}
              </AutoColumn>
            </CardBody>
          </>
        )}
      </AppBody>
      {!(addIsUnsupported || addIsWarning) ? (
        pair && !noLiquidity && pairState !== PairState.INVALID ? (
          <AutoColumn style={{ minWidth: '20rem', width: '100%', maxWidth: '400px', marginTop: '1rem' }}>
            <MinimalPositionCard showUnwrapped={oneCurrencyIsWNATIVE} pair={pair} />
          </AutoColumn>
        ) : null
      ) : (
        <UnsupportedCurrencyFooter currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]} />
      )}
      {/* </StyledDisableFlex> */}
    </Page>
  )
}
