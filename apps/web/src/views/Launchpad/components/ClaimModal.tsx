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
import usePool from "../hooks/usePool";

interface DepositModalProps {
  chainId: number
  pool: `0x${string}`
  onDismiss?: () => void
}

const ClaimModal: React.FC<React.PropsWithChildren<DepositModalProps>> = ({
  chainId,
  pool,
  onDismiss,
}) => {
  const { fetchWithCatchTxError, loading: enablePendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()

  const { onClaim } = usePool(pool, false)
  const dispatch = useAppDispatch()

  const onDone = useCallback(
    () => dispatch(fetchLaunchpadPublicDataAsync({ address: pool, chainId })),
    [pool, chainId, dispatch],
  )

  const onConfirm = async () => {
    const receipt = await fetchWithCatchTxError(() => onClaim())

    if (receipt?.status) {
      toastSuccess(
        `${t('Claimed')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have claimed from the pool.')}
        </ToastDescriptionWithTx>,
      )
      onDone()
    }
  }

  return (
    <ModalForLaunchpad title={t("Claim")} onDismiss={onDismiss}>
      <Box width={["100%", "100%", "100%", "420px"]}>
        <Text>{t("You are going to claim from this pool.")}</Text>
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

export default ClaimModal;
