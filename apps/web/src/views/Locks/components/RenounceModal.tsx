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

const RenounceModal: React.FC<React.PropsWithChildren<DepositModalProps>> = ({
  chainId,
  id,
  onDismiss,
}) => {
  const { fetchWithCatchTxError, loading: enablePendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()

  const { onRenounceOwnership } = useLock()
  const dispatch = useAppDispatch()

  const onConfirm = async () => {
    const receipt = await fetchWithCatchTxError(() => onRenounceOwnership(id))

    if (receipt?.status) {
      toastSuccess(
        `${t('Renounced')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have renounced the lock ownership.')}
        </ToastDescriptionWithTx>,
      )
    }
  }

  return (
    <ModalForLaunchpad title={t("Renounce Ownership")} onDismiss={onDismiss}>
      <Box width={["100%", "100%", "100%", "420px"]}>
        <Text>{t("You are going to renounce the lock ownership.")}</Text>
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

export default RenounceModal;
