import { TranslateFunction } from '@pancakeswap/localization'
import { SalesSectionProps } from '.'
import TradeImg from '../../../../../public/images/home/cyberglow.png'

export const swapSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Exchange anything, no signup, no fuss.'),
  bodyText: t('Swap any token on the Arbitrum BlockChain instantly, simply by linking your wallet.'),
  reverse: false,
  primaryButton: {
    to: '/swap',
    text: t('Trade Now'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.cyberglow.finance',
    text: t('Learn'),
    external: true,
  },
  images: {
    path: '/images/home/trade/',
    attributes: [
    ],
  },
  background: TradeImg
})

export const earnSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('Earn passive income with crypto.'),
  bodyText: t('CyberGlow makes it easy to make your crypto work for you.'),
  reverse: true,
  primaryButton: {
    to: '/farms',
    text: t('Explore'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.cyberglow.finance/cyberglow-dex/yield-farming',
    text: t('Learn'),
    external: true,
  },
  images: {
    path: '/images/home/earn/',
    attributes: [
    ],
  },
  background: TradeImg
})

export const cakeSectionData = (t: TranslateFunction): SalesSectionProps => ({
  headingText: t('CyberGlow makes our world go round.'),
  bodyText: t(
    'CGT token is at the heart of the CyberGlow ecosystem. Buy it, farm it, spend it, stake it... heck, you can even vote with it!',
  ),
  reverse: false,
  primaryButton: {
    to: '/swap?outputCurrency=0xC33FEdB84EE8aD97141eF6647D305c9FFBdC7cd6',
    text: t('Buy CGT'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.cyberglow.finance/tokenomics/cgt-token',
    text: t('Learn'),
    external: true,
  },

  images: {
    path: '/images/home/cake/',
    attributes: [
    ],
  },
  background: TradeImg,
})
