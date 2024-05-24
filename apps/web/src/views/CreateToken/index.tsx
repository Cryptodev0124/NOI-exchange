import { useState } from 'react'
import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'
import { FinishData, TokenData, TokenFormView } from './types'
import Page from '../Page'
import { VerifyTokenForm } from './components/VerifyTokenForm'
import { FinishForm } from './components/FinishForm'

export const StyledAppBody = styled(Card)`
  margin-top: 10px;
  border-radius: 8px;
  max-width: 1080px;
  width: 100%;
  z-index: 1;
`
const Launchpad: React.FC<React.PropsWithChildren> = () => {
  const [modalView, setModalView] = useState<TokenFormView>(TokenFormView.Create)

  const [ tokenData, setTokenData ] = useState<TokenData>({
    name: "",
    symbol: "",
    decimals: "",
    totalSupply: "",
    type: "standard",
    liquidityGen: undefined,
    baby: undefined,
    buyBackBaby: undefined
  })

  const [finishData, setFinishData] = useState<FinishData>({
    address: "" as `0x${string}`,
    hash: "",
    chainId: 148
  })

  return (
    <Page>
      <StyledAppBody mb="24px">
        {
          modalView === TokenFormView.Create && 
          <VerifyTokenForm
            setModalView={setModalView}
            tokenData={tokenData}
            setTokenData={setTokenData}
            setFinishData={setFinishData}
          />
        }
        {
          modalView === TokenFormView.Finish && 
          <FinishForm
            setModalView={setModalView}
            tokenData={tokenData}
            finishData={finishData}
            setTokenData={setTokenData}
            setFinishData={setFinishData}
          />
        }
      </StyledAppBody>
    </Page>
  )
}

export default Launchpad
