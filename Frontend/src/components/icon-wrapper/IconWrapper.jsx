// STYLED COMPONENT
import { Wrapper } from './styles'; // ==============================================================

// ==============================================================
export default function IconWrapper({
  ref,
  children,
  ...props
}) {
  return <Wrapper ref={ref} {...props}>
      {children}
    </Wrapper>;
}