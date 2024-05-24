import { ChainId, Currency } from '@pancakeswap/sdk'
import { BinanceIcon, TokenLogo } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import styled from 'styled-components'
import { useHttpLocations } from '@pancakeswap/hooks'
import { BAD_SRCS } from './constants'
import getTokenLogoURL from '../../utils/getTokenLogoURL'

const StyledLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency | null
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency?.isNative) return []

    if (currency?.isToken) {
      const tokenLogoURL = getTokenLogoURL(currency)

      if (currency instanceof WrappedTokenInfo) {
        if (!tokenLogoURL) return [...uriLocations]
        return [...uriLocations, tokenLogoURL]
      }
      if (!tokenLogoURL) return []
      return [tokenLogoURL]
    }
    return []
  }, [currency, uriLocations])

  if (currency?.isNative) {
    if (currency.chainId === ChainId.BSC) {
      return <BinanceIcon width={size} style={style} />
    }
    return (
      <StyledLogo
        badSrcs={BAD_SRCS}
        size={size}
        srcs={[`/images/chains/${currency.chainId}.png`]}
        width={size}
        style={style}
      />
    )
  }

  // wsmr on shimmer evm
  if (currency && currency.wrapped.address === "0x16bb40487386d83E042968FDDF2e72475eddF837" && currency.chainId === 148) {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/148/tokens/0x16bb40487386d83E042968FDDF2e72475eddF837.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  // smr on Ethereum
  if (currency && currency.wrapped.address === "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" && currency.chainId === 1) {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/1/tokens/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  // cgt on shimmer evm
  if (currency && currency.wrapped.address === "0xC33FEdB84EE8aD97141eF6647D305c9FFBdC7cd6" && currency.chainId === 148) {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/148/tokens/0xC33FEdB84EE8aD97141eF6647D305c9FFBdC7cd6.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  // usdc on Ethereum
  if (currency && currency.wrapped.address === "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" && currency.chainId === 1) {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/1/tokens/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  // usdt on Ethereum
  if (currency && currency.wrapped.address === "0xdAC17F958D2ee523a2206206994597C13D831ec7" && currency.chainId === 1) {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/1/tokens/0xdAC17F958D2ee523a2206206994597C13D831ec7.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  // wbtc on Ethereum
  if (currency && currency.wrapped.address === "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599" && currency.chainId === 1) {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/1/tokens/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  // eth on shimmer evm
  if (currency && currency.wrapped.address === "0x4638C9fb4eFFe36C49d8931BB713126063BF38f9" && currency.chainId === 148) {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/148/tokens/0x4638C9fb4eFFe36C49d8931BB713126063BF38f9.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  return (
    <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  )
}
