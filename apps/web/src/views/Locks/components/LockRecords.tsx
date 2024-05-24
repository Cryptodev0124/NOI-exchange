import BigNumber from "bignumber.js";
import { Dispatch, Fragment, useEffect, useMemo, useState, SetStateAction } from "react";
import { useTranslation } from "@pancakeswap/localization";
import { ArrowBackIcon, ArrowForwardIcon, Button, Flex, NextLinkFromReactRouter, Text, LinkExternal } from "@pancakeswap/uikit";
import styled from "styled-components";
import { CHAIN_QUERY_NAME } from "config/chains";
import { ZERO_ADDRESS } from "config/constants";
import { SerializedTokenLockData } from "state/locks/types";
import { CurrencyLogo } from "components/Logo";
import { useActiveChainId } from 'hooks/useActiveChainId'
import useNativeCurrency from "hooks/useNativeCurrency";
import { useCurrency } from "hooks/Tokens";
import { getBlockExploreLink } from 'utils'
import Divider from "components/Divider";

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 0.5em;
  align-items: center;

  padding: 0 24px;

  grid-template-columns: 1fr 1fr 1fr 1fr;

  @media screen and (max-width: 670px) {
    grid-template-columns: 1.5fr 1fr 1fr;
    & > *:nth-child(3) {
      display: none;
    }
  }
`

const TableWrapper = styled(Flex)`
  width: 100%;
  padding-top: 16px;
  flex-direction: column;
  background-color: ${({ theme }) => theme.card.background};
  border-radius: 8px;
  // border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  ${({ theme }) => theme.mediaQueries.md} {
    border-radius: 8px;
  }
`

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.2em;
  margin-bottom: 1.2em;
`

const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 20px;
  :hover {
    cursor: pointer;
  }
`

const accountEllipsis = (address: string) => {
  return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : null
}

const DataRow: React.FC<React.PropsWithChildren<{ data: any}>> = ({ data }) => {
  const { t } = useTranslation()
  const token = useCurrency(data.address)
  const {chainId} = useActiveChainId()
  const url = `/lock/record/${data.id}`
  return (
    <>
    <ResponsiveGrid>
      <LinkExternal href={getBlockExploreLink(data.owner, 'address', chainId)}>
        <Text color="primary">{accountEllipsis(data.owner)}</Text>
      </LinkExternal>
      <Text>{new BigNumber(data.amount).div(10 ** data.decimals).toJSON()}</Text>
      <Text>{new Date(data.tgeDate * 1000).toLocaleString()}</Text>
      <NextLinkFromReactRouter to={`${url}`}>
        <Button
          width="100%"
          variant="text"
        >{t("View")}</Button>
      </NextLinkFromReactRouter>
    </ResponsiveGrid>
    <Divider />
    </>
  )
}

const MAX_ITEMS = 10

const LockRecords: React.FC<
  React.PropsWithChildren<{
    data: any[]
    length: number
    page: number
    setPage: Dispatch<SetStateAction<number>>
  }>
> = ({ data, length, page, setPage }) => {
  const { t } = useTranslation()

  const maxPage = Number.isNaN(length) ? 1 : Math.floor(length / MAX_ITEMS) + (length % MAX_ITEMS === 0 ? 0 : 1)

  return (
    <TableWrapper>
      <ResponsiveGrid>
        <Text color="secondary" fontSize="12px" bold>
          {t("Wallet")}
        </Text>
        <Text color="secondary" fontSize="12px" bold>
          {t("Amount")}
        </Text>
        <Text color="secondary" fontSize="12px" bold>
          {t("Unlock time(UTC)")}
        </Text>
        <Text color="secondary" fontSize="12px" bold>
          {t("")}
        </Text>
      </ResponsiveGrid>

      <Divider />

      {data.map((row, i) => {
        if (row) {
          return (
            <Fragment key={row.address}>
              <DataRow data={row} />
            </Fragment>
          )
        }
        return null
      })}
      <PageButtons>
        <Arrow
          onClick={() => {
            setPage(page === 1 ? page : page - 1)
          }}
        >
          <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
        </Arrow>
        <Text>{t('Page %page% of %maxPage%', { page, maxPage })}</Text>
        <Arrow
          onClick={() => {
            setPage(page === maxPage ? page : page + 1)
          }}
        >
          <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
        </Arrow>
      </PageButtons>
    </TableWrapper>
  )
}

export default LockRecords