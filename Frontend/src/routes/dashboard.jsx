import { lazy, Suspense } from 'react';
import LayoutV1 from '@/layouts/layout-1';
import LayoutV2 from '@/layouts/layout-2';
import useSettings from '@/hooks/useSettings';
import { AuthGuard } from '@/components/auth';
import { LoadingProgress } from '@/components/loader'; 

// ALL DASHBOARD PAGES
const Finance = lazy(() => import('@/pages/dashboard/finance'));
const Logistics = lazy(() => import('@/pages/dashboard/logistics'));


//CEV PAGES
const ClientView= lazy(() => import('@/pages/cev/client'));
const EmployeeView= lazy(() => import('@/pages/cev/employee'));
const VehicleView= lazy(() => import('@/pages/cev/vehicle'));


 // ALL INVOICE RELATED PAGES
const IncomingInvoice = lazy(() => import('@/pages/invoice/incoming-invoice'));
const OutgoingInvoice = lazy(() => import('@/pages/invoice/outgoing-invoice'));
const InvoiceCreate = lazy(() => import('@/pages/invoice/create'));


//DATA TABLE PAGE
const DataTable1 = lazy(() => import('@/pages/data-tables/table-1'));

//FILE MANAGER
const FileManager = lazy(() => import('@/pages/file-manager'));


const ActiveLayout = () => {
  const {
    settings
  } = useSettings();
  return <AuthGuard>
      <Suspense fallback={<LoadingProgress />}>
        {settings.activeLayout === 'layout2' ? <LayoutV2 /> : <LayoutV1 />}
      </Suspense>
    </AuthGuard>;
};

export const DashboardRoutes = [{
  path: 'dashboard',
  element: <ActiveLayout />,
  children: [{
    index: true,
    element: <Finance />
  }, {
    path: 'finance',
    element: <Finance />
  }, {
    path: 'logistics',
    element: <Logistics />
  },{
    path: 'employee',
    element: <EmployeeView />
  } ,{
    path: 'client',
    element: <ClientView />
  },{
    path: 'vehicle',
    element: <VehicleView />
  },{
    path: 'incoming-invoice',
    element: <IncomingInvoice />
  }, {
    path: 'outgoing-invoice',
    element: <OutgoingInvoice />
  }, {
    path: 'create-invoice',
    element: <InvoiceCreate />
  },{
    path: 'data-table-1',
    element: <DataTable1 />
  }, {
    path: 'file-manager',
    element: <FileManager />
  }]
}];