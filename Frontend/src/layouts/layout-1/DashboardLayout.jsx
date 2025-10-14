import { Outlet, useLocation } from 'react-router'; // MUI

import useMediaQuery from '@mui/material/useMediaQuery';
// CUSTOM COMPONENTS

import DashboardHeader from './components/DashboardHeader';
import DashboardSidebar from './components/DashboardSidebar';
import LayoutBodyWrapper from './components/LayoutBodyWrapper';
import LayoutSetting from '@/layouts/layout-parts/LayoutSetting';
import Footer from '@/components/footer'; // DASHBOARD LAYOUT BASED CONTEXT PROVIDER

import LayoutProvider from './context/layoutContext';
import MobileSidebar from './components/MobileSidebar';
export default function DashboardLayoutV1() {
  const location = useLocation();
  const downLg = useMediaQuery(theme => theme.breakpoints.down('lg'));
  return (
    <LayoutProvider>
      {downLg ? <MobileSidebar /> : <DashboardSidebar />}
      <LayoutBodyWrapper>
        <DashboardHeader />
        <Outlet key={location.pathname} />
        <Footer />
        <LayoutSetting />
      </LayoutBodyWrapper>
    </LayoutProvider>
  );
}