import { useCallback, useEffect, useMemo, useState } from 'react'; // MUI

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Avatar from '@mui/material/Avatar';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { alpha, styled } from '@mui/material/styles'; // CUSTOM COMPONENTS
import { useTranslation } from 'react-i18next';

import Scrollbar from '@/components/scrollbar';
import FlexBetween from '@/components/flexbox/FlexBetween';
import { TableDataNotFound, TableToolbar } from '@/components/table'; // CUSTOM DEFINED HOOK

import useMuiTable, { getComparator, stableSort } from '@/hooks/useMuiTable'; // CUSTOM ICON COMPONENTS

import Invoice from '@/icons/sidebar/Invoice'; // CUSTOM PAGE SECTION COMPONENTS

import InvoiceTableRow from '../InvoiceTableRow';
import InvoiceTableHead from '../InvoiceTableHead';
import InvoiceTableActions from '../InvoiceTableActions'; // CUSTOM DUMMY DATA


import { paginate } from '@/utils/paginate';
import incomingInvoiceService from '@/services/incomingInvoice';

const StyledAvatar = styled(Avatar)(({
  theme
}) => ({
  width: 36,
  height: 36,
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  '& .icon': {
    fontSize: 22
  }
}));

const normalizeInvoices = list => (Array.isArray(list) ? list : []).map(item => ({
  ...item,
  date: item.date ? new Date(item.date) : null,
  issueDate: item.issueDate ? new Date(item.issueDate) : null,
  deliveredDate: item.deliveredDate ? new Date(item.deliveredDate) : null
}));

function InvoiceTablePageView({
  title,
  initialInvoices = [],
  partyKey,
  partyLabel
}) {
  const { t } = useTranslation();
  const [invoices, setInvoices] = useState(() => normalizeInvoices(initialInvoices));
  const [invoiceFilter, setInvoiceFilter] = useState({
    search: '',
    status: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    page,
    order,
    orderBy,
    selected,
    rowsPerPage,
    setPage,
    isSelected,
    handleSelectRow,
    handleChangePage,
    handleRequestSort,
    handleSelectAllRows,
    handleChangeRowsPerPage
  } = useMuiTable({
    defaultOrderBy: partyKey
  });
  useEffect(() => {
    setPage(0);
  }, [invoiceFilter, setPage]);
  
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await incomingInvoiceService.getAllIncomingInvoices();
        if (response.success) {
          setInvoices(normalizeInvoices(response.data));
        } else {
          setError(t('Failed to fetch incoming invoices'));
        }
      } catch (err) {
        console.error('Error fetching incoming invoices:', err);
        setError(t('Error connecting to server') + ': ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    // Učitaj iz API-ja ako nema početnih podataka
    if (initialInvoices.length === 0) {
      fetchInvoices();
    } else {
      setInvoices(normalizeInvoices(initialInvoices));
      setLoading(false);
    }
  }, [initialInvoices]);
  const handleChangeFilter = useCallback((key, value) => {
    setInvoiceFilter(prev => ({ ...prev,
      [key]: value
    }));
  }, []);
  const filteredInvoices = useMemo(() => {
    const sortedInvoices = stableSort(invoices, getComparator(order, orderBy || partyKey));
    return sortedInvoices.filter(item => {
      const {
        status,
        search
      } = invoiceFilter;
      if (status === 'pending') return item.status === 'Pending';
      if (status === 'complete') return item.status === 'Complete';

      if (search) {
        const searchTerm = search.toLowerCase();
        const matchesName = item.name ? item.name.toLowerCase().includes(searchTerm) : false;
  const matchesParty = item[partyKey] ? item[partyKey].toString().toLowerCase().includes(searchTerm) : false;
        return matchesName || matchesEmail || matchesParty;
      }

      return true;
    });
  }, [invoices, order, orderBy, invoiceFilter, partyKey]);
  const paginatedInvoices = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredInvoices.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredInvoices, page, rowsPerPage]);
  const handleDeleteInvoice = useCallback(id => {
    setInvoices(prev => prev.filter(item => item.id !== id));
  }, []);
  const handleAllDeleteInvoice = useCallback(() => {
    setInvoices(prev => prev.filter(item => !selected.includes(item.id)));
    handleSelectAllRows([])();
  }, [selected, handleSelectAllRows]);

  if (loading) {
    return (
      <Card>
        <Box display="flex" justifyContent="center" alignItems="center" py={8}>
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      </Card>
    );
  }

  return <Card>
      <FlexBetween flexWrap="wrap" gap={2} px={2} py={3}>
        <Stack direction="row" alignItems="center" gap={1}>
          <StyledAvatar variant="rounded">
            <Invoice color="primary" className="icon" />
          </StyledAvatar>

          <Typography variant="body1" fontWeight={500}>
            {t(title)}
          </Typography>
        </Stack>

        
      </FlexBetween>

      {
      /* INVOICE FILTER ACTION BAR */
    }
      <InvoiceTableActions filter={invoiceFilter} handleChangeFilter={handleChangeFilter} />

      {
      /* TABLE ROW SELECTION HEADER  */
    }
      {selected.length > 0 && <TableToolbar selected={selected.length} handleDeleteRows={handleAllDeleteInvoice} />}

      {
      /* TABLE HEAD & BODY ROWS */
    }
      <TableContainer>
        <Scrollbar autoHide={false}>
          <Table sx={{
          minWidth: 900
        }}>
            {
            /* TABLE HEAD SECTION */
          }
            <InvoiceTableHead order={order} orderBy={orderBy} numSelected={selected.length} rowCount={filteredInvoices.length} onRequestSort={handleRequestSort} onSelectAllRows={handleSelectAllRows(filteredInvoices.map(row => row.id))} partyLabel={partyLabel} partyKey={partyKey} />

            {
            /* TABLE BODY & DATA SECTION */
          }
            <TableBody>
              {filteredInvoices.length === 0 ? <TableDataNotFound /> : paginatedInvoices.map(invoice => <InvoiceTableRow key={invoice.id} invoice={invoice} handleSelectRow={handleSelectRow} isSelected={isSelected(invoice.id)} handleDeleteInvoice={handleDeleteInvoice} partyKey={partyKey} />)}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>

      {
      /* TABLE PAGINATION SECTION */
    }
      <TablePagination page={page} component="div" rowsPerPage={rowsPerPage} count={filteredInvoices.length} onPageChange={handleChangePage} rowsPerPageOptions={[5, 10, 25]} onRowsPerPageChange={handleChangeRowsPerPage} showFirstButton showLastButton />
    </Card>;
}

export const IncomingInvoice = ({ initialInvoices = [], ...props }) => (
  <InvoiceTablePageView title={"Incoming Invoice"} initialInvoices={initialInvoices} partyKey="sender" partyLabel={"Sender"} {...props} />
);

export default IncomingInvoice;