import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles'; // STYLED COMPONENT

import { GradientBox, RootStyle } from './styles';
export default function SplashScreen() {
  const theme = useTheme();
  const logoSrc = theme.palette.mode === 'dark' ? '/static/logo/logo-white.png' : '/static/logo/logo.png';
  return <RootStyle>
      <GradientBox>
        <Box p={2} zIndex={1} width={210} height={210} component={Card} borderRadius="100%" position="relative" boxSizing="border-box">
          <Box component="img" src={logoSrc} alt="uko" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </Box>
      </GradientBox>
    </RootStyle>;
}