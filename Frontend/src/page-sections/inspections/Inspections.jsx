import React, { useState, useCallback } from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { BodyTableCell, HeadTableCell } from '@/page-sections/dashboards/_common';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Trash from '@/icons/duotone/Trash';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { FlexBetween } from '@/components/flexbox';
import Scrollbar from '@/components/scrollbar';
import AddInspectionDialog from './AddInspectionDialog';
import RenewInspectionDialog from './RenewInspectionDialog';

// Mock data za inspections
const MOCK_INSPECTIONS = [
  {
    id: 1,
    vehicleId: 'NS-123-AB',
    inspectionType: 'Technical Inspection',
    lastInspection: '2024-01-15',
    nextInspection: '2025-01-15',
    status: 'valid',
    daysUntilExpiry: 67,
    inspector: 'Auto Centar Miloš',
    notes: 'All systems OK'
  },
  {
    id: 2,
    vehicleId: 'NS-456-CD',
    inspectionType: 'Registration',
    lastInspection: '2024-03-10',
    nextInspection: '2025-03-10',
    status: 'warning',
    daysUntilExpiry: 30,
    inspector: 'MUP Srbije',
    notes: 'Renewal required soon'
  },
  {
    id: 3,
    vehicleId: 'NS-789-EF',
    inspectionType: 'Insurance',
    lastInspection: '2024-02-20',
    nextInspection: '2025-02-20',
    status: 'expired',
    daysUntilExpiry: -5,
    inspector: 'DDOR Novi Sad',
    notes: 'Expired - needs renewal'
  },
  {
    id: 4,
    vehicleId: 'NS-321-GH',
    inspectionType: 'Tachograph',
    lastInspection: '2024-06-01',
    nextInspection: '2025-06-01',
    status: 'valid',
    daysUntilExpiry: 180,
    inspector: 'Tech Control',
    notes: 'Calibrated and sealed'
  },
  {
    id: 5,
    vehicleId: 'Marko Petrović',
    inspectionType: 'Driver License',
    lastInspection: '2024-05-01',
    nextInspection: '2025-05-01',
    status: 'valid',
    daysUntilExpiry: 174,
    inspector: 'MUP Srbije',
    notes: 'Category C+E license'
  },
  {
    id: 6,
    vehicleId: 'Ana Jovanović',
    inspectionType: 'Medical Certificate',
    lastInspection: '2024-08-15',
    nextInspection: '2024-12-15',
    status: 'warning',
    daysUntilExpiry: 37,
    inspector: 'Dom Zdravlja',
    notes: 'Medical check required'
  },
  {
    id: 7,
    vehicleId: 'Company Depot',
    inspectionType: 'Fire Extinguisher',
    lastInspection: '2024-02-01',
    nextInspection: '2025-02-01',
    status: 'valid',
    daysUntilExpiry: 85,
    inspector: 'Fire Safety Inc.',
    notes: 'All extinguishers checked'
  },
  {
    id: 8,
    vehicleId: 'NS-555-XY',
    inspectionType: 'ADR Certificate',
    lastInspection: '2024-01-10',
    nextInspection: '2024-11-10',
    status: 'expired',
    daysUntilExpiry: -2,
    inspector: 'ADR Training Center',
    notes: 'Dangerous goods transport'
  }
];

