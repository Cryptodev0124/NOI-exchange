import styled from 'styled-components'
import { Box, PageSection } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import useTheme from 'hooks/useTheme'
import Container from 'components/Layout/Container'
import { useTranslation } from '@pancakeswap/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ChainId } from '@pancakeswap/sdk'
import Hero from './components/Hero'
import { swapSectionData, earnSectionData, cakeSectionData } from './components/SalesSection/data'
import MetricsSection from './components/MetricsSection'
import SalesSection from './components/SalesSection'
import Footer from './components/Footer'
import { WedgeTopLeft, InnerWedgeWrapper, OuterWedgeWrapper, WedgeTopRight } from './components/WedgeSvgs'

const StyledHeroSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }

  background: radial-gradient(50.36% 50.36% at 50% 45%, #00D0FF 0%, rgba(10, 178, 232, 0.86) 10%, rgba(29, 126, 193, 0.6) 29%, rgba(45, 82, 159, 0.39) 47%, rgba(57, 48, 133, 0.22) 63%, rgba(66, 24, 115, 0.1) 78%, rgba(72, 9, 104, 0.03) 91%, rgba(74, 4, 100, 0) 100%);
`

const StyleAtomBox1 = styled(Box)`
  position: absolute;
  left: 0%;
  right: 0%;
  top: -11.65%;
  bottom: 28%;
  background: radial-gradient(50% 50% at 50% 50%, #00FFEE 0%, rgba(7, 219, 218, 0.86) 10%, rgba(21, 154, 182, 0.6) 29%, rgba(33, 100, 153, 0.39) 47%, rgba(42, 58, 130, 0.22) 63%, rgba(49, 28, 113, 0.1) 78%, rgba(53, 10, 103, 0.03) 91%, rgba(55, 4, 100, 0) 100%);
  background-blend-mode: screen;
  mix-blend-mode: screen;
  opacity: 0.5;
`;

const StyleAtomBox2 = styled(Box)`
  position: absolute;
  left: -12.18%;
  right: 73.8%;
  top: 15.21%;
  bottom: 20.24%;

  background: radial-gradient(35.36% 35.36% at 50% 50%, #00D0FF 0%, rgba(10, 178, 232, 0.86) 10%, rgba(29, 126, 193, 0.6) 29%, rgba(45, 82, 159, 0.39) 47%, rgba(57, 48, 133, 0.22) 63%, rgba(66, 24, 115, 0.1) 78%, rgba(72, 9, 104, 0.03) 91%, rgba(74, 4, 100, 0) 100%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  background-blend-mode: screen;
  mix-blend-mode: screen;
  opacity: 0.5;
  transform: rotate(-45deg);
`;

const UserBannerWrapper = styled(Container)`
  z-index: 1;
  position: absolute;
  width: 100%;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  padding-left: 0px;
  padding-right: 0px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-left: 24px;
    padding-right: 24px;
  }
`

const Home: React.FC<React.PropsWithChildren> = () => {
  const { theme } = useTheme()
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  const { t } = useTranslation()

  return (
    <>
      <style jsx global>
        {`
          #home-1 .page-bg {
            // background: white;
          }
          [data-theme='dark'] #home-1 .page-bg {
            // background: radial-gradient(103.12% 50% at 50% 50%, #21193a 0%, #191326 100%);
            // background: #101124;
          }
          #home-2 .page-bg {
            // background: white;
          }
          [data-theme='dark'] #home-2 .page-bg {
            // background: linear-gradient(180deg, #09070c 22%, #201335 100%);
            // background: #101124;
          }
          #home-3 .page-bg {
            // background: white;
          }
          [data-theme='dark'] #home-3 .page-bg {
            // background: linear-gradient(180deg, #0b4576 0%, #091115 100%);
            // background: #101124;
          }
          #home-4 .inner-wedge svg {
            // fill: #d8cbed;
          }
          [data-theme='dark'] #home-4 .inner-wedge svg {
            // fill: #101124;
          }
        `}
      </style>
      <Box
        background='#001026'
      >
        <StyledHeroSection
          innerProps={{ style: { margin: '0', width: '100%' } }}
          containerProps={{
            id: 'home-1',
          }}
          index={2}
          hasCurvedDivider={false}
          // background={theme.colors.backgroundAlt}
        >
          {/* {account && chainId === ChainId.ETHEREUM && (
            <UserBannerWrapper>
              <UserBanner />
            </UserBannerWrapper>
          )}`` */}
          {/* <MultipleBanner /> */}
          <Hero />
        </StyledHeroSection>
      </Box>
      <Box
        background='linear-gradient(180deg, #001026 0%, #08030b 100%)'
      >
        <PageSection
          innerProps={{ style: { margin: '0', width: '100%' } }}
          containerProps={{
            id: 'home-2',
          }}
          index={2}
          hasCurvedDivider={false}
        >
          <MetricsSection />
          <StyleAtomBox1 />
          {/* <StyleAtomBox2 /> */}
        </PageSection>
        {/* <PageSection
          innerProps={{ style: HomeSectionContainerStyles }}
          containerProps={{
            id: 'home-4',
          }}
          index={2}
          hasCurvedDivider={false}
        >
          <SalesSection {...swapSectionData(t)} />
        </PageSection>
        <PageSection
          innerProps={{ style: HomeSectionContainerStyles }}
          containerProps={{
            id: 'home-2',
          }}
          index={2}
          hasCurvedDivider={false}
        >
          <SalesSection {...earnSectionData(t)} />
        </PageSection> */}
        {/* <PageSection
          innerProps={{ style: HomeSectionContainerStyles }}
          containerProps={{
            id: 'home-3',
          }}
          index={2}
          hasCurvedDivider={false}
        >
          <WinSection />
        </PageSection> */}
        <PageSection
          innerProps={{ style: HomeSectionContainerStyles }}
          // background={theme.colors.background}
          index={2}
          containerProps={{
            id: 'home-2',
          }}
          hasCurvedDivider={false}
        >
          <SalesSection {...cakeSectionData(t)} />
          {/* <CakeDataRow /> */}
        </PageSection>
        <PageSection
          innerProps={{ style: HomeSectionContainerStyles }}
          // background="linear-gradient(180deg, #7645D9 0%, #5121B1 100%)"
          index={2}
          containerProps={{
            id: 'home-2',
          }}
          hasCurvedDivider={false}
        >
          <Footer />
        </PageSection>
      </Box>
    </>
  )
}

export default Home
