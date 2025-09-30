import api from './api';

export const clientService = {
  // Dohvaćanje svih klijenata
  getAllClients: async () => {
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