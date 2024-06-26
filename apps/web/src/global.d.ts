import type { WindowProvider } from 'wagmi/window'

export interface ExtendEthereum extends WindowProvider {
  isSafePal?: true
  isCoin98?: true
  isBlocto?: true
  isBloom?: true
  isMathWallet?: true
  isTrustWallet?: true
  isCoinbaseWallet?: true
  isTokenPocket?: true
  isMetaMask?: true
  isBinance?: true
  isOpera?: true
  isBraveWallet?: true
  isRabby?: true
  isOkxWallet?: true
}

declare global {
  interface Window {
    coin98?: true
    mercuryoWidget?: any
    ethereum?: ExtendEthereum
    BinanceChain?: {
      bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>
      switchNetwork?: (networkId: string) => Promise<string>
    } & Ethereum
  }
}

export {}
