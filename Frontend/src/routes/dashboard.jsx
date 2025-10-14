import { lazy, Suspense } from 'react';
import LayoutV1 from '@/layouts/layout-1';
import useSettings from '@/hooks/useSettings';
import { LoadingProgress } from '@/components/loader'; 

// ALL DASHBOARD PAGES
const Finance = lazy(() => import('@/pages/dashboard/finance'));
const Logistics = lazy(() => import('@/pages/dashboard/logistics'));


//CEV PAGES
const ClientView= lazy(() => import('@/pages/cev/client/list-client'));
const AddClientView = lazy(() => import('@/pages/cev/client/add-client'));
const EmployeeView= lazy(() => import('@/pages/cev/employee/list-employee'));
const AddEmployeeView= lazy(() =>import('@/pages/cev/employee/add-employee'))
const VehicleView = lazy(() => import('@/pages/cev/vehicle/list-vehicle'));
const AddVehicleView = lazy(() => import('@/pages/cev/vehicle/add-vehicle'));

//EXPENSES
const ExpensesView= lazy(()=> import('@/page-sections/expenses/Expenses'))


 // ALL INVOICE RELATED PAGES
const IncomingInvoice = lazy(() => import('@/pages/invoice/incoming-invoice'));
const OutgoingInvoice = lazy(() => import('@/pages/invoice/outgoing-invoice'));
const InvoiceCreate = lazy(() => import('@/pages/invoice/create'));




const ActiveLayout = () => {
  const {
    settings
  } = useSettings();
  return (
    <Suspense fallback={<LoadingProgress />}>
      <LayoutV1 />
    </Suspense>
  );
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
    path: 'add-employee',
    element: <AddEmployeeView />
  },{
    path: 'employee',
    element: <EmployeeView />
  },{
    path: 'client',
    element: <ClientView />
  },{
    path: 'add-client',
    element: <AddClientView />
  },{
    path: 'vehicle',
    element: <VehicleView />
  },{
    path: 'add-vehicle',
    element: <AddVehicleView />
  },{
    path: 'withdrawal',
    element: <></>
  },{
    path: 'expenses',
    element: <ExpensesView />
  },{
    path: 'inspections',
    element: <></>
  },{
    path: 'incoming-invoice',
    element: <IncomingInvoice />
  }, {
    path: 'outgoing-invoice',
    element: <OutgoingInvoice />
  }, {
    path: 'create-invoice',
    element: <InvoiceCreate />
  }]
}];