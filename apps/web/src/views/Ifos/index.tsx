import IfoProvider from './contexts/IfoContext'

export const IfoPageLayout = ({ children }) => {
  return (
    <IfoProvider>
      {children}
    </IfoProvider>
  )
}
