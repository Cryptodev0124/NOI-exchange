import BigNumber from "bignumber.js";
import { useCallback, useState, useEffect } from "react";
import { isAddress } from 'utils'
import _toNumber from "lodash/toNumber";
import { useTranslation } from "@pancakeswap/localization";
import { 
  Modal, 
  ModalBody, 
  ModalActions, 
  Button,
  AutoRenewIcon,
  useToast,
  Box,
  Text,
  Flex,
  Checkbox,
  Input,
  ModalForLaunchpad,
} from "@pancakeswap/uikit";
import { ToastDescriptionWithTx } from "components/Toast";
import { useAppDispatch } from "state";
import { useCurrencyBalances } from 'state/wallet/hooks'
import useCatchTxError from "hooks/useCatchTxError";
import { useLPToken, useToken } from 'hooks/Tokens'
import { fetchLaunchpadPublicDataAsync } from "state/launchpad";
import useLock from "../hooks/useLock";

interface DepositModalProps {
  chainId: number
  id: string
  account?: `0x${string}`
  token: string
  oldAmount: string
  oldDate: number
  onDismiss?: () => void
}

const EditModal: React.FC<React.PropsWithChildren<DepositModalProps>> = ({
  chainId,
  id,
  account,
  token,
  oldAmount,
  oldDate,
  onDismiss,
}) => {
  const { fetchWithCatchTxError, loading: enablePendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()

  const searchToken = useToken(token)

  const relevantTokenBalances = useCurrencyBalances(account, [
    searchToken,
  ])

  const balance = relevantTokenBalances[0]?.quotient?.toString() ?? "0"

  const [amount, setAmount] = useState('')
  const [amountError, setAmountError] = useState("amount is a required field");

  const [lockTime, setLockTime] = useState("")
  const [lockTimeError, setLockTimeError] = useState("");

  const { onEditLock } = useLock()
  const dispatch = useAppDispatch()

  const onConfirm = async () => {
    if (!searchToken) return
    const receipt = await fetchWithCatchTxError(() => onEditLock(
      id, 
      new BigNumber(amount).times(10**searchToken?.decimals).toFixed(), 
      new BigNumber(Date.parse(`${lockTime.replace("T", " ")} GMT`)).div(1000).toFixed()
    ))

    if (receipt?.status) {
      toastSuccess(
        `${t('Lock Edited')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have edited the lock.')}
        </ToastDescriptionWithTx>,
      )
    }
  }

  useEffect(() => {
    setLockTimeError("")
    const lockTimeInTimestamp = Date.parse(`${lockTime.replace("T", " ")} GMT`);
    if (Number.isNaN(lockTimeInTimestamp)) {setLockTimeError("Lock time cannot be blank"); return}
    if (lockTimeInTimestamp <= Date.now()) setLockTimeError("Unlock time needs to be after now")
    if (lockTimeInTimestamp <= Number(oldDate)) setLockTimeError("New unlock time should not be before old unlock time")
  }, [lockTime])

  const handleChangeAmount = (e) => {
    if (!searchToken) return
    const value = e.target.value
    setAmount(value)
    setAmountError("")
    if (Number(value) > Number(balance) / 10**searchToken?.decimals) setAmountError(`Max amount is ${Number(balance) / 10**searchToken?.decimals}`)
    if (Number(value) < Number(oldAmount)) setAmountError("New amount must be not less than current amount")
    if (Number(value) <= 0) setAmountError("Amount must be positive number")
  }

  return (
    <ModalForLaunchpad title={t("Edit Lock")} onDismiss={onDismiss}>
      <Box width={["100%", "100%", "100%", "420px"]}>
        <Box width="100%" mb="20px">
          <Text fontSize="12px" color="primary">{t("Amount*")}</Text>
          <Input
            id="token-search-input"
            type="number"
            placeholder={t('Enter amount')}
            scale="md"
            autoComplete="off"
            value={amount}
            onChange={handleChangeAmount}
          />
          {amountError !== "" && <Text color="failure" fontSize="14px" px="4px">
            {amountError}
          </Text>}
        </Box>
        <Box>
          <Text fontSize="12px" color="primary">{t("Lock until (UTC)*")}</Text>
          <Input
            type="datetime-local"
            placeholder={t("Select date")}
            scale="md"
            value={lockTime}
            onChange={(e) => setLockTime(e.target.value)}
          />
          {lockTimeError !== "" && <Text color="failure" fontSize="14px" px="4px">
            {lockTimeError}
          </Text>}
        </Box>
        <ModalActions>
          <Button variant="secondary" onClick={onDismiss} width="100%" disabled={pendingTx}>
            {t("Cancel")}
          </Button>
          {pendingTx ? (
            <Button width="100%" isLoading={pendingTx} endIcon={<AutoRenewIcon spin color="currentColor" />}>
              {t("Confirming")}
            </Button>
          ) : (
            <Button
              width="100%"
              disabled={amountError !== "" || lockTimeError !== ""}
              onClick={async () => {
                setPendingTx(true);
                await onConfirm();
                onDismiss?.();
                setPendingTx(false);
              }}
            >
              {t("Confirm")}
            </Button>
          )}
        </ModalActions>
      </Box>
    </ModalForLaunchpad>
  );
};

export default EditModal;
