import { Outlet, useLocation } from 'react-router'; // MUI

import useMediaQuery from '@mui/material/useMediaQuery';
// CUSTOM COMPONENTS

import DashboardHeader from './components/DashboardHeader';
import DashboardSidebar from './components/DashboardSidebar';
import LayoutBodyWrapper from './components/LayoutBodyWrapper';
import LayoutSetting from '@/layouts/layout-parts/LayoutSetting';
import Footer from '@/components/footer'; // DASHBOARD LAYOUT BASED CONTEXT PROVIDER

import LayoutProvider from './context/layoutContext';
export default function DashboardLayoutV1() {
  const location = useLocation();
  const downLg = useMediaQuery(theme => theme.breakpoints.down('lg'));
  return <LayoutProvider>
      {
      /*RENDER THE SIDEBAR */
    }
       <DashboardSidebar />

      <LayoutBodyWrapper>
        {
        /* DASHBOARD HEADER SECTION */
      }
        <DashboardHeader />

        {
        /* MAIN CONTENT RENDER SECTION */
      }
      <Outlet key={location.pathname} />

        {
        /* GLOBAL FOOTER */
      }
        <Footer />

        {
        /* LAYOUT SETTING SECTION */
      }
        
      </LayoutBodyWrapper>
    </LayoutProvider>;
}