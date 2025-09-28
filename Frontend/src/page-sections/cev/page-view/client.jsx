import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';

import SearchArea from '../SearchArea';
import HeadingArea from '../HeadingArea';
import GridCard from '../GridCard';

import { paginate } from '@/utils/paginate';
import { CLIENT_LIST } from '@/__fakeData__/clients';

import HomeOutlined from '@/icons/HomeOutlined';
import Email from '@/icons/Email';
import ReceiptOutlined from '@/icons/ReceiptOutlined';
import Key from '@/icons/Key';
import User from '@/icons/User';
import Add from '@/icons/Add';

export default function ClientPageView() {
  const { t } = useTranslation();
  const [perPage] = useState(8);
  const [page, setPage] = useState(1);
  const [items] = useState([...CLIENT_LIST]);
  const [filter, setFilter] = useState({ role: '', search: '' });

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
    if (filter.role) return item.role.toLowerCase() === filter.role;
    if (filter.search) return item.name.toLowerCase().includes(filter.search.toLowerCase());
    return true;
  });

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ px: 3, py: 2 }}>
  <HeadingArea value={filter.role} changeTab={changeTab} title={t('Clients')} icon={Add} buttonLabel={t('Add Client')} buttonRoute="/dashboard/add-client" />

        <SearchArea value={filter.search} onChange={handleSearchChange} gridRoute="/dashboard/client-grid" listRoute="/dashboard/client-list" />

        <Stack spacing={2}>
          {paginate(page, perPage, filtered).map(client => (
            <div key={client.id} style={{ width: '100%' }}>
              <GridCard
                title={client.clientName}
                fields={[
                  { icon: ReceiptOutlined, label: t('Tax ID'), value: client.taxId || client.id },
                  { icon: Key, label: t('Registration Number'), value: client.regNmbr || '-' },
                  { icon: HomeOutlined, label: t('Address'), value: client.adress },
                  { icon: Email, label: t('Email'), value: client.email }
                ]}
                sx={{ width: '100%' }}
              />
            </div>
          ))}

          <div>
            <Stack alignItems="center" py={2}>
              <Pagination shape="rounded" count={Math.ceil(filtered.length / perPage)} onChange={(_, newPage) => setPage(newPage)} />
            </Stack>
          </div>
        </Stack>
      </Card>
    </div>
  );
}
