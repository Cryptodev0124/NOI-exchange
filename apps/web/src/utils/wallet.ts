// Set of helper functions to facilitate wallet setup

export const canRegisterToken = () =>
  typeof window !== 'undefined' &&
  // @ts-ignore
  !window?.ethereum?.isSafePal &&
  (window?.ethereum?.isMetaMask ||
    window?.ethereum?.isTrustWallet ||
    window?.ethereum?.isCoinbaseWallet ||
    window?.ethereum?.isTokenPocket)
