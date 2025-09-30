import React, { useEffect, useState } from 'react';
import { clientService } from '../services/clientService';

export default function ClientTest() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        console.log('Fetching clients...');
        const response = await clientService.getAllClients();
        console.log('Response:', response);
        if (response.success) {
          setClients(response.data);
        } else {
          setError('Failed to fetch clients');
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Error connecting to server: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{color: 'red'}}>Error: {error}</div>;

  return (
    <div>
      <h2>Clients ({clients.length})</h2>
      {clients.map(client => (
        <div key={client.id} style={{border: '1px solid #ccc', margin: '10px', padding: '10px'}}>
          <h3>{client.clientName}</h3>
          <p>Tax ID: {client.taxId}</p>
          <p>Reg Number: {client.regNmbr}</p>
          <p>Address: {client.adress}</p>
          <p>Email: {client.email}</p>
          {client.contactPerson && (
            <div>
              <h4>Contact Person:</h4>
              <p>Name: {client.contactPerson.name}</p>
              <p>Phone: {client.contactPerson.phoneNumber}</p>
              <p>Email: {client.contactPerson.email}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}