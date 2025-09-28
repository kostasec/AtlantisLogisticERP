import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import format from 'date-fns/format';
import isValid from 'date-fns/isValid'; // MUI

import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles'; // MUI ICON COMPONENTS

import DeleteOutline from '@mui/icons-material/DeleteOutline';
import RemoveRedEye from '@mui/icons-material/RemoveRedEye'; // CUSTOM COMPONENTS

import FlexBox from '@/components/flexbox/FlexBox';
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
            const status = (invoice.DocumentStatus || '').toString();
            const ok = /^(sent|delivered)$/i.test(status);
            return <Chip variant="outlined" size="small" label={status || '-'} sx={{
              borderColor: ok ? 'success.main' : 'error.main',
              color: ok ? 'success.main' : 'error.main',
              fontWeight: 500,
              py: 0.25,
              lineHeight: 1
            }} />;
          })()}
        </FlexBox>
      </TableCell>

      <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <FlexBox justifyContent="center" alignItems="center">
          {(() => {
            const pStatus = (invoice.ProcessingStatus || '').toString();
            const okP = /^(sent|accepted)$/i.test(pStatus);
            return <Chip variant="outlined" size="small" label={pStatus || '-'} sx={{
              borderColor: okP ? 'success.main' : 'error.main',
              color: okP ? 'success.main' : 'error.main',
              fontWeight: 500,
              py: 0.25,
              lineHeight: 1
            }} />;
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
              const d = invoice.SendDate ? new Date(invoice.SendDate) : null;
              return d && isValid(d) ? format(d, 'MMM dd, yyyy') : '-';
            })()}
          </Typography>
        </FlexBox>
      </TableCell>

      <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <FlexBox justifyContent="center" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {(() => {
              const d = invoice.DeliveredDate ? new Date(invoice.DeliveredDate) : null;
              return d && isValid(d) ? format(d, 'MMM dd, yyyy') : '-';
            })()}
          </Typography>
        </FlexBox>
      </TableCell>

      <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <FlexBox justifyContent="center" alignItems="center">
          <Typography variant="body2">{invoice.InvoiceNumber || invoice.invoiceId || '-'}</Typography>
        </FlexBox>
      </TableCell>

      <TableCell align="center" padding="normal" sx={{ verticalAlign: 'middle' }}>
        <TableMoreMenu open={openMenuEl} handleOpen={handleOpenMenu} handleClose={handleCloseMenu}>
          <TableMoreMenuItem title={t('View')} Icon={RemoveRedEye} handleClick={() => {
            handleCloseMenu();
            navigate('/dashboard/invoice-details');
          }} />
          <TableMoreMenuItem title={t('Delete')} Icon={DeleteOutline} handleClick={() => {
            handleCloseMenu();
            handleDeleteInvoice(invoice.id);
          }} />
        </TableMoreMenu>
      </TableCell>
    </TableRow>;
}