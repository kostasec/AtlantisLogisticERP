import { Fragment, use, useState } from 'react'; // MUI

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import ClickAwayListener from '@mui/material/ClickAwayListener';
// SITE SETTINGS CONTEXT FILE
import { SettingsContext } from '@/contexts/settingsContext'; // CUSTOM ICON COMPONENTS

import Menu from '@/icons/Menu';
import MenuLeft from '@/icons/MenuLeft';
import ThemeIcon from '@/icons/ThemeIcon';
import Search from '@/icons/duotone/Search';
import MenuLeftRight from '@/icons/MenuLeftRight'; // LAYOUT BASED HOOK

import useLayout from '@/layouts/layout-1/context/useLayout'; // CUSTOM COMPONENTS

import SearchBar from '@/layouts/layout-parts/SearchBar';
import ProfilePopover from '@/layouts/layout-parts/popovers/ProfilePopover';
import ServicePopover from '@/layouts/layout-parts/popovers/ServicePopover';
import LanguagePopover from '@/layouts/layout-parts/popovers/LanguagePopover';
import NotificationsPopover from '@/layouts/layout-parts/popovers/NotificationsPopover'; // STYLED COMPONENTS

import { DashboardHeaderRoot, StyledToolBar } from '@/layouts/layout-1/styles';
export default function DashboardHeader() {
  const {
    handleOpenMobileSidebar
  } = useLayout();
  const [openSearchBar, setSearchBar] = useState(false);
  const {
    settings,
    saveSettings
  } = use(SettingsContext);
  const upSm = useMediaQuery(theme => theme.breakpoints.up('sm'));
  const downMd = useMediaQuery(theme => theme.breakpoints.down(1200));

  const handleChangeDirection = value => {
    saveSettings({ ...settings,
      direction: value
    });
  };

  const handleChangeTheme = value => {
    saveSettings({ ...settings,
      theme: value
    });
  };

  return <DashboardHeaderRoot position="sticky">
      <StyledToolBar sx={{ justifyContent: 'flex-end' }}>
        {
        /* THEME SWITCH BUTTON */
      }
        <IconButton onClick={() => handleChangeTheme(settings.theme === 'light' ? 'dark' : 'light')}>
          <ThemeIcon />
        </IconButton>

        {upSm && <Fragment>
            <LanguagePopover />
            
          </Fragment>}

        
      </StyledToolBar>
    </DashboardHeaderRoot>;
}