import api from './api';

export const employeeService = {
  // Dohvaćanje svih zaposlenika
  getAllEmployees: async () => {
    try {
      const response = await api.get('/employee/read');
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  // Kreiranje novog zaposlenika
  createEmployee: async (employeeData) => {
    try {
      const response = await api.post('/employee/insert', employeeData);
      return response.data;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  },

  // Ažuriranje zaposlenika
  updateEmployee: async (employeeId, employeeData) => {
    try {
      const response = await api.post(`/employee/update/${employeeId}`, employeeData);
      return response.data;
    } catch (error) {
      console.error('Error updating employee:', error);
      throw error;
    }
  },

  // Brisanje zaposlenika
  deleteEmployee: async (employeeId) => {
    try {
      const response = await api.post(`/employee/delete/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting employee:', error);
      throw error;
    }
  },

  // Dohvaćanje zaposlenika po ID-u
  getEmployeeById: async (employeeId) => {
    try {
      const response = await api.get(`/employee/update/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching employee:', error);
      throw error;
    }
  }
};

export default employeeService;