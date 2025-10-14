import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import useLayout from '@/layouts/layout-1/context/useLayout';
import MultiLevelMenu from './MultiLevelMenu';
import Scrollbar from '@/components/scrollbar';
import UserAccount from '@/layouts/layout-parts/UserAccount';
import LayoutDrawer from '@/layouts/layout-parts/LayoutDrawer';

const NavWrapper = styled('div')({
  height: '100%',
  paddingLeft: 16,
  paddingRight: 16
});
export default function MobileSidebar() {
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
          <Box pl={1} pt={3} alt="logo" maxWidth={45} component="img" src="/static/logo/logo-svg.svg" />
          <MultiLevelMenu sidebarCompact={false} />
          <UserAccount />
        </NavWrapper>
      </Scrollbar>
    </LayoutDrawer>;
}
