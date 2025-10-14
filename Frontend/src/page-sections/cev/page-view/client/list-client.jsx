import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import SearchArea from '../../SearchArea';
import HeadingArea from '../../HeadingArea';
import GridCard from '../../GridCard';

import { paginate } from '@/utils/paginate';
import { clientService } from '@/services/clientService';

import HomeOutlined from '@/icons/HomeOutlined';
import Email from '@/icons/Email';
import ReceiptOutlined from '@/icons/ReceiptOutlined';
import Key from '@/icons/Key';
import User from '@/icons/User';
import Add from '@/icons/Add';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import CallIcon from '@mui/icons-material/CallOutlined';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

export default function ClientPageView({ initialClients }) {
  const { t } = useTranslation();
  const [perPage] = useState(8);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState({ role: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Učitavanje klijenata sa backenda
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await clientService.getAllClients();
        if (response.success) {
          setItems(response.data);
        } else {
          setError('Failed to fetch clients');
        }
      } catch (err) {
        console.error('Error fetching clients:', err);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const handleChangeFilter = (key, value) => {
    setFilter(state => ({ ...state, [key]: value }));
  };

  const handleSearchChange = useCallback(e => {
    handleChangeFilter('search', e.target.value);
  }, []);

  const changeTab = useCallback((_, newValue) => {
    handleChangeFilter('role', newValue);
  }, []);

  const filtered = items.filter(item => {
    if (filter.role) return item.role?.toLowerCase() === filter.role;
    if (filter.search) return item.clientName?.toLowerCase().includes(filter.search.toLowerCase());
    return true;
  });

  if (loading) {
    return (
      <div className="pt-2 pb-4">
        <Card sx={{ px: 3, py: 2 }}>
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress />
          </Box>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-2 pb-4">
        <Card sx={{ px: 3, py: 2 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ px: 3, py: 2 }}>
        <HeadingArea value={filter.role} changeTab={changeTab} title={t('Clients')} icon={Add} buttonLabel={t('Add Client')} buttonRoute="/dashboard/add-client" />

        <SearchArea value={filter.search} onChange={handleSearchChange} gridRoute="/dashboard/client-grid" listRoute="/dashboard/client-list" />

        <Stack spacing={2}>
          {filtered.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
              {t('No clients available yet.')}
            </Typography>
          ) : (
            paginate(page, perPage, filtered).map(client => (
            <div key={client.id} style={{ width: '100%' }}>
              <GridCard
                title={client.clientName}
                fields={[
                  { icon: ReceiptOutlined, label: t('Tax ID'), value: client.taxId || client.id },
                  { icon: Key, label: t('Registration Number'), value: client.regNmbr || '-' },
                  { icon: HomeOutlined, label: t('Address'), value: client.adress },
                  { icon: Email, label: t('Email'), value: client.email }
                ]}
                contactPerson={client.contactPerson ? {
                  name: client.contactPerson.name,
                  description: client.contactPerson.description,
                  phoneNumber: client.contactPerson.phoneNumber,
                  email: client.contactPerson.email
                } : null}
                contactIcons={{
                  name: User,
                  description: InfoIcon,
                  phoneNumber: CallIcon,
                  email: AlternateEmailIcon
                }}
                sx={{ width: '100%' }}
              />
            </div>
          )))
          }

          {filtered.length > 0 && (
            <div>
              <Stack alignItems="center" py={2}>
                <Pagination shape="rounded" count={Math.ceil(filtered.length / perPage)} onChange={(_, newPage) => setPage(newPage)} />
              </Stack>
            </div>
          )}
        </Stack>
      </Card>
    </div>
  );
}
