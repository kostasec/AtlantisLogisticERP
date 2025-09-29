import { useCallback } from 'react';
import { format } from 'date-fns/format'; // MUI

import Card from '@mui/material/Card';
import Avatar from '@mui/material/Avatar';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton'; // MUI ICON COMPONENTS

import Tune from '@mui/icons-material/Tune';
import Schedule from '@mui/icons-material/Schedule'; // CUSTOM COMPONENTS

import Scrollbar from '@/components/scrollbar';
import { FlexBetween, FlexBox } from '@/components/flexbox'; // COMMON DASHBOARD RELATED COMPONENTS

import { BodyTableCell, HeadTableCell } from '../_common'; // CUSTOM UTILS METHOD

import { currency } from '@/utils/currency';


export default function CustomerTransaction({ 
  transactions = [], 
  title,
  subtitle = null 
}) {
  const getColor = useCallback(index => {
    return index % 2 === 1 ? 'action.selected' : 'transparent';
  }, []);

  return <Card>
      <FlexBetween p={3}>
        <div>
          <Typography variant="h6">{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              {subtitle}
            </Typography>
          )}
        </div>

        <FlexBox gap={1}>
          <Typography variant="body2" lineHeight={1} sx={{
          gap: 1,
          display: 'flex',
          borderRadius: 1.5,
          color: 'grey.500',
          alignItems: 'center',
          padding: '.25rem .5rem',
          backgroundColor: 'action.selected'
        }}>
            <Schedule fontSize="small" /> 24 Aug - 31 Aug
          </Typography>

          <IconButton color="secondary">
            <Tune />
          </IconButton>
        </FlexBox>
      </FlexBetween>

      <Scrollbar>
        <Table sx={{
        minWidth: 500
      }}>
          <TableHead>
            <TableRow>
              <HeadTableCell>CLIENT</HeadTableCell>
              <HeadTableCell>INVOICE</HeadTableCell>
              <HeadTableCell>DUE DATE</HeadTableCell>
              <HeadTableCell>AMOUNT</HeadTableCell>
              <HeadTableCell>ACTION</HeadTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <BodyTableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary" py={4}>
                    No transactions available
                  </Typography>
                </BodyTableCell>
              </TableRow>
            ) : (
              transactions.map((transaction, index) => (
                <TableRow key={transaction.id || index} sx={{
                  backgroundColor: getColor(index)
                }}>
                  <BodyTableCell>
                    <FlexBox gap={1}>
                      {transaction.clientAvatar && (
                        <Avatar 
                          src={transaction.clientAvatar} 
                          alt={transaction.clientName}
                          sx={{ width: 32, height: 32 }}
                        />
                      )}

                      <div>
                        <Typography variant="body2" color="text.primary" fontWeight={500}>
                          {transaction.clientName || '-'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {transaction.clientEmail || '-'}
                        </Typography>
                      </div>
                    </FlexBox>
                  </BodyTableCell>

                  <BodyTableCell>
                    <Typography variant="body2" color="text.primary">
                      {transaction.invoiceNumber || '-'}
                    </Typography>
                  </BodyTableCell>

                  <BodyTableCell>
                    <Typography variant="body2" color="text.secondary">
                      {transaction.dueDate ? format(new Date(transaction.dueDate), 'dd MMM, yyyy') : '-'}
                    </Typography>
                  </BodyTableCell>

                  <BodyTableCell>
                    <Typography variant="body2" color="text.primary" fontWeight={500}>
                      {transaction.amount ? currency(transaction.amount) : '-'}
                    </Typography>
                  </BodyTableCell>

                  <BodyTableCell>
                    <IconButton size="small" color="secondary">
                      <Tune fontSize="small" />
                    </IconButton>
                  </BodyTableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Scrollbar>
    </Card>;
}