import { Dispatch, SetStateAction, useEffect, useState } from 'react'
// import { isAddress } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
// import { Currency, ChainId, WNATIVE } from '@pancakeswap/sdk'
import { useDebounce } from '@pancakeswap/hooks'
import { Text, Box, Message, Button, Input, Checkbox, Flex, MessageText, LinkExternal } from '@pancakeswap/uikit'
import { useCurrencyBalances } from 'state/wallet/hooks'
import styled from 'styled-components'
import { useAccount } from 'wagmi'
import addresses from 'config/constants/contracts'
import ConnectWalletButton from 'components/ConnectWalletButton'
// import Row from 'components/Layout/Row'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useLPToken, useToken } from 'hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { getLockerAddress } from 'utils/addressHelpers'
import { getBlockExploreLink, isAddress } from 'utils'
import { useAccountInfo } from '../hooks/useAccountInfo'
import { LockFormView, FinishData } from '../types'
import { FormHeader } from './FormHeader'
import { FormContainer } from './FormContainer'
import SendCommitButton from './SendCommitButton'

// const StyledButton = styled(Button)`
//   background-color: ${({ theme }) => theme.colors.input};
//   color: ${({ theme }) => theme.colors.text};
//   box-shadow: none;
//   border-radius: 8px;
//   margin-bottom: 5px;
//   height: 40px;
// `

const accountEllipsis = (address: string) => {
  return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : null
}

