import React, { useEffect, useState } from 'react';
import { employeeService } from '../services/employeeService';

export default function EmployeeTest() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        console.log('Fetching employees...');
        const response = await employeeService.getAllEmployees();
        console.log('Response:', response);
        if (response.success) {
          setEmployees(response.data);
        } else {
          setError('Failed to fetch employees');
        }
      } catch (err) {
        console.error('Error fetching employees:', err);
        setError('Error connecting to server: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  if (loading) return <div>Loading employees...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;

  return (
    <div>
      <h2>Employees ({employees.length})</h2>
      {employees.map(employee => (
        <div key={employee.id} style={{border: '1px solid #ccc', margin: '10px', padding: '10px'}}>
          <h3>{employee.fullName}</h3>
          <p>Employee ID: {employee.employeeId}</p>
          <p>Type: {employee.employeeType}</p>
          <p>Address: {employee.address}</p>
          <p>Phone: {employee.phoneNumber}</p>
          <p>Email: {employee.email}</p>
          <p>Birth Date: {employee.birthDate ? new Date(employee.birthDate).toLocaleDateString() : '-'}</p>
          <p>Hire Date: {employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : '-'}</p>
          <p>Salary: {employee.salary ? `$${employee.salary}` : '-'}</p>
          <p>Status: {employee.status}</p>
          {employee.managerName && (
            <p>Manager: {employee.managerName}</p>
          )}
        </div>
      ))}
    </div>
  );
}