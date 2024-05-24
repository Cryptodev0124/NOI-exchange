import BigNumber from "bignumber.js";
import { useCallback, useState } from "react";
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
import useCatchTxError from "hooks/useCatchTxError";
import { ToastDescriptionWithTx } from "components/Toast";
import { useAppDispatch } from "state";
import { fetchLaunchpadPublicDataAsync } from "state/launchpad";
import useLock from "../hooks/useLock";

interface DepositModalProps {
  chainId: number
  id: string
  onDismiss?: () => void
}

const TransferModal: React.FC<React.PropsWithChildren<DepositModalProps>> = ({
  chainId,
  id,
  onDismiss,
}) => {
  const { fetchWithCatchTxError, loading: enablePendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()

  const [owner, setOwner] = useState('')
  const [ownerError, setOwnerError] = useState("Address cannot be blank");

  const { onTransferOwnership } = useLock()
  const dispatch = useAppDispatch()

  const onConfirm = async () => {
    const receipt = await fetchWithCatchTxError(() => onTransferOwnership(id, owner))

    if (receipt?.status) {
      toastSuccess(
        `${t('Lock owner changed')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have transferred lock ownership.')}
        </ToastDescriptionWithTx>,
      )
    }
  }

  const handleChangeOwner = (e) => {
    const value = e.target.value
    setOwner(value)
    setOwnerError("")
    if (!isAddress(value)) setOwnerError("Invalid address")
    if (value === "") setOwnerError("Address cannot be blank")
  }

  return (
    <ModalForLaunchpad title={t("Transfer Ownership")} onDismiss={onDismiss}>
      <Box width={["100%", "100%", "100%", "420px"]}>
        <Box width="100%">
          <Text fontSize="12px" color="primary">{t("New Owner Address*")}</Text>
          <Input
            id="lock-owner-input"
            placeholder={t('Input new owner address')}
            scale="md"
            autoComplete="off"
            value={owner}
            onChange={handleChangeOwner}
          />
          {ownerError !== "" && <Text color="failure" fontSize="14px" px="4px">
            {ownerError}
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
              disabled={ownerError !== ""}
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

export default TransferModal;