export function VerifyTokenForm({
  setModalView,
  setFinishData
}: {
  setModalView: Dispatch<SetStateAction<LockFormView>>
  setFinishData: Dispatch<SetStateAction<FinishData>>
}) {
  const { t } = useTranslation()
  const {chainId} = useActiveChainId()
  const { address: account } = useAccount()

  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [lockTime, setLockTime] = useState("")
  const [tgeRate, setTgeRate] = useState("")
  const [cycle, setCycle] = useState("")
  const [cycleRate, setCycleRate] = useState("")
  const [owner, setOwner] = useState("")

  const [decimals, setDecimals] = useState(0)

  const [isAnotherOwner, setIsAnotherOwner] = useState(false)
  const [isVesting, setIsVesting] = useState(false)

  const [tokenError, setTokenError] = useState("");
  const [ownerError, setOwnerError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [lockTimeError, setLockTimeError] = useState("");
  const [tgeRateError, setTgeRateError] = useState("");
  const [cycleError, setCycleError] = useState("");
  const [cycleRateError, setCycleRateError] = useState("");

  const [searchQuery, setSearchQuery] = useState<string>("")
  const debouncedQuery = useDebounce(searchQuery, 200)
  const searchToken = useToken(debouncedQuery)
  const searchLP = useLPToken(debouncedQuery as `0x${string}`)

  const relevantTokenBalances = useCurrencyBalances(account ?? undefined, [
    searchToken ?? undefined,
  ])

  const balance = relevantTokenBalances[0]?.quotient?.toString() ?? "0"

  const {
    parsedAmount,
    inputError
  } = useAccountInfo(amount, searchToken)

  const {approvalState, approveCallback} = useApproveCallback(parsedAmount, getLockerAddress(chainId))
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  useEffect(() => {
    if (approvalState === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approvalState, approvalSubmitted])

  useEffect(() => {
    setOwnerError("")
    setTitleError("")
    setAmountError("")
    setTgeRateError("")
    setCycleRateError("")
    setCycleError("")
    if (!isAddress(owner)) setOwnerError("Address is invalid")
    if (owner === "") setOwnerError("Address cannot be blank")
    if (title.length > 255) setTitleError("Title must be at most 255 characters")
    if (Number(amount) > Number(balance) / 10**decimals) setAmountError(`Max amount is ${Number(balance) / 10**decimals}`)
    if (Number(amount) <= 0) setAmountError("Amount must be positive number")
    if (Number(tgeRate) + Number(cycleRate) > 100) {
      setTgeRateError("Cycle Release Percent and TGE Percent must be less than 100 percent")
      setCycleRateError("Cycle Release Percent and TGE Percent must be less than 100 percent")
    }
    if (Number(tgeRate) <= 0) setTgeRateError("TGE Percent must be positive number")
    if (Number(cycle) <= 0) setCycleError("Cycle must be positive number")
    if (Number(cycleRate) <= 0) setCycleRateError("Cycle must be positive number")
    if (Number(tgeRate) > 100) setTgeRateError("TGE Percent must be less than 100 percent")
    if (Number(cycleRate) > 100) setCycleRateError("Cycle Release Percent must be less than 100 percent")
  }, [owner, title, amount, tgeRate, cycle, cycleRate, balance])

  useEffect(() => {
    setLockTimeError("")
    const lockTimeInTimestamp = Date.parse(`${lockTime.replace("T", " ")} GMT`);
    if (Number.isNaN(lockTimeInTimestamp)) {setLockTimeError(isVesting ? "TGE date cannot be blank" : "Lock time cannot be blank"); return}
    if (lockTimeInTimestamp <= Date.now()) setLockTimeError(isVesting ? "TGE date needs to be after now" : "Unlock time needs to be after now")
  }, [lockTime, isVesting])

  useEffect(() => {
    if (searchToken === null) {
      setTokenError("Unknown address")
    }
    if (searchToken) {
      setTokenError("")
      setDecimals(searchToken.decimals)
    }
  }, [searchToken])

  useEffect(() => {
    setTokenError("")
    if (!isAddress(searchQuery)) setTokenError("Invalid token address")
    if (searchQuery === "") setTokenError("Token address cannot be blank")
  }, [searchQuery])

  const isEnable = tokenError === "" &&
    (!isAnotherOwner || ownerError === "") &&
    titleError === "" &&
    amountError === "" &&
    lockTimeError === "" &&
    (!isVesting || tgeRateError === "") &&
    (!isVesting || cycleError === "") &&
    (!isVesting || cycleRateError === "")

  return (
    <Box p="4px" position="inherit">
      <FormHeader title={t('Create Lock')} subTitle={t('')} />
      <FormContainer>
        <Box>
          <Box mb="20px">
            <Text fontSize="12px" color="primary">{t("Token or LP Token address*")}</Text>
            <Input
              id="token-search-input"
              placeholder={t('Enter token or LP token address')}
              scale="md"
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {tokenError !== "" && <Text color="failure" fontSize="14px" px="4px">
              {tokenError}
            </Text>}
            <Flex alignItems="center" my="20px" onClick={() => setIsAnotherOwner(!isAnotherOwner)}>
              <Checkbox
                scale="sm"
                checked={isAnotherOwner}
                readOnly
              />
              <Text ml="10px">{t("use another owner?")}</Text>
            </Flex>
            {isAnotherOwner && <><Text fontSize="12px" color="primary">{t("Owner*")}</Text>
            <Input
              id="token-search-input"
              placeholder={t('Enter owner address')}
              scale="md"
              autoComplete="off"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
            /></>}
            {ownerError !== "" && isAnotherOwner && <Text color="failure" fontSize="14px" px="4px">
              {ownerError}
            </Text>}
            {searchToken && !searchLP &&
              <>
                <Flex width="100%" justifyContent="space-between" px="20px" mt="10px">
                  <Text>{t("Token Name")}</Text>
                  <Text>{searchToken.name}</Text>
                </Flex>
                <Flex width="100%" justifyContent="space-between" px="20px" mt="10px">
                  <Text>{t("Token Symbol")}</Text>
                  <Text>{searchToken.symbol}</Text>
                </Flex>
                <Flex width="100%" justifyContent="space-between" px="20px" mt="10px">
                  <Text>{t("Token Decimals")}</Text>
                  <Text>{searchToken.decimals}</Text>
                </Flex>
                {account && <Flex width="100%" justifyContent="space-between" px="20px" mt="10px">
                  <Text>{t("Balance")}</Text>
                  <Text>{(Number(balance) / 10**searchToken.decimals).toString()}</Text>
                </Flex>}
              </>
            }
            {searchToken && searchLP &&
              <>
                <Flex width="100%" justifyContent="space-between" px="20px" mt="10px">
                  <Text>{t("Pair")}</Text>
                  <Text>{searchLP[1]}/{searchLP[2]}</Text>
                </Flex>
                <Flex width="100%" justifyContent="space-between" px="20px" mt="10px">
                  <Text>{t("Factory")}</Text>
                  <LinkExternal href={getBlockExploreLink(searchLP[0], 'address', chainId)}>
                    <Text color="primary">{accountEllipsis(searchLP[0])}</Text>
                  </LinkExternal>
                </Flex>
                {account && <Flex width="100%" justifyContent="space-between" px="20px" mt="10px">
                  <Text>{t("Balance")}</Text>
                  <Text>{(Number(balance) / 10**searchToken.decimals).toString()}</Text>
                </Flex>}
              </>
            }
          </Box>
          <Box mb="20px">
            <Text fontSize="12px" color="primary">{t("Title")}</Text>
            <Input
              id="token-search-input"
              placeholder={t('Ex: My Lock')}
              scale="md"
              autoComplete="off"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {titleError !== "" && <Text color="failure" fontSize="14px" px="4px">
              {titleError}
            </Text>}
          </Box>
          <Box mb="20px">
            <Text fontSize="12px" color="primary">{t("Amount*")}</Text>
            <Input
              id="token-search-input"
              type="number"
              placeholder={t('Enter amount')}
              scale="md"
              autoComplete="off"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {amountError !== "" && <Text color="failure" fontSize="14px" px="4px">
              {amountError}
            </Text>}
          </Box>
          <Box mb="20px">
            <Flex alignItems="center" my="20px" onClick={() => setIsVesting(!isVesting)}>
              <Checkbox
                scale="sm"
                checked={isVesting}
                readOnly
              />
              <Text ml="10px">{t("use vesting?")}</Text>
            </Flex>
          </Box>
          {!isVesting && <Box mb="20px">
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
          </Box>}
          {isVesting && <Box mb="20px">
            <Flex flexDirection={["column", "column", "column", "row"]}>
              <Box width="100%" mb={["15px", "15px", "15px", "0"]}>
                <Text fontSize="12px" color="primary">{t("TGE Date (UTC)*")}</Text>
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
              <Box ml={["0", "0", "0", "25px"]} mb={["15px", "15px", "15px", "0"]} width="100%">
                <Text fontSize="12px" color="primary">{t("TGE Percent*")}</Text>
                <Input
                  type="number"
                  placeholder={t('Ex: 10')}
                  scale="md"
                  value={tgeRate}
                  onChange={(e) => setTgeRate(e.target.value)}
                />
                {tgeRateError !== "" && <Text color="failure" fontSize="14px" px="4px">
                  {tgeRateError}
                </Text>}
              </Box>
            </Flex>
          </Box>}
          {isVesting && <Box mb="20px">
            <Flex flexDirection={["column", "column", "column", "row"]}>
              <Box width="100%" mb={["15px", "15px", "15px", "0"]}>
                <Text fontSize="12px" color="primary">{t("Cycle (days)*")}</Text>
                <Input
                  type="number"
                  placeholder={t('Ex: 10')}
                  scale="md"
                  value={cycle}
                  onChange={(e) => setCycle(e.target.value)}
                />
                {cycleError !== "" && <Text color="failure" fontSize="14px" px="4px">
                  {cycleError}
                </Text>}
              </Box>
              <Box ml={["0", "0", "0", "25px"]} mb={["15px", "15px", "15px", "0"]} width="100%">
                <Text fontSize="12px" color="primary">{t("Cycle Release Percent*")}</Text>
                <Input
                  type="number"
                  placeholder={t('Ex: 10')}
                  scale="md"
                  value={cycleRate}
                  onChange={(e) => setCycleRate(e.target.value)}
                />
                {cycleRateError !== "" && <Text color="failure" fontSize="14px" px="4px">
                  {cycleRateError}
                </Text>}
              </Box>
            </Flex>
          </Box>}
        </Box>
        <Message variant="warning" icon={false} p="8px 12px">
          <MessageText color="text">
            <span>{t("Please exclude lockup address %address% from fees, rewards, max tx amount to start locking tokens. \nWe don't support rebase tokens.", {address: addresses.locker[chainId]})}</span>
          </MessageText>
        </Message>
        {!account ? <ConnectWalletButton /> : searchToken && isEnable ? <SendCommitButton
          chainId={chainId}
          token={searchQuery}
          symbol={searchToken.symbol}
          decimals={searchToken.decimals}
          owner={owner}
          isLP={!!searchLP}
          amount={amount}
          lockTime={Date.parse(`${lockTime.replace("T", " ")} GMT`)}
          title={title}
          isVesting={isVesting}
          tgeRate={tgeRate}
          cycle={cycle}
          cycleRate={cycleRate}
          account={account}
          approval={approvalState}
          approveCallback={approveCallback}
          approvalSubmitted={approvalSubmitted}
          setApprovalSubmitted={setApprovalSubmitted}
          swapInputError={inputError}
          setFinishData={setFinishData}
          setModalView={setModalView}
        /> : <Button disabled>{t("Create Lock")}</Button>}
      </FormContainer>
    </Box>
  )
}
