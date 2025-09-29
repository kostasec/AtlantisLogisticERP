// CUSTOM ICON COMPONENT
import duotone from '@/icons/duotone';
export const navigation = [{
  name: 'Dashboards',
  Icon: duotone.PersonChalkboard,
  children: [{
    name: 'Finance 1',
    path: '/dashboard/finance'
  },{
    name: 'Logistics',
    path: '/dashboard/logistics'
  }]
},{
  name: 'Employees',
  Icon: duotone.UserList,
 path: '/dashboard/employee'
}, {
  name: 'Clients',
  Icon: duotone.UserList,
  path: '/dashboard/client'
},{
  name: 'Vehicles',
  Icon: duotone.Car,
  path: '/dashboard/vehicle'
}, {
  name: 'Invoices',
  Icon: duotone.Invoice,
  children: [{
    name: 'Incoming Invoices',
    path: '/dashboard/incoming-invoice'
  }, {
    name: 'Outgoing Invoice List',
    path : '/dashboard/outgoing-invoice'
  },{
    name: 'Invoice Details',
    path: '/dashboard/invoice-details'
  }, {
    name: 'Create Invoice',
    path: '/dashboard/create-invoice'
  }]
}, {
  name: 'Data Table',
  Icon: duotone.DataTable,
  children: [{
    name: 'Data Table 1',
    path: '/dashboard/data-table-1'
  }]
}];