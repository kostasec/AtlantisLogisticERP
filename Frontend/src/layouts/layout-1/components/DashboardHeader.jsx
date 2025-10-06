import { Fragment, use } from 'react';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, alpha } from '@mui/material/styles';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

import { SettingsContext } from '@/contexts/settingsContext';
import ThemeIcon from '@/icons/ThemeIcon';
import LanguagePopover from '@/layouts/layout-parts/popovers/LanguagePopover';
import { DashboardHeaderRoot, StyledToolBar } from '@/layouts/layout-1/styles';
import useAuth from '@/hooks/useAuth';

const SignOutButton = styled(Button)(({ theme }) => ({
  minWidth: 36,
  width: 36,
  height: 36,
  padding: 0,
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.mode === 'dark'
    ? alpha(theme.palette.error.light, 0.18)
    : alpha(theme.palette.error.main, 0.16),
  border: `1px solid ${theme.palette.mode === 'dark' ? alpha(theme.palette.error.light, 0.3) : alpha(theme.palette.error.main, 0.35)}`,
  color: theme.palette.mode === 'dark' ? theme.palette.error.light : theme.palette.error.main,
  transition: 'background 150ms ease, transform 150ms ease',
  '&:hover': {
    background: theme.palette.mode === 'dark'
      ? alpha(theme.palette.error.light, 0.28)
      : alpha(theme.palette.error.main, 0.24),
    transform: 'translateY(-1px)'
  }
}));

export default function DashboardHeader() {
  const { logout } = useAuth();
  const { settings, saveSettings } = use(SettingsContext);
  const upSm = useMediaQuery(theme => theme.breakpoints.up('sm'));

  const handleChangeTheme = value => {
    saveSettings({
      ...settings,
      theme: value
    });
  };

  const handleLogout = () => {
    console.log('Logout button clicked');
    logout();
  };

  return (
    <DashboardHeaderRoot position="sticky">
      <StyledToolBar sx={{ justifyContent: 'flex-end' }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <IconButton onClick={() => handleChangeTheme(settings.theme === 'light' ? 'dark' : 'light')}>
            <ThemeIcon />
          </IconButton> 
          <LanguagePopover />
          <SignOutButton onClick={handleLogout} disableElevation>
            <PowerSettingsNewIcon fontSize="small" />
          </SignOutButton>
        </Stack>
      </StyledToolBar>
    </DashboardHeaderRoot>
  );
}