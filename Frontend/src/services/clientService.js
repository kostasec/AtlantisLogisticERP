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
  }

  
};

export default clientService;