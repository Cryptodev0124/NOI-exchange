import { Dispatch, SetStateAction } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Text, Box, Button, Flex, Link, NextLinkFromReactRouter, LinkExternal } from '@pancakeswap/uikit'
import { getBlockExploreLink } from 'utils'
import { LockFormView, LockData, FinishData } from '../types'
import { FormHeader } from './FormHeader'
import { FormContainer } from './FormContainer'

const accountEllipsis = (address: string) => {
  return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : null
}

export function FinishForm({
  setModalView,
  finishData,
  setFinishData,
}: {
  setModalView: Dispatch<SetStateAction<LockFormView>>
  finishData: FinishData
  setFinishData: Dispatch<SetStateAction<FinishData>>
}) {
  const { t } = useTranslation()

  // const accountEllipsis = finishData.address ? `${finishData.address.substring(0, 6)}...${finishData.address.substring(finishData.address.length - 4)}` : null;

  const handleReturn = async () => {

    setFinishData({
      id: "",
      token: "",
      hash: "",
      chainId: 148
    })

    setModalView(LockFormView.Create)
  }

  return (
    <Box p="4px" position="inherit">
      <FormHeader title={t('Congratulation!')} subTitle={t('You\'ve just created a lock')} />
      <FormContainer>
        <Flex width="100%" alignItems="center" flexDirection={["column", "column", "row"]}>
          <Box mr={["0", "0", "15px"]} mb={["10px", "10px", "0"]} width="100%">
            <Link width="100% !important" external href={getBlockExploreLink(finishData.hash, 'transaction', finishData.chainId)}>
              <Button
                width="100%"
                variant="secondary"
              ><Text color="primary" bold fontSize="14px">{t("View Transaction")}</Text></Button>
            </Link>
          </Box>
          <Box width="100%">
            {/* <Link width="100% !important" external href={getBlockExploreLink(finishData.address, 'token', finishData.chainId)}> */}
            <Button
              width="100%"
              // variant="secondary"
              onClick={handleReturn}
            ><Text color="invertedContrast" bold fontSize="14px">{t("Create Other")}</Text></Button>
            {/* </Link> */}
          </Box>
        </Flex>
        <Flex width="100%" alignItems="center" flexDirection={["column", "column", "row"]}>
          <Box mr={["0", "0", "15px"]} mb={["10px", "10px", "0"]} width="100%">
            <NextLinkFromReactRouter to={`/lock/token/${finishData.token}`}>
              <Button
                width="100%"
              ><Text color="invertedContrast" bold fontSize="14px">{t("View Token")}</Text></Button>
            </NextLinkFromReactRouter>
          </Box>
          <Box width="100%">
            <NextLinkFromReactRouter to={`/lock/record/${finishData.id}`}>
              <Button
                width="100%"
              ><Text color="invertedContrast" bold fontSize="14px">{t("View Lock")}</Text></Button>
            </NextLinkFromReactRouter>
          </Box>
        </Flex>
      </FormContainer>
    </Box>
  )
}
