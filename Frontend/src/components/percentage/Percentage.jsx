// STYLED COMPONENT
import { StyledSpan } from './styles';
// ==============================================================
export default function Percentage({
  children,
  type = 'success'
}) {
  return <StyledSpan type={type}>{children}</StyledSpan>;
}