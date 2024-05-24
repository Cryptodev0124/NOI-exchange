import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | NOI exchange',
  defaultTitle: 'NOI exchange',
  description:
    'Cheaper and faster than Uniswap? Discover NOI exchange, the leading DEX on Ethereum with the best farms in DeFi.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@',
    site: '@',
  },
  openGraph: {
    title: 'NOI exchange - A next evolution DeFi exchange on Ethereum',
    description:
      'The most popular AMM on Ethereum! Earn MOI through yield farming, then stake it in Pools to earn more tokens!',
    images: [{ url: 'https://cyberglow.finance/logo.png' }],
  },
}
