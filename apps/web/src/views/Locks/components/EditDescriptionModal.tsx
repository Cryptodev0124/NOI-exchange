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

const EditDescriptionModal: React.FC<React.PropsWithChildren<DepositModalProps>> = ({
  chainId,
  id,
  onDismiss,
}) => {
  const { fetchWithCatchTxError, loading: enablePendingTx } = useCatchTxError()
  const { toastSuccess } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()

  const [title, setTitle] = useState('')
  const [titleError, setTitleError] = useState("Title cannot be blank");

  const { onEditLockDescription } = useLock()
  const dispatch = useAppDispatch()

  const onConfirm = async () => {
    const receipt = await fetchWithCatchTxError(() => onEditLockDescription(id, title))

    if (receipt?.status) {
      toastSuccess(
        `${t('Title changed')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have changed the lock title.')}
        </ToastDescriptionWithTx>,
      )
    }
  }

  const handleChangeOwner = (e) => {
    const value = e.target.value
    setTitle(value)
    setTitleError("")
    if (value === "") setTitleError("Title cannot be blank")
  }

  return (
    <ModalForLaunchpad title={t("Edit Description")} onDismiss={onDismiss}>
      <Box width={["100%", "100%", "100%", "420px"]}>
        <Box width="100%">
          <Text fontSize="12px" color="primary">{t("Input Title*")}</Text>
          <Input
            id="lock-owner-input"
            placeholder={t('Input new description')}
            scale="md"
            autoComplete="off"
            value={title}
            onChange={handleChangeOwner}
          />
          {titleError !== "" && <Text color="failure" fontSize="14px" px="4px">
            {titleError}
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
              disabled={titleError !== ""}
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
  )
}

export default EditDescriptionModal;
