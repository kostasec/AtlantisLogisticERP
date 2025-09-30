import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';

import SearchArea from '../SearchArea';
import HeadingArea from '../HeadingArea';
import GridCard from '../GridCard';

import { paginate } from '@/utils/paginate';

import LocalShipping from '@/icons/Car';
import AccountCircle from '@/icons/User';
import Add from '@/icons/Add';

export default function VehiclePageView({ initialVehicles }) {
  const { t } = useTranslation();
  const [perPage] = useState(8);
  const [page, setPage] = useState(1);
  const safeVehicles = useMemo(() => initialVehicles ?? [], [initialVehicles]);
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
    if (filter.search) return item.vehicleName?.toLowerCase().includes(filter.search.toLowerCase());
    return true;
  });

  return (
    <div className="pt-2 pb-4">
      <Card sx={{ px: 3, py: 2 }}>
  <HeadingArea value={filter.role} changeTab={changeTab} title={t('Vehicles')} icon={Add} buttonLabel={t('Add Vehicle')} buttonRoute="/dashboard/add-vehicle" />

        <SearchArea value={filter.search} onChange={handleSearchChange} gridRoute="/dashboard/vehicle-grid" listRoute="/dashboard/vehicle-list" />

        <Stack spacing={2}>
          {filtered.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
              {t('No vehicles available yet.')}
            </Typography>
          ) : (
            paginate(page, perPage, filtered).map(vehicle => (
            <div key={vehicle.truckID + vehicle.trailerID} style={{ width: '100%' }}>
              <GridCard
                title={vehicle.vehicleName}
                fields={[
                  { icon: LocalShipping, label: t('Truck'), value: vehicle.truckID },
                  { icon: LocalShipping, label: t('Trailer'), value: vehicle.trailerID },
                  { icon: AccountCircle, label: t('Driver'), value: vehicle.driver }
                ]}
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
