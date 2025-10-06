import { useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import ItemRow from './ItemRow';


export default function InvoiceItems({ control }) {
  const { t } = useTranslation();
  const {
    fields,
    append,
    remove
  } = useFieldArray({
    name: 'items',
    control
  });


  const handleAddItem = () => {
    append({
      taxName: '',
      price: '',
      vat: '',
      discount: '',
      amount: ''
    });
  };


  const handleRemoveItem = (index) => {
    remove(index);
  };

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack spacing={3}>
          <Typography variant="subtitle1" fontWeight={500}>
            {t('Item Information')}
          </Typography>
          
          <Grid container spacing={2} alignItems="flex-end">
            {fields.map((field, index) => (
              <ItemRow 
                key={field.id} 
                index={index} 
                field={field} 
                control={control} 
                onRemove={() => handleRemoveItem(index)} 
                onAdd={handleAddItem}
              />
            ))}
          </Grid>
        </Stack>
      </Grid>
    </Grid>
  );
}