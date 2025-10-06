// CUSTOM ICON COMPONENT
import duotone from '@/icons/duotone';
import sidebar from '@/icons/sidebar';
import Car from '@/icons/Car';
import MoneyIcon from '@/icons/MoneyIcon';
import Email from '@/icons/Email';
import Menu from '@/icons/Menu';
export const navigations = [
 {
     type: 'label',
     label: 'Dashboard'
   },{
      name: 'Dates',
      path: '/dashboard/finance',
      icon: duotone.Calender
   },/*{
      name: 'Statistics',
      path: '/dashboard/logistics',
      icon: duotone.Dashboard
   },*/
   {
      type: 'label',
      label: 'Management'
   },{
     name: 'Invoices',
     icon: duotone.Invoice,
     children: [{
     name: 'Incoming Invoices',
     path: '/dashboard/incoming-invoice'
   }, {
    name: 'Outgoing Invoices',
    path : '/dashboard/outgoing-invoice'
   }, {
    name: 'Create Invoice',
    path: '/dashboard/create-invoice'
     }]
   }, 
   {
    name: 'Clients',
    icon: duotone.UserList,
    path: '/dashboard/client'
  },{
    name: 'Employees',
    icon: duotone.UserList,
    path: '/dashboard/employee'
  },{
    name: 'Vehicles',
    icon: Car,
    path: '/dashboard/vehicle'
  },{
    name: 'Withdrawal',
    icon: duotone.Pricing,
    path: '/dashboard/withdrawal'
  },{
    name: 'Expenses',
    icon: Menu,
    path: '/dashboard/expenses'
  },{
    name: 'Inspections',
    icon: duotone.DataTable,
    path: '/dashboard/inspections'
  }, {
    name: 'File Manager',
    icon: duotone.Folder,
    path: '/dashboard/file-manager'
  }
];