export default function Inspections() {
  const [inspections, setInspections] = useState(MOCK_INSPECTIONS);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [renewDialogOpen, setRenewDialogOpen] = useState(false);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Vehicle Inspections');

  const getStatusColor = (status) => {
    switch (status) {
      case 'valid': return 'success';
      case 'warning': return 'error';
      case 'expired': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'valid': return <CheckCircleIcon fontSize="small" />;
      case 'warning': return <WarningIcon fontSize="small" />;
      case 'expired': return <WarningIcon fontSize="small" />;
      default: return <CalendarTodayIcon fontSize="small" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('sr-RS');
  };

  const getColor = useCallback((index) => {
    return index % 2 === 1 ? 'action.selected' : 'transparent';
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddInspection = (newInspection) => {
    const inspection = {
      id: inspections.length + 1,
      ...newInspection,
      status: calculateStatus(newInspection.nextInspection),
      daysUntilExpiry: calculateDaysUntilExpiry(newInspection.nextInspection)
    };
    setInspections(prev => [...prev, inspection]);
  };

  const handleRenewInspection = (updatedInspection) => {
    const renewedInspection = {
      ...updatedInspection,
      status: calculateStatus(updatedInspection.nextInspection),
      daysUntilExpiry: calculateDaysUntilExpiry(updatedInspection.nextInspection)
    };
    
    setInspections(prev => 
      prev.map(inspection => 
        inspection.id === renewedInspection.id ? renewedInspection : inspection
      )
    );
  };

  const handleDeleteInspection = (id) => {
    setInspections(prev => prev.filter(inspection => inspection.id !== id));
  };

  const handleOpenRenewDialog = (inspection) => {
    setSelectedInspection(inspection);
    setRenewDialogOpen(true);
  };

  const calculateStatus = (nextInspectionDate) => {
    const days = calculateDaysUntilExpiry(nextInspectionDate);
    if (days < 0) return 'expired';
    if (days < 30) return 'warning';
    return 'valid';
  };

  const calculateDaysUntilExpiry = (nextInspectionDate) => {
    const today = new Date();
    const expiry = new Date(nextInspectionDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Categories for inspection types
  const inspectionCategories = ['Vehicle Inspections', 'Employee Inspections', 'Other Inspections'];

  // Filter inspections by category
  const getFilteredInspections = () => {
    switch (selectedCategory) {
      case 'Vehicle Inspections':
        return inspections.filter(inspection => 
          ['Technical Inspection', 'Registration', 'Insurance', 'Tachograph'].includes(inspection.inspectionType)
        );
      case 'Employee Inspections':
        return inspections.filter(inspection => 
          ['Driver License', 'Medical Certificate', 'Training Certificate'].includes(inspection.inspectionType)
        );
      case 'Other Inspections':
        return inspections.filter(inspection => 
          ['Fire Extinguisher', 'First Aid Kit', 'ADR Certificate'].includes(inspection.inspectionType)
        );
      default:
        return inspections;
    }
  };

  const filteredInspections = getFilteredInspections();

  const paginatedInspections = filteredInspections.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="pt-2 pb-4">
      <Card>
        <Box sx={{ p: 3 }}>
          <div>
            <Typography variant="h5">Inspections</Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Track vehicle and employee inspections
            </Typography>
          </div>

          <Stack spacing={2} sx={{ mt: 3 }}>
            {/* Row of category buttons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {inspectionCategories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'contained' : 'outlined'}
                  onClick={() => {
                    setSelectedCategory(category);
                    setPage(0);
                  }}
                  size="medium"
                >
                  {category}
                </Button>
              ))}
            </Box>

            {/* Add Inspection Button under Vehicle Inspections */}
            <Box>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setAddDialogOpen(true)}
                size="small"
                sx={{ width: { xs: '100%', sm: 'auto' } }}
              >
                Add Inspection
              </Button>
            </Box>
          </Stack>
        </Box>

        {/* Table */}
        <Scrollbar>
          <Table sx={{ width: '100%', tableLayout: 'auto' }}>
              <TableHead>
                <TableRow>
                  {selectedCategory !== 'Other Inspections' && (
                    <HeadTableCell>
                      {selectedCategory === 'Employee Inspections' ? 'Employee' : 'Vehicle'}
                    </HeadTableCell>
                  )}
                  <HeadTableCell>Inspection Type</HeadTableCell>
                  <HeadTableCell>Status</HeadTableCell>
                  <HeadTableCell>Last Inspection</HeadTableCell>
                  <HeadTableCell>Next Inspection</HeadTableCell>
                  <HeadTableCell>Days Until Expiry</HeadTableCell>
                  <HeadTableCell>Actions</HeadTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedInspections.map((inspection, index) => (
                  <TableRow 
                    key={inspection.id}
                    sx={{
                      backgroundColor: getColor(index),
                      '& td:first-of-type': {
                        paddingLeft: 3
                      }
                    }}
                  >
                    {selectedCategory !== 'Other Inspections' && (
                      <BodyTableCell>
                        <Typography variant="body2" fontWeight={500}>
                          {inspection.vehicleId}
                        </Typography>
                      </BodyTableCell>
                    )}
                    
                    <BodyTableCell>
                      <Typography variant="body2">
                        {inspection.inspectionType}
                      </Typography>
                    </BodyTableCell>

                    <BodyTableCell>
                      <Chip
                        size="medium"
                        icon={getStatusIcon(inspection.status)}
                        label={inspection.status.charAt(0).toUpperCase() + inspection.status.slice(1)}
                        color={getStatusColor(inspection.status)}
                        variant="outlined"
                        sx={{
                          minWidth: '100px',
                          height: '30px',
                          '& .MuiChip-icon': {
                          },
                        }}
                      />
                    </BodyTableCell>

                    <BodyTableCell>
                      <Typography variant="body2">
                        {formatDate(inspection.lastInspection)}
                      </Typography>
                    </BodyTableCell>

                    <BodyTableCell>
                      <Typography variant="body2">
                        {formatDate(inspection.nextInspection)}
                      </Typography>
                    </BodyTableCell>

                    <BodyTableCell>
                      <Typography 
                        variant="body2" 
                        color={inspection.daysUntilExpiry < 0 ? 'error' : inspection.daysUntilExpiry < 31 ? 'error' : 'text.primary'}
                        fontWeight={inspection.daysUntilExpiry < 31 ? 600 : 400}
                      >
                        {inspection.daysUntilExpiry < 0 
                          ? `${Math.abs(inspection.daysUntilExpiry)} days overdue`
                          : `${inspection.daysUntilExpiry} days`
                        }
                      </Typography>
                    </BodyTableCell>

                    <BodyTableCell>
                      <Stack direction="row" spacing={1}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenRenewDialog(inspection)}
                        >
                          <RefreshIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteInspection(inspection.id)}
                        >
                          <Trash fontSize="small" />
                        </IconButton>
                      </Stack>
                    </BodyTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </Scrollbar>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filteredInspections.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          showFirstButton
          showLastButton
        />
      </Card>

      {/* Add Inspection Dialog */}
      <AddInspectionDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSave={handleAddInspection}
        selectedCategory={selectedCategory}
      />

      {/* Renew Inspection Dialog */}
      <RenewInspectionDialog
        open={renewDialogOpen}
        onClose={() => setRenewDialogOpen(false)}
        onSave={handleRenewInspection}
        inspection={selectedInspection}
      />
    </div>
  );
}