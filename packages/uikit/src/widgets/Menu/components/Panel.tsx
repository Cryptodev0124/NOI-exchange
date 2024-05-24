import React from "react";
import styled from "styled-components";
import PanelBody from "./PanelBody";
import PanelFooter from "./PanelFooter";
import { SIDEBAR_WIDTH_REDUCED, SIDEBAR_WIDTH_FULL } from "../config";
import { PanelProps, PushedProps } from "../types";

interface Props extends PanelProps, PushedProps {
  showMenu: boolean;
  isMobile: boolean;
}

const StyledPanel = styled.div<{ isPushed: boolean; showMenu: boolean }>`
  position: fixed;
  // padding-top: ${({ showMenu }) => (showMenu ? "80px" : 0)};
  top: ${({ showMenu }) => (showMenu ? "85px" : "25px")};
  left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  padding-top: 10px;
  background-color: transparent;
  // background-color: ${({ theme }) => theme.colors.backgroundAlt};
  // box-shadow: ${({ theme }) => theme.shadows.var};
  // border-radius: 12px;
  width: ${({ isPushed }) => (isPushed ? `${SIDEBAR_WIDTH_FULL}px` : 0)};
  height: ${({ showMenu }) => (showMenu ? `calc(100vh - 110px)` : `calc(100vh - 50px)`)};
  transition: padding-top 0.2s, width 0.2s;
  // border-right: ${({ isPushed }) => (isPushed ? "2px solid rgba(133, 133, 133, 0.1)" : 0)};
  z-index: 11;
  overflow: ${({ isPushed }) => (isPushed ? "initial" : "hidden")};
  transform: translate3d(0, 0, 0);

  ${({ theme }) => theme.mediaQueries.lg} {
    // border-right: 2px solid rgba(133, 133, 133, 0.1);
    width: ${({ isPushed }) => `${isPushed ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_REDUCED}px`};
  }
`;

const Panel: React.FC<Props> = (props) => {
  const { isPushed, showMenu, pushNav } = props;
  return (
    <StyledPanel isPushed={isPushed} showMenu={showMenu} onClick={() => pushNav(true)}>
      <PanelBody {...props} />
      {/* <PanelFooter {...props} /> */}
    </StyledPanel>
  );
};

export default Panel;
