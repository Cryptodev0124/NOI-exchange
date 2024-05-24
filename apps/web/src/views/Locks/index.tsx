import { useState, useMemo, useCallback, useEffect, useRef} from 'react'
import { useAccount } from 'wagmi'
import { WNATIVE } from '@pancakeswap/sdk'
import {
  Text,
  Flex,
  Loading,
  SearchInput,
  FlexLayout,
  ToggleView,
  Select,
  Box,
  OptionProps,
} from '@pancakeswap/uikit'
import { isAddress } from 'utils'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { useRouter } from 'next/router'
import { useTranslation } from '@pancakeswap/localization'
import { shimmer2Tokens } from '@pancakeswap/tokens'
import { usePollTokenLocks } from 'state/locks/hooks'
import { SerializedTokenLockData } from 'state/locks/types'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useLocker } from 'hooks/useContract'
import { useLPLocks, useTokenLocks, useTokenLockedCount, useTokenInfo, useLPLockedCount, useTokenLockedCountForUser, useLPLockedCountForUser, useTokenLocksForUser, useLPLocksForUser } from 'hooks/useLocks'
import TokenLockTable from './components/TokenLockTable'
import { filterPoolsByQuery } from './filterBondsByQuery'

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: center;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 0;
    margin-bottom: 0;
  }
`

const LabelWrapper = styled.div`
  width: 100%;
  > ${Text} {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  // width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    // width: auto;
    padding: 0;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: center;
  display: flex;
  align-items: center;
  position: relative;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: center;
    width: 100%;

    > div {
      padding: 0;
    }
  }
`

const MAX_ITEMS = 10

const Locks: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const lengthForTokenLock = useTokenLockedCount()
  const lengthForLPLock = useLPLockedCount()
  const lengthForTokenLockForUser = useTokenLockedCountForUser(account)
  const lengthForLPLockForUser = useLPLockedCountForUser(account)

  // const [length, setLength] = useState(lengthForTokenLock)

  const [filterOption, setFilterOption] = useState('normal')
  const [typeOption, setTypeOption] = useState('all')

  const { chainId } = useActiveChainId()

  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(1)

  const _tokenData = useTokenLocks(BigInt(start), BigInt(end), chainId)
  const _lpData = useLPLocks(BigInt(start), BigInt(end), chainId)
  const _tokenDataForUser = useTokenLocksForUser(account, chainId)
  const _lpDataForUser = useLPLocksForUser(account, chainId)

  const tokenData = useMemo(() => _tokenData.reverse(), [_tokenData])
  const lpData = useMemo(() => _lpData.reverse(), [_lpData])
  const tokenDataForUser = useMemo(() => _tokenDataForUser.reverse(), [_tokenDataForUser])
  const lpDataForUser = useMemo(() => _lpDataForUser.reverse(), [_lpDataForUser])

  const [query, setQuery] = useState('')
  // const [query_, setQuery_] = useState(WNATIVE[chainId].address)
  const tokenInfo = useTokenInfo(isAddress(query as `0x${string}`)? query as `0x${string}` : shimmer2Tokens.smr.address, chainId)
  // const normalizedUrlSearch = useMemo(() => (typeof urlQuery?.search === 'string' ? urlQuery.search : ''), [urlQuery])
  // const query = normalizedUrlSearch && !_query ? normalizedUrlSearch : _query

  const [page, setPage] = useState(1)

  const [type, setType] = useState(0)

  const length = type === 0 ? lengthForTokenLock : (type === 1 ? lengthForTokenLockForUser : (type === 2 ? lengthForLPLock : lengthForLPLockForUser))

  const activeData = query? (tokenInfo && isAddress(query) ? [tokenInfo] : []) : 
    type === 0 ? tokenData : (type === 1 ? tokenDataForUser : (type === 2 ? lpData : lpDataForUser))

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  useEffect(() => {
    setStart(Number(length) > MAX_ITEMS * page ? Number(length) - MAX_ITEMS * page : 0)
    setEnd(Number(length) > MAX_ITEMS * (page - 1) + 1 ? Number(length) - MAX_ITEMS * (page - 1) - 1 : 0)
  }, [page, length])

  // useEffect(() => {
  //   if (isAddress(query)) setQuery_(query)
  // }, [query])

  // usePollTokenLocks(start, end)

  const handleFilterOptionChange = (option: OptionProps): void => {
    setFilterOption(option.value)
  }

  const handleSelectTypeChange = (option: OptionProps): void => {
    setTypeOption(option.value)
  }

  useEffect(() => {
    if (filterOption === "normal") {
      if (typeOption === "all") {
        setType(0)
      }
      if (typeOption === "my") {
        setType(1)
      }
    }
    if (filterOption === "lp") {
      if (typeOption === "all") {
        setType(2)
      }
      if (typeOption === "my") {
        setType(3)
      }
    }
  }, [filterOption, typeOption])

  return (
    <Page>
      <ControlContainer>
        <FilterContainer>
          <LabelWrapper style={{ marginRight: 16 }}>
            <Text textTransform="uppercase" color="textSubtle" fontSize="12px" bold>
              {t('Token Type')}
            </Text>
            <Select
              options={[
                {
                  label: t('Normal'),
                  value: 'normal',
                },
                {
                  label: t('LP'),
                  value: 'lp',
                },
              ]}
              onOptionChange={handleFilterOptionChange}
            />
          </LabelWrapper>
          <LabelWrapper style={{ marginTop: 20 }}>
            <Select
              options={[
                {
                  label: t('All'),
                  value: 'all',
                },
                {
                  label: t('My Locks'),
                  value: 'my',
                },
              ]}
              onOptionChange={handleSelectTypeChange}
            />
          </LabelWrapper>
        </FilterContainer>
        <ViewControls>
          <LabelWrapper>
            <Box mt="20px" width="100%">
              <SearchInput onChange={handleChangeQuery} placeholder="Search by token address..." />
            </Box>
          </LabelWrapper>
        </ViewControls>
      </ControlContainer>
        {activeData && <TokenLockTable
            data={activeData}
            length={Number(length)}
            page={page}
            setPage={setPage}
            type={type}
          />}
    </Page>
  )
}

export default Locks