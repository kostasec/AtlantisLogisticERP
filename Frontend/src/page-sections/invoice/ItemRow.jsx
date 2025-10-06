import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';

import { TextField } from '@/components/form';
import Delete from '@/icons/Delete';
import Add from '@/icons/Add';
import { formatNumber, numberInputProps } from '@/utils/numberFormat';


const getVatDisplayValue = (value) => {
  switch(value) {
    case 'VAT 10%': return '10%';
    case 'VAT 20%': return '20%';
    case 'NO VAT - IMPORT': return 'NV-I';
    case 'NO VAT - EXPORT': return 'NV-E';
    case 'NO VAT - FOREIGN': return 'NV-F';
    default: return value;
  }
};


export const VAT_OPTIONS = [
  { value: 'VAT 10%', label: 'VAT 10%' },
  { value: 'VAT 20%', label: 'VAT 20%' },
  { value: 'NO VAT - IMPORT', label: 'NO VAT - IMPORT' },
  { value: 'NO VAT - EXPORT', label: 'NO VAT - EXPORT' },
  { value: 'NO VAT - FOREIGN', label: 'NO VAT - FOREIGN' }
];


const ItemRow = memo(function ItemRow({
  index,
  field,
  control,
  onRemove,
  onAdd
}) {
  const { t } = useTranslation();
  
  return (
    <Grid container size={12} spacing={1}>
     
      {field.hasOwnProperty('taxName') && (
        <Grid size={{
          md: 6,
          sm: 3,
          xs: 12
        }}>
          <TextField 
            fullWidth 
            size="small" 
            label={t('Tax Name')} 
            name={`items.${index}.taxName`} 
          />
        </Grid>
      )}
      
      
      {!field.hasOwnProperty('taxName') && (
        <>
          <Grid size={{
            md: 3.8,
            sm: 4,
            xs: 12
          }}>
            <TextField 
              fullWidth 
              size="small" 
              label={t('Route')} 
              name={`items.${index}.route`} 
            />
          </Grid>

          <Grid size={{
            md: 2.2,
            sm: 4,
            xs: 12
          }}>
            <TextField 
              fullWidth 
              size="small" 
              label={t('Reg. Tag')} 
              name={`items.${index}.regTag`} 
            />
          </Grid>
        </>
      )}

     
      <Grid size={{
        md: 1.5,
        sm: 3,
        xs: 5
      }}>
        <TextField 
          fullWidth 
          size="small" 
          type="text" 
          label={t('Price')} 
          name={`items.${index}.price`}
          placeholder="0,00"
          onInput={(e) => {
            const formatted = formatNumber(e.target.value);
            if (formatted !== e.target.value) {
              e.target.value = formatted;
            }
          }}
          inputProps={numberInputProps}
        />
      </Grid>

      
      <Grid size={{
        md: 1,
        sm: 3,
        xs: 5
      }}>
        <TextField 
          fullWidth 
          size="small" 
          select
          label={t('VAT')} 
          name={`items.${index}.vat`}
          defaultValue=""
          SelectProps={{
            renderValue: (selected) => getVatDisplayValue(selected),
            MenuProps: {
              anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'left',
              },
              transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
              },
              getContentAnchorEl: null,
            }
          }}
        >
          {VAT_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

    
      <Grid size={{
        md: 1,
        sm: 3,
        xs: 5
      }}>
        <TextField 
          fullWidth 
          size="small" 
          type="text" 
          label={t('Discount')} 
          name={`items.${index}.discount`}
          placeholder="0,00"
          onInput={(e) => {
            const formatted = formatNumber(e.target.value);
            if (formatted !== e.target.value) {
              e.target.value = formatted;
            }
          }}
          inputProps={numberInputProps}
        />
      </Grid>

     
      <Grid size={{
        md: 1.5,
        sm: 3,
        xs: 5
      }}>
        <TextField 
          fullWidth 
          size="small" 
          type="text" 
          label={t('Amount')} 
          name={`items.${index}.amount`}
          placeholder="0,00"
          onInput={(e) => {
            const formatted = formatNumber(e.target.value);
            if (formatted !== e.target.value) {
              e.target.value = formatted;
            }
          }}
          inputProps={numberInputProps}
        />
      </Grid>
      
     
      <Grid size={{ md: 'grow', sm: 'grow', xs: 'grow' }}>
      </Grid>
      
      
      <Grid size="auto" sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
        <IconButton onClick={onAdd} color="primary" size="small">
          <Add />
        </IconButton>
        <IconButton onClick={onRemove} color="error" size="small">
          <Delete />
        </IconButton>
      </Grid>
    </Grid>
  );
});

export default ItemRow;