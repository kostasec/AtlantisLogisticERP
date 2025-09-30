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
import { USER_LIST } from '@/cevData/users';

import Call from '@/icons/Call';
import Email from '@/icons/Email';
import HomeOutlined from '@/icons/HomeOutlined';
import Add from '@/icons/Add';
import Car from '@/icons/Car';
import duotone from '@/icons/duotone';

export default function EmployeePageView() {
	const { t } = useTranslation();
	const [perPage] = useState(8);
	const [page, setPage] = useState(1);
	const [items] = useState([...USER_LIST]);
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
				<HeadingArea value={filter.role} changeTab={changeTab} title={t('Employees')} icon={Add} buttonLabel={t('Add New Employee')} buttonRoute="/dashboard/add-employee" />

				<SearchArea value={filter.search} onChange={handleSearchChange} gridRoute="/dashboard/employee-grid" listRoute="/dashboard/employee-list" />

				<Grid container spacing={3}>
					{paginate(page, perPage, filtered).map(user => (
						<Grid size={{ lg: 3, md: 4, sm: 6, xs: 12 }} key={user.id}>
								<GridCard avatar={user.avatar} title={user.name} subtitle={user.role} fields={[
										{ icon: HomeOutlined, label: t('Address'), value: user.adress },
										{ icon: Call, label: t('Phone'), value: user.phone },
										{ icon: duotone.Pages, label: t('Passport'), value: user.passport },
										{ icon: Car, label: t('Vehicle'), value: user.vehicle }
								]} />
						</Grid>
					))}

					<Grid size={12}>
						<Stack alignItems="center" py={2}>
							<Pagination shape="rounded" count={Math.ceil(filtered.length / perPage)} onChange={(_, newPage) => setPage(newPage)} />
						</Stack>
					</Grid>
				</Grid>
			</Card>
		</div>
	);
}
