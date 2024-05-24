import styled from "styled-components";
import Button from "../../../components/Button/Button";

const MenuButton = styled(Button)`
  color: ${({ theme }) => theme.colors.text};
  padding: 0 8px;
  background: #2e2e2e; 
  border-radius: 8px;

`;
MenuButton.defaultProps = {
  variant: "text",
  size: "sm",
};

export default MenuButton;
