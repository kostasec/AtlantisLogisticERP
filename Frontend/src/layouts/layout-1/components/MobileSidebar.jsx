import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles'; // LAYOUT BASED HOOK

import useLayout from '@/layouts/layout-1/context/useLayout'; // CUSTOM COMPONENTS

import MultiLevelMenu from './MultiLevelMenu';
import Scrollbar from '@/components/scrollbar';
import UserAccount from '@/layouts/layout-parts/UserAccount';
import LayoutDrawer from '@/layouts/layout-parts/LayoutDrawer'; // STYLED COMPONENTS

const NavWrapper = styled('div')({
  height: '100%',
  paddingLeft: 16,
  paddingRight: 16
});
export default function MobileSidebar() {
  const theme = useTheme();
  const logoSrc = theme.palette.mode === 'dark' ? '/static/logo/logo-white.png' : '/static/logo/logo.png';
  const {
    showMobileSideBar,
    handleCloseMobileSidebar
  } = useLayout();
  return <LayoutDrawer open={showMobileSideBar} onClose={handleCloseMobileSidebar}>
      <Scrollbar autoHide clickOnTrack={false} sx={{
      overflowX: 'hidden',
      height: '100%'
    }}>
        <NavWrapper>
          <Box pl={1} pt={3} alt="logo" maxWidth={132} component="img" src={logoSrc} />

          {
          /* NAVIGATION ITEMS */
        }
          <MultiLevelMenu sidebarCompact={false} />

          {
          /* USER ACCOUNT INFORMATION */
        }
          
        </NavWrapper>
      </Scrollbar>
    </LayoutDrawer>;
}