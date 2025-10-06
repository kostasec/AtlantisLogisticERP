import api from './api';
import { isMockEnabled, mockDelay } from '@/mocks/mockConfig';
import { mockIncomingInvoices } from '@/mocks/data/incomingInvoices';

export const incomingInvoiceService = {
  // Dohvaćanje svih ulaznih faktura
  getAllIncomingInvoices: async () => {
    if (isMockEnabled()) {
      await mockDelay();
      return { success: true, data: mockIncomingInvoices };
    }
    try {
      const response = await api.get('/incInvoice/read');
      return response.data;
    } catch (error) {
      console.error('Error fetching incoming invoices:', error);
      throw error;
    }
  },

  // Dohvaćanje ulaznih faktura za prevoznike (carriers)
  getCarrierIncomingInvoices: async () => {
    if (isMockEnabled()) {
      await mockDelay();
      return { success: true, data: mockIncomingInvoices.filter(inv => inv.amount > 1000) };
    }
    try {
      const response = await api.get('/incInvoice/read/IncInvCarrier');
      return response.data;
    } catch (error) {
      console.error('Error fetching carrier incoming invoices:', error);
      throw error;
    }
  },

  // Dohvaćanje ulaznih faktura za ostale (others)
  getOtherIncomingInvoices: async () => {
    if (isMockEnabled()) {
      await mockDelay();
      return { success: true, data: mockIncomingInvoices.filter(inv => inv.amount <= 1000) };
    }
    try {
      const response = await api.get('/incInvoice/read/IncInvOther');
      return response.data;
    } catch (error) {
      console.error('Error fetching other incoming invoices:', error);
      throw error;
    }
  }
};

export default incomingInvoiceService;