export const mockOutgoingInvoices = [
  {
    id: 'out_001',
    sender: 'Atlantis IS',
    recipient: 'Balkan Cargo',
    invoiceNumber: 'OUT-2025-101',
    sendDate: '2025-10-02',
    dueDate: '2025-10-20',
    amount: 2220.00,
    documentStatus: 'Pending',
    processingStatus: 'Pending',
    paymentStatus: 'UNPAID',
    sentDate : '2025-10-02',
    deliveredDate : '2025-10-02'
  },
  {
    id: 'out_002',
    sender: 'Atlantis IS',
    recipient: 'TransLogix DOO',
    invoiceNumber: 'OUT-2025-102',
    sendDate: '2025-10-01',
    dueDate: '2025-10-18',
    amount: 1500.75,
    documentStatus: 'Sent',
    processingStatus: 'Accepted',
    sentDate : '2025-10-01',
    deliveredDate : '2025-10-02',
    paymentStatus: 'PAID'
  }
];
