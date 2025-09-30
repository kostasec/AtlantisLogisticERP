import { nanoid } from 'nanoid';

const buildInvoice = ({
  sender,
  recipient,
  documentStatus,
  processingStatus,
  sendDate,
  deliveredDate,
  status,
  name,
  email
}) => ({
  id: nanoid(),
  invoiceId: `#${Math.floor(Math.random() * 900000 + 100000)}`,
  InvoiceNumber: `INV-${Math.floor(Math.random() * 900000 + 100000)}`,
  DocumentStatus: documentStatus,
  ProcessingStatus: processingStatus,
  Sender: sender,
  Recipient: recipient,
  SendDate: sendDate,
  DeliveredDate: deliveredDate,
  status,
  name,
  email
});

export const INCOMING_INVOICE_LIST = [
  buildInvoice({
    sender: 'Thomas Shelby',
    documentStatus: 'Sent',
    processingStatus: 'Accepted',
    sendDate: new Date(2024, 4, 11),
    deliveredDate: new Date(2024, 4, 13),
    status: 'Complete',
    name: 'Thomas Shelby',
    email: 'thomas@shelby.co'
  }),
  buildInvoice({
    sender: 'Ada Thorne',
    documentStatus: 'Sent',
    processingStatus: 'Pending',
    sendDate: new Date(2024, 5, 2),
    deliveredDate: null,
    status: 'Pending',
    name: 'Ada Thorne',
    email: 'ada.thorne@example.com'
  }),
  buildInvoice({
    sender: 'Finn Shelby',
    documentStatus: 'Delivered',
    processingStatus: 'Accepted',
    sendDate: new Date(2024, 3, 27),
    deliveredDate: new Date(2024, 3, 29),
    status: 'Complete',
    name: 'Finn Shelby',
    email: 'finn@shelby.co'
  })
];

export const OUTGOING_INVOICE_LIST = [
  buildInvoice({
    recipient: 'Grace Burgess',
    documentStatus: 'Sent',
    processingStatus: 'Pending',
    sendDate: new Date(2024, 4, 4),
    deliveredDate: null,
    status: 'Pending',
    name: 'Grace Burgess',
    email: 'grace.burgess@example.com'
  }),
  buildInvoice({
    recipient: 'Aberama Gold',
    documentStatus: 'Delivered',
    processingStatus: 'Accepted',
    sendDate: new Date(2024, 2, 14),
    deliveredDate: new Date(2024, 2, 17),
    status: 'Complete',
    name: 'Aberama Gold',
    email: 'aberama.gold@example.com'
  }),
  buildInvoice({
    recipient: 'Alfie Solomons',
    documentStatus: 'Delivered',
    processingStatus: 'Accepted',
    sendDate: new Date(2024, 6, 1),
    deliveredDate: new Date(2024, 6, 3),
    status: 'Complete',
    name: 'Alfie Solomons',
    email: 'alfie@candles.uk'
  })
];