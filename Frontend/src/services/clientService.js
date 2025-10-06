import api from './api';
import { isMockEnabled, mockDelay } from '@/mocks/mockConfig';
import { mockClients } from '@/mocks/data/clients';

export const clientService = {
  // Dohvaćanje svih klijenata
  getAllClients: async () => {
    if (isMockEnabled()) {
      await mockDelay();
      return { success: true, data: mockClients };
    }
    try {
      const response = await api.get('/client/read');
      return response.data;
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  },

  // Kreiranje novog klijenta
  createClient: async (clientData) => {
    if (isMockEnabled()) {
      await mockDelay();
      const newClient = {
        id: `cl_${Date.now()}`,
        clientName: clientData.clientName || 'New Client',
        taxId: clientData.taxId || 'N/A',
        regNmbr: clientData.regNmbr || '-',
        adress: clientData.adress || '-',
        email: clientData.email || 'no-email@example.com',
        contactPerson: clientData.contactPerson || null
      };
      mockClients.push(newClient);
      return { success: true, data: newClient };
    }
    try {
      const response = await api.post('/client/upsert', clientData);
      return response.data;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  },

  // Ažuriranje klijenta
  updateClient: async (clientData) => {
    if (isMockEnabled()) {
      await mockDelay();
      const idx = mockClients.findIndex(c => c.id === clientData.id);
      if (idx !== -1) {
        mockClients[idx] = { ...mockClients[idx], ...clientData };
        return { success: true, data: mockClients[idx] };
      }
      return { success: false, error: 'Client not found' };
    }
    try {
      const response = await api.post('/client/upsert', clientData);
      return response.data;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  },

  // Brisanje klijenta
  deleteClient: async (clientId) => {
    if (isMockEnabled()) {
      await mockDelay();
      const idx = mockClients.findIndex(c => c.id === clientId);
      if (idx !== -1) {
        const removed = mockClients.splice(idx, 1)[0];
        return { success: true, data: removed };
      }
      return { success: false, error: 'Client not found' };
    }
    try {
      const response = await api.post(`/client/delete/${clientId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }
};

export default clientService;