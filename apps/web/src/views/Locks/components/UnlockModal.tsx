import { useCallback, useState } from "react";
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

const UnlockModal: React.FC<React.PropsWithChildren<DepositModalProps>> = ({
  chainId,
  id,
  onDismiss,
}) => {
  const { fetchWithCatchTxError, loading: enablePendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()

  const { onUnlock } = useLock()
  const dispatch = useAppDispatch()

  const onConfirm = async () => {
    const receipt = await fetchWithCatchTxError(() => onUnlock(id))

    if (receipt?.status) {
      toastSuccess(
        `${t('Unlocked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have unlocked the token.')}
        </ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <ModalForLaunchpad title={t("Unlock")} onDismiss={onDismiss}>
      <Box width={["100%", "100%", "100%", "420px"]}>
        <Text>{t("You are going to unlock the token.")}</Text>
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
              // disabled={}
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

export default UnlockModal;
