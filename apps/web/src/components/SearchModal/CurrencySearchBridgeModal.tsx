import { useCallback, useState, useRef, useEffect } from 'react'
import { Currency, Token } from '@pancakeswap/sdk'
import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalBackButton,
  ModalCloseButton,
  ModalBody,
  InjectedModalProps,
  Heading,
  // Button,
  useMatchBreakpoints,
  MODAL_SWIPE_TO_CLOSE_VELOCITY,
  // ImportList,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useListState } from 'state/lists/lists'
import { useAllLists } from 'state/lists/hooks'
import { usePreviousValue } from '@pancakeswap/hooks'
import { TokenList } from '@pancakeswap/token-lists'
import { useTranslation } from '@pancakeswap/localization'
import { enableList, removeList, useFetchListCallback } from '@pancakeswap/token-lists/react'
import CurrencySearchBridge from './CurrencySearchBridge'
// import ImportToken from './ImportToken'
// import Manage from './Manage'
import { CurrencyModalView } from './types'
// import { BAD_SRCS } from '../Logo/constants'

// const Footer = styled.div`
//   width: 100%;
//   background-color: ${({ theme }) => theme.colors.backgroundAlt};
//   text-align: center;
// `
const StyledModalContainer = styled(ModalContainer)`
  width: 100%;
  min-width: 320px;
  max-width: 420px !important;
  min-height: calc(var(--vh, 1vh) * 90);
  ${({ theme }) => theme.mediaQueries.md} {
    min-height: auto;
  }
`

const StyledModalBody = styled(ModalBody)`
  padding: 24px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

export interface CurrencySearchModalProps extends InjectedModalProps {
  selectedCurrency?: Currency | null
  onCurrencySelect?: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  showCommonBases?: boolean
  commonBasesType?: string
  showSearchInput?: boolean
  tokensToShow?: Token[]
}

export default function CurrencySearchBridgeModal({
  onDismiss = () => null,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases = true,
  commonBasesType,
  showSearchInput,
  tokensToShow,
}: CurrencySearchModalProps) {
  const [modalView, setModalView] = useState<CurrencyModalView>(CurrencyModalView.search)

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onDismiss?.()
      onCurrencySelect?.(currency)
    },
    [onDismiss, onCurrencySelect],
  )

  // for token import view
  const prevView = usePreviousValue(modalView)

  // used for import token flow
  const [, setImportToken] = useState<Token | undefined>()

  // used for import list
  // const [importList, setImportList] = useState<TokenList | undefined>()
  const [listURL, setListUrl] = useState<string | undefined>()

  const { t } = useTranslation()

  const [, dispatch] = useListState()
  const lists = useAllLists()
  const adding = Boolean(listURL && lists[listURL]?.loadingRequestId)

  const fetchList = useFetchListCallback(dispatch)

  const [addError, setAddError] = useState<string | null>(null)

  // const handleAddList = useCallback(() => {
  //   if (adding) return
  //   setAddError(null)
  //   fetchList(listURL)
  //     .then(() => {
  //       dispatch(enableList(listURL))
  //       setModalView(CurrencyModalView.manage)
  //     })
  //     .catch((error) => {
  //       setAddError(error.message)
  //       dispatch(removeList(listURL))
  //     })
  // }, [adding, dispatch, fetchList, listURL])

  const config = {
    [CurrencyModalView.search]: { title: t('Select a Token'), onBack: undefined },
    [CurrencyModalView.manage]: { title: t('Manage'), onBack: () => setModalView(CurrencyModalView.search) },
    [CurrencyModalView.importToken]: {
      title: t('Import Tokens'),
      onBack: () =>
        setModalView(prevView && prevView !== CurrencyModalView.importToken ? prevView : CurrencyModalView.search),
    },
    [CurrencyModalView.importList]: { title: t('Import List'), onBack: () => setModalView(CurrencyModalView.search) },
  }
  const { isMobile } = useMatchBreakpoints()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  useEffect(() => {
    if (!wrapperRef.current) return
    setHeight(wrapperRef.current.offsetHeight - 330)
  }, [])

  return (
    <StyledModalContainer
      drag={isMobile ? 'y' : false}
      dragConstraints={{ top: 0, bottom: 600 }}
      dragElastic={{ top: 0 }}
      dragSnapToOrigin
      onDragStart={() => {
        if (wrapperRef.current) wrapperRef.current.style.animation = 'none'
      }}
      // @ts-ignore
      onDragEnd={(e, info) => {
        if (info.velocity.y > MODAL_SWIPE_TO_CLOSE_VELOCITY && onDismiss) onDismiss()
      }}
      ref={wrapperRef}
    >
      <ModalHeader>
        <ModalTitle>
          {config[modalView].onBack && <ModalBackButton onBack={config[modalView].onBack} />}
          <Heading>{config[modalView].title}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <StyledModalBody>
      <CurrencySearchBridge
          onCurrencySelect={handleCurrencySelect}
          selectedCurrency={selectedCurrency}
          otherSelectedCurrency={otherSelectedCurrency}
          showCommonBases={showCommonBases}
          commonBasesType={commonBasesType}
          showSearchInput={showSearchInput}
          showImportView={() => setModalView(CurrencyModalView.importToken)}
          setImportToken={setImportToken}
          height={height}
          tokensToShow={tokensToShow}
        />
      </StyledModalBody>
    </StyledModalContainer>
  )
}