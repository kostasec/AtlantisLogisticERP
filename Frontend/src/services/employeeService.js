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

  // Kreiranje novog zaposlenika
  createEmployee: async (employeeData) => {
    if (isMockEnabled()) {
      await mockDelay();
      const newEmp = { id: `emp_${Date.now()}`, ...employeeData };
      mockEmployees.push(newEmp);
      return { success: true, data: newEmp };
    }
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
    if (isMockEnabled()) {
      await mockDelay();
      const idx = mockEmployees.findIndex(e => e.id === employeeId);
      if (idx !== -1) {
        mockEmployees[idx] = { ...mockEmployees[idx], ...employeeData };
        return { success: true, data: mockEmployees[idx] };
      }
      return { success: false, error: 'Employee not found' };
    }
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
    if (isMockEnabled()) {
      await mockDelay();
      const idx = mockEmployees.findIndex(e => e.id === employeeId);
      if (idx !== -1) {
        const removed = mockEmployees.splice(idx, 1)[0];
        return { success: true, data: removed };
      }
      return { success: false, error: 'Employee not found' };
    }
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