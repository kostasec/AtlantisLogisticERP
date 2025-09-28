import { useCallback, useMemo } from 'react'; // MUI

import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import visuallyHidden from '@mui/utils/visuallyHidden';
import { styled } from '@mui/material/styles'; // STYLED COMPONENTS
import FlexBox from '@/components/flexbox/FlexBox';
import { useTranslation } from 'react-i18next';

const StyledTableHead = styled(TableHead)(({
  theme
}) => ({
  backgroundColor: theme.palette.grey[100],
  ...theme.applyStyles('dark', {
    backgroundColor: theme.palette.grey[700]
  })
}));
const HeaderCell = styled(TableCell)(({
  theme
}) => ({
  fontWeight: 500,
  color: theme.palette.text.primary
})); // ==============================================================
// center header content
HeaderCell.defaultProps = {
  align: 'center'
};


// ==============================================================
// TABLE HEAD COLUMN DATA
export default function InvoiceTableHead({
  order,
  orderBy,
  rowCount,
  numSelected,
  onRequestSort,
  onSelectAllRows,
  partyLabel = 'Sender',
  partyKey = 'Sender'
}) {
  const { t } = useTranslation();
  const createSortHandler = useCallback(property => event => {
    onRequestSort(event, property);
  }, [onRequestSort]);
  const headCells = useMemo(() => [{
    id: 'DocumentStatus',
    numeric: true,
    disablePadding: false,
    label: t('Status')
  }, {
    id: 'ProcessingStatus',
    numeric: true,
    disablePadding: false,
    label: t('Proc. Status')
  }, {
    id: partyKey,
    numeric: true,
    disablePadding: false,
    label: t(partyLabel)
  }, {
    id: 'SendDate',
    numeric: true,
    disablePadding: false,
    label: t('Send Date')
  }, {
    id: 'DeliveredDate',
    numeric: true,
    disablePadding: false,
    label: t('Delivered Date')
  }, {
    id: 'InvoiceNumber',
    numeric: true,
    disablePadding: false,
    label: t('Invoice Number')
  }, {
    id: '',
    numeric: true,
    disablePadding: false,
    label: t('Edit')
  }], [partyKey, partyLabel, t]);
  return <StyledTableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox size="small" color="primary" onChange={onSelectAllRows} checked={rowCount > 0 && numSelected === rowCount} indeterminate={numSelected > 0 && numSelected < rowCount} />
        </TableCell>

        {headCells.map(headCell => <HeaderCell key={headCell.id} align="center" padding={headCell.disablePadding ? 'none' : 'normal'} sortDirection={orderBy === headCell.id ? order : false}>
            <FlexBox justifyContent="center" alignItems="center">
              <TableSortLabel sx={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', transform: 'translateX(12px)' }} active={orderBy === headCell.id} onClick={createSortHandler(headCell.id)} direction={orderBy === headCell.id ? order : 'asc'}>
                <Typography variant="body2" sx={{ lineHeight: 1, textAlign: 'center' }}>
                  {headCell.label}
                </Typography>
                {orderBy === headCell.id && <span style={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>}
              </TableSortLabel>
            </FlexBox>
          </HeaderCell>)}
      </TableRow>
    </StyledTableHead>;
}