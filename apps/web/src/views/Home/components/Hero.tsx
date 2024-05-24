import { Box, Button, Flex, Heading, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import Image from 'next/legacy/image'
import { ChainId } from '@pancakeswap/sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import styled, { keyframes } from 'styled-components'
import CompositeImage, { CompositeImageProps } from './CompositeImage'

const flyingAnim = () => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(0, 10px);
  }
  to {
    transform: translate(0, 0px);
  }
`

const fading = () => keyframes`
  from {
    opacity: 0.9;
  }
  50% {
    opacity: 0.1;
  }
  to {
    opacity: 0.9;
  }
`

const BgWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0px;
  left: 0px;
`

const InnerWrapper = styled.div`
  position: absolute;
  width: 100%;
  bottom: -3px;
`

const BunnyWrapper = styled(Flex)`
  justify-content: center;
  width: 100%;
  animation: ${flyingAnim} 2s ease-in-out infinite;
  will-change: transform;
  > span {
    overflow: visible !important; // make sure the next-image pre-build blur image not be cropped
  }
`

const StarsWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;

  & :nth-child(2) {
    animation: ${fading} 2s ease-in-out infinite;
    animation-delay: 1s;
  }

  & :nth-child(3) {
    animation: ${fading} 5s ease-in-out infinite;
    animation-delay: 0.66s;
  }

  & :nth-child(4) {
    animation: ${fading} 2.5s ease-in-out infinite;
    animation-delay: 0.33s;
  }
`

const starsImage: CompositeImageProps = {
  path: '/images/home/lunar-bunny/',
  attributes: [
    { src: 'star-l', alt: '3D Star' },
    { src: 'star-r', alt: '3D Star' },
    { src: 'star-top-r', alt: '3D Star' },
  ],
}

const Hero = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  return (
    <>
      <style jsx global>
        {`
          .slide-svg-dark {
            display: none;
          }
          .slide-svg-light {
            display: block;
          }
          [data-theme='dark'] .slide-svg-dark {
            display: block;
          }
          [data-theme='dark'] .slide-svg-light {
            display: none;
          }
        `}
      </style>
      <Flex
        position="relative"
        flexDirection={['column-reverse', null, null, 'row']}
        alignItems={['center', null, null, 'center']}
        justifyContent="center"
        mt={[account && chainId === ChainId.BSC ? '280px' : '50px', null, 0]}
        id="homepage-hero"
      >
        <Flex flex="1" flexDirection="column" mt="100px">
          {/* <Heading scale="xxl" color="spec" mb="24px">
            {t('CyberGlow')}
          </Heading> */}
          <Flex justifyContent="center" mb="10px">
            <Box maxWidth="600px">
              <img src='/images/logo.png' alt='cyberglow' />
            </Box>
          </Flex>
          <BunnyWrapper>
            <img src='/images/home/ellipse2.svg' alt='cyberglow' width="300px" />
          </BunnyWrapper> 
          <Heading scale="md" my="20px" color="success" textAlign="center" >
            {t('Trade & Farm & Earn on CyberGlow.')}
          </Heading>
          <Heading scale="md" mb="30px" color="success" textAlign="center" >
            {t('Create your own tokens and token sales in few seconds.')}
          </Heading>
          <Flex justifyContent="center" my="30px">
            <NextLinkFromReactRouter to="/swap">
              <Button variant={!account ? 'secondary' : 'primary'} width="150px" mr="8px">{t('Trade')}</Button>
            </NextLinkFromReactRouter>
            <NextLinkFromReactRouter to="/farms">
              <Button variant={!account ? 'secondary' : 'primary'} width="150px">{t('Earn')}</Button>
            </NextLinkFromReactRouter>
          </Flex>
        </Flex>
        {/* <Flex
          height={['192px', null, null, '100%']}
          width={['192px', null, null, '100%']}
          flex={[null, null, null, '1']}
          mb={['24px', null, null, '0']}
          position="relative"
        >
          <BunnyWrapper>
            <Image src={bunnyImage} priority placeholder="blur" alt={t('Lunar bunny')} />
          </BunnyWrapper>
          <StarsWrapper>
            <CompositeImage {...starsImage} />
          </StarsWrapper>
        </Flex> */}
      </Flex>
    </>
  )
}

export default Hero
