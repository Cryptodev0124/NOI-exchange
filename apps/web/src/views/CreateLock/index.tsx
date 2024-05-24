import { useState } from 'react'
import styled from 'styled-components'
import { Card } from '@pancakeswap/uikit'
import { FinishData, LockFormView } from './types'
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
  const [modalView, setModalView] = useState<LockFormView>(LockFormView.Create)

  const [finishData, setFinishData] = useState<FinishData>({
    id: "",
    token: "",
    hash: "",
    chainId: 148
  })

  return (
    <Page>
      <StyledAppBody mb="24px">
        {
          modalView === LockFormView.Create && 
          <VerifyTokenForm
            setModalView={setModalView}
            setFinishData={setFinishData}
          />
        }
        {
          modalView === LockFormView.Finish && 
          <FinishForm
            setModalView={setModalView}
            finishData={finishData}
            setFinishData={setFinishData}
          />
        }
      </StyledAppBody>
    </Page>
  )
}

export default Launchpad
