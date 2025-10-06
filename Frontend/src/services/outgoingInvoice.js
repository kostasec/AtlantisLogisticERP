import api from './api';
import { isMockEnabled, mockDelay } from '@/mocks/mockConfig';
import { mockOutgoingInvoices } from '@/mocks/data/outgoingInvoices';

export const outgoingInvoiceService = {

    // Dohvaćanje svih izlaznih faktura
    getAllOutgoingInvoices: async () => {
        if (isMockEnabled()) {
          await mockDelay();
          return { success: true, data: mockOutgoingInvoices };
        }
        try {
            const response = await api.get('/outInvoice/read');
            return response.data;
        } catch (error) {
            console.error('Error fetching Outgoing Invoices:', error);
            throw error;
        }
     }
};

export default outgoingInvoiceService;
