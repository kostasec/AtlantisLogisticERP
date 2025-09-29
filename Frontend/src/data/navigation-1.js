// CUSTOM ICON COMPONENT
import duotone from '@/icons/duotone'
import Car from '@/icons/Car';
import MoneyIcon from '@/icons/MoneyIcon';
import Email from '@/icons/Email';
import Menu from '@/icons/Menu';
export const navigations = [
  // {
  //   type: 'label',
  //   label: 'Dashboard'
  // }, {
  //   name: 'Analytics',
  //   icon: duotone.PersonChalkboard,
  //   children: [{
  //     name: 'Analytics 1',
  //     path: '/dashboard'
  //   }, {
  //     name: 'Analytics 2',
  //     path: '/dashboard/analytics-2'
  //   }]
  // }, {
  //   name: 'Finance',
  //   icon: duotone.MessagesDollar,
  //   children: [{
  //     name: 'Finance 1',
  //     path: '/dashboard/finance'
  //   }, {
  //     name: 'Finance 2',
  //     path: '/dashboard/finance-2'
  //   }]
  // }, {
  //   name: 'Logistics',
  //   path: '/dashboard/logistics',
  //   icon: duotone.DiagramProject
  // }, {
  //   name: 'Marketing',
  //   path: '/dashboard/marketing',
  //   icon: duotone.LayerGroup
  // }, {
  //   type: 'label',
  //   label: 'Management'
  // },{
  //   name: 'Account',
  //   icon: duotone.Accounts,
  //   path: '/dashboard/account'
  // },
   {
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
   /*{
    name: 'Data Table',
    icon: duotone.DataTable,
    children: [{
    name: 'Data Table 1',
    path: '/dashboard/data-table-1'
   }]
   },
   */{
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
    icon: duotone.Pricing
  },{
    name: 'Expenses',
    icon: Menu
  },{
    name: 'Inspections',
    icon: duotone.Calender
  }, {
    name: 'File Manager',
    icon: duotone.Folder,
    path: '/dashboard/file-manager'
  }
];