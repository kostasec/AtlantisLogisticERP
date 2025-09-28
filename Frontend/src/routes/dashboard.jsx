import { lazy, Suspense } from 'react';
import LayoutV1 from '@/layouts/layout-1';
import LayoutV2 from '@/layouts/layout-2';
import useSettings from '@/hooks/useSettings';
import { AuthGuard } from '@/components/auth';
import { LoadingProgress } from '@/components/loader'; // ALL DASHBOARD PAGES

const CRM = lazy(() => import('@/pages/dashboard/crm'));
const CRMV2 = lazy(() => import('@/pages/dashboard/crm-2'));
const Sales = lazy(() => import('@/pages/dashboard/sales'));
const SalesV2 = lazy(() => import('@/pages/dashboard/sales-2'));
const Finance = lazy(() => import('@/pages/dashboard/finance'));
const FinanceV2 = lazy(() => import('@/pages/dashboard/finance-2'));
const Analytics = lazy(() => import('@/pages/dashboard/analytics'));
const AnalyticsV2 = lazy(() => import('@/pages/dashboard/analytics-2'));
const Ecommerce = lazy(() => import('@/pages/dashboard/ecommerce'));
const Logistics = lazy(() => import('@/pages/dashboard/logistics'));
const Marketing = lazy(() => import('@/pages/dashboard/marketing'));
const LMS = lazy(() => import('@/pages/dashboard/learning-management'));
const JobManagement = lazy(() => import('@/pages/dashboard/job-management')); // USER LIST PAGES

const AddNewUser = lazy(() => import('@/pages/users/add-new-user'));
const UserListView = lazy(() => import('@/pages/users/user-list-1'));
const UserGridView = lazy(() => import('@/pages/users/user-grid-1'));
const UserListView2 = lazy(() => import('@/pages/users/user-list-2'));
const UserGridView2 = lazy(() => import('@/pages/users/user-grid-2')); // USER ACCOUNT PAGE

const EmployeeView= lazy(() => import('@/pages/cev/employee'));
const ClientView= lazy(() => import('@/pages/cev/client'));
const VehicleView= lazy(() => import('@/pages/cev/vehicle'));

const Account = lazy(() => import('@/pages/account')); // ALL INVOICE RELATED PAGES

const IncomingInvoice = lazy(() => import('@/pages/invoice/incoming-invoice'));
const OutgoingInvoice = lazy(() => import('@/pages/invoice/outgoing-invoice'));
const InvoiceCreate = lazy(() => import('@/pages/invoice/create'));
const InvoiceDetails = lazy(() => import('@/pages/invoice/details')); // PRODUCT RELATED PAGES



const Profile = lazy(() => import('@/pages/profile')); // REACT DATA TABLE PAGE

const DataTable1 = lazy(() => import('@/pages/data-tables/table-1')); // OTHER BUSINESS RELATED PAGES

const FileManager = lazy(() => import('@/pages/file-manager')); // SUPPORT RELATED PAGES


const Chat = lazy(() => import('@/pages/chat')); // USER TODO LIST PAGE

const TodoList = lazy(() => import('@/pages/todo-list')); // MAIL RELATED PAGES

const Sent = lazy(() => import('@/pages/email/sent'));
const AllMail = lazy(() => import('@/pages/email/all'));
const Inbox = lazy(() => import('@/pages/email/inbox'));
const Compose = lazy(() => import('@/pages/email/compose'));
const MailDetails = lazy(() => import('@/pages/email/details')); //  PROJECT PAGES



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
    element: <Analytics />
  }, {
    path: 'crm',
    element: <CRM />
  }, {
    path: 'crm-2',
    element: <CRMV2 />
  }, {
    path: 'sales',
    element: <Sales />
  }, {
    path: 'sales-2',
    element: <SalesV2 />
  }, {
    path: 'finance',
    element: <Finance />
  }, {
    path: 'finance-2',
    element: <FinanceV2 />
  }, {
    path: 'ecommerce',
    element: <Ecommerce />
  }, {
    path: 'logistics',
    element: <Logistics />
  }, {
    path: 'marketing',
    element: <Marketing />
  }, {
    path: 'analytics-2',
    element: <AnalyticsV2 />
  }, {
    path: 'learning-management',
    element: <LMS />
  }, {
    path: 'job-management',
    element: <JobManagement />
  }, {
    path: 'add-user',
    element: <AddNewUser />
  }, {
    path: 'user-list',
    element: <UserListView />
  }, {
    path: 'user-grid',
    element: <UserGridView />
  }, {
    path: 'user-list-2',
    element: <UserListView2 />
  }, {
    path: 'user-grid-2',
    element: <UserGridView2 />
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
    path: 'account',
    element: <Account />
  }, {
    path: 'incoming-invoice',
    element: <IncomingInvoice />
  }, {
    path: 'outgoing-invoice',
    element: <OutgoingInvoice />
  }, {
    path: 'create-invoice',
    element: <InvoiceCreate />
  }, {
    path: 'invoice-details',
    element: <InvoiceDetails />
  },{
    path: 'profile',
    element: <Profile />
  }, {
    path: 'data-table-1',
    element: <DataTable1 />
  }, {
    path: 'file-manager',
    element: <FileManager />
  },{
    path: 'todo-list',
    element: <TodoList />
  }]
}];