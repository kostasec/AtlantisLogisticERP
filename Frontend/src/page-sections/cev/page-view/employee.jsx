import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import SearchArea from '../SearchArea';
import HeadingArea from '../HeadingArea';
import GridCard from '../GridCard';

import { paginate } from '@/utils/paginate';
import { employeeService } from '@/services/employeeService';

import Call from '@/icons/Call';
import Email from '@/icons/Email';
import HomeOutlined from '@/icons/HomeOutlined';
import Add from '@/icons/Add';
import Car from '@/icons/Car';
import duotone from '@/icons/duotone';

export default function EmployeePageView({ initialEmployees }) {
	const { t } = useTranslation();
	const [perPage] = useState(8);
	const [page, setPage] = useState(1);
	const safeEmployees = useMemo(() => initialEmployees ?? [], [initialEmployees]);
	const [items, setItems] = useState(safeEmployees);
	const [filter, setFilter] = useState({ role: '', search: '' });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchEmployees = async () => {
			try {
				setLoading(true);
				const response = await employeeService.getAllEmployees();
				if (response.success) {
					setItems(response.data);
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

		// Učitaj iz API-ja ako nema početnih podataka
		if (safeEmployees.length === 0) {
			fetchEmployees();
		} else {
			setItems(safeEmployees);
			setLoading(false);
		}
	}, [safeEmployees]);

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
		if (filter.role) return item.employeeType?.toLowerCase().includes(filter.role);
		if (filter.search) return item.fullName?.toLowerCase().includes(filter.search.toLowerCase());
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
				<HeadingArea value={filter.role} changeTab={changeTab} title={t('Employees')} icon={Add} buttonLabel={t('Add New Employee')} buttonRoute="/dashboard/add-employee" />

				<SearchArea value={filter.search} onChange={handleSearchChange} gridRoute="/dashboard/employee-grid" listRoute="/dashboard/employee-list" />

				<Grid container spacing={3}>
					{filtered.length === 0 ? (
						<Grid size={12}>
							<Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
								{t('No employees available yet.')}
							</Typography>
						</Grid>
					) : (
						paginate(page, perPage, filtered).map(employee => (
							<Grid size={{ lg: 3, md: 4, sm: 6, xs: 12 }} key={employee.id}>
								<GridCard 
									avatar={employee.avatar || '/static/avatar/020-man-4.svg'} 
									title={employee.fullName} 
									subtitle={employee.employeeType} 
									fields={[
										{ icon: HomeOutlined, label: t('Address'), value: employee.address || '-' },
										{ icon: Call, label: t('Phone'), value: employee.phoneNumber || '-' },
										{ icon: duotone.Pages, label: t('Passport'), value: employee.passportNumber || '-' },
										{ icon: duotone.UserProfile, label: t('Manager'), value: employee.manager || 'No Manager' },
										{ icon: Car, label: t('Vehicle'), value: employee.vehicle || 'No Vehicle' },
									]} 
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
