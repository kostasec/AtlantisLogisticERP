// STYLED COMPONENT
import { useTheme } from '@mui/material/styles';
import { RootStyle } from './styles';
export default function LoaderWithLogo() {
  const theme = useTheme();
  const logoSrc = theme.palette.mode === 'dark' ? '/static/logo/logo-white.png' : '/static/logo/logo.png';
  return <RootStyle className="loading-wrapper">
      <div className="logo">
        <img src={logoSrc} alt="uko" />
      </div>

      <div className="loading-content"></div>
    </RootStyle>;
}