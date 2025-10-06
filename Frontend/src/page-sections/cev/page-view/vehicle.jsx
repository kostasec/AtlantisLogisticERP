import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';

import SearchArea from '../SearchArea';
import HeadingArea from '../HeadingArea';
import GridCard from '../GridCard';

import { paginate } from '@/utils/paginate';
import { isMockEnabled } from '@/mocks/mockConfig';
import { mockVehicles } from '@/mocks/data/vehicles';


import LocalShipping from '@/icons/Car';
import AccountCircle from '@/icons/User';
import duotone from '@/icons/duotone';
import Add from '@/icons/Add';

export default function VehiclePageView({ initialVehicles }) {
  const { t } = useTranslation();
  const [perPage] = useState(8);
  const [page, setPage] = useState(1);
  const safeVehicles = useMemo(() => {
    if (isMockEnabled()) return mockVehicles;
    return initialVehicles ?? [];
  }, [initialVehicles]);
  const [items, setItems] = useState(safeVehicles);
  const [filter, setFilter] = useState({ role: '', search: '' });

  useEffect(() => {
    setItems(safeVehicles);
  }, [safeVehicles]);

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
    if (filter.search) {
      const haystack = `${item.truckID} ${item.trailerID} ${item.driver}`.toLowerCase();
      return haystack.includes(filter.search.toLowerCase());
    }
    return true;
  });

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ px: 3, py: 2 }}>
  <HeadingArea value={filter.role} changeTab={changeTab} title={t('Vehicles')} icon={Add} buttonLabel={t('Add Vehicle')} buttonRoute="/dashboard/add-vehicle" />

        <SearchArea value={filter.search} onChange={handleSearchChange} gridRoute="/dashboard/vehicle-grid" listRoute="/dashboard/vehicle-list" />

        <Grid container spacing={3}>
          {filtered.length === 0 ? (
            <Grid size={12}>
              <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
                {t('No vehicles available yet.')}
              </Typography>
            </Grid>
          ) : (
            paginate(page, perPage, filtered).map(vehicle => (
              <Grid size={{ lg: 3, md: 4, sm: 6, xs: 12 }} key={vehicle.truckID + vehicle.trailerID}>
                <GridCard
                  title={`${vehicle.truck?.registrationTag || vehicle.truckID || '-'} / ${vehicle.trailer?.registrationTag || vehicle.trailerID || '-'}`}
                  subtitle={vehicle.role || ''}
                  fields={[
                    {
                      icon: LocalShipping,
                      label: t('Truck'),
                      value: vehicle.truckID || vehicle.truck?.registrationTag || '-',
                      expandFields: [
                        { label: t('Make'), value: vehicle.truck?.make || '-' },
                        { label: t('Model'), value: vehicle.truck?.model || '-' },
                        { label: t('Registration Tag'), value: vehicle.truck?.registrationTag || vehicle.truckID || '-' }
                      ]
                    },
                    {
                      icon: LocalShipping,
                      label: t('Trailer'),
                      value: vehicle.trailerID || vehicle.trailer?.registrationTag || '-',
                      expandFields: [
                        { label: t('Make'), value: vehicle.trailer?.make || '-' },
                        { label: t('Model'), value: vehicle.trailer?.model || '-' },
                        { label: t('Registration Tag'), value: vehicle.trailer?.registrationTag || vehicle.trailerID || '-' }
                      ]
                    },
                    { icon: AccountCircle, label: t('Driver'), value: vehicle.driver || '-' }
                  ]}
                  sx={{ width: '100%' }}
                />
              </Grid>
            ))
          )}

          {filtered.length > 0 && (
            <Grid size={12}>
              <Stack alignItems="center" py={2}>
                <Pagination shape="rounded" count={Math.ceil(filtered.length / perPage)} onChange={(_, newPage) => setPage(newPage)} />
              </Stack>
            </Grid>
          )}
        </Grid>
      </Card>
    </div>
  );
}
