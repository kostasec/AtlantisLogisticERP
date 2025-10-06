import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import format from 'date-fns/format';
import isValid from 'date-fns/isValid'; // MUI

import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles'; // MUI ICON COMPONENTS

import DeleteOutline from '@mui/icons-material/DeleteOutline';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye'; // CUSTOM COMPONENTS

import FlexBox from '@/components/flexbox/FlexBox';
import StatusBadge from '@/components/status-badge';
import { TableMoreMenuItem, TableMoreMenu } from '@/components/table'; // CUSTOM DATA TYPES
import { useTranslation } from 'react-i18next';

// STYLED COMPONENTS
const InvoiceName = styled(Typography)(({
  theme
}) => ({
  fontWeight: 500,
  marginBottom: '0.25rem',
  color: theme.palette.text.primary,
  ':hover': {
    cursor: 'pointer',
    textDecoration: 'underline'
  }
})); // ==============================================================

// ==============================================================
export default function InvoiceTableRow(props) {
  const {
    invoice,
    isSelected,
    handleDeleteInvoice,
    handleSelectRow,
    partyKey = 'Sender'
  } = props;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [openMenuEl, setOpenMenuEl] = useState(null);
  const handleOpenMenu = useCallback(event => {
    setOpenMenuEl(event.currentTarget);
  }, []);
  const handleCloseMenu = useCallback(() => setOpenMenuEl(null), []);
  return <TableRow hover>
      <TableCell align="center" padding="checkbox" sx={{ verticalAlign: 'middle' }}>
        <Checkbox size="small" color="primary" checked={isSelected} onClick={event => handleSelectRow(event, invoice.id)} />
      </TableCell>

      <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <FlexBox justifyContent="center" alignItems="center">
          {(() => {
            const status = (invoice.documentStatus || '').toString().toLowerCase();
            let statusType = 'error'; // default
            
            switch (status) {
              case 'delivered':
                statusType = 'success';
                break;
              case 'sent':
                statusType = 'primary';
                break;
              case 'pending':
                statusType = 'warning';
                break;
              case 'failed':
              case 'rejected':
                statusType = 'error';
                break;
              default:
                statusType = 'error';
            }
            
            return <StatusBadge type={statusType}>{invoice.documentStatus ? t(invoice.documentStatus) : '-'}</StatusBadge>;
          })()}
        </FlexBox>
      </TableCell>

      <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <FlexBox justifyContent="center" alignItems="center">
          {(() => {
            const pStatus = (invoice.processingStatus || '').toString().toLowerCase();
            let statusType = 'error'; // default
            
            switch (pStatus) {
              case 'accepted':
              case 'completed':
              case 'approved':
                statusType = 'success';
                break;
              case 'pending':
              case 'processing':
              case 'in review':
                statusType = 'warning';
                break;
              case 'sent':
              case 'submitted':
                statusType = 'primary';
                break;
              case 'rejected':
              case 'failed':
              case 'cancelled':
                statusType = 'error';
                break;
              default:
                statusType = 'error';
            }
            
            return <StatusBadge type={statusType}>{invoice.processingStatus ? t(invoice.processingStatus) : '-'}</StatusBadge>;
          })()}
        </FlexBox>
      </TableCell>

      <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <FlexBox justifyContent="center" alignItems="center">
          <Typography variant="body2">{invoice?.[partyKey] || '-'}</Typography>
        </FlexBox>
      </TableCell>

      <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <FlexBox justifyContent="center" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {(() => {
              const d = invoice.sentDate ? new Date(invoice.sentDate) : null;
              return d && isValid(d) ? format(d, 'MMM dd, yyyy') : '-';
            })()}
          </Typography>
        </FlexBox>
      </TableCell>

      <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <FlexBox justifyContent="center" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {(() => {
              const d = invoice.deliveredDate ? new Date(invoice.deliveredDate) : null;
              return d && isValid(d) ? format(d, 'MMM dd, yyyy') : '-';
            })()}
          </Typography>
        </FlexBox>
      </TableCell>

      <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <FlexBox justifyContent="center" alignItems="center">
          <Typography variant="body2">{invoice.invoiceNumber ||  '-'}</Typography>
        </FlexBox>
      </TableCell>

        <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <FlexBox justifyContent="center" alignItems="center">
          <Typography variant="body2">{invoice.paymentStatus ? t(invoice.paymentStatus) : '-'}</Typography>
        </FlexBox>
      </TableCell>

      <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <TableMoreMenu open={openMenuEl} handleOpen={handleOpenMenu} handleClose={handleCloseMenu}>
          <TableMoreMenuItem title={t('View')} Icon={RemoveRedEye} handleClick={() => {
            handleCloseMenu();
            navigate('/dashboard/invoice-details');
          }} />
          
        </TableMoreMenu>
      </TableCell>
    </TableRow>;
}