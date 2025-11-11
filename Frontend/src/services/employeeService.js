import api from './api';
import { isMockEnabled, mockDelay } from '@/mocks/mockConfig';
import { mockEmployees } from '@/mocks/data/employees';

export const employeeService = {
  // Dohvaćanje svih zaposlenika
  getAllEmployees: async () => {
    if (isMockEnabled()) {
      await mockDelay();
      return { success: true, data: mockEmployees };
    }
    try {
      const response = await api.get('/employee/read');
      return response.data;
    } catch (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
  },

  
  // Dohvaćanje zaposlenika po ID-u
  getEmployeeById: async (employeeId) => {
    if (isMockEnabled()) {
      await mockDelay();
      const emp = mockEmployees.find(e => e.id === employeeId);
      if (emp) return { success: true, data: emp };
      return { success: false, error: 'Employee not found' };
    }
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