import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormContext } from 'react-hook-form';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { TextField } from '@/components/form';


const ADDITIONAL_INFO_OPTIONS = [
  { key: 'orderNumber', label: 'Order Number', placeholder: 'Enter order number' },
  { key: 'contractNumber', label: 'Contract Number', placeholder: 'Enter contract number' },
  { key: 'specialInstructions', label: 'Special Instructions', placeholder: 'Enter special instructions' }
];


export default function AdditionalInformation() {
  const { t } = useTranslation();
  const [activeFields, setActiveFields] = useState(new Set());
  const { setValue } = useFormContext();


  const handleLabelClick = (fieldKey) => {
    setActiveFields(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fieldKey)) {
     
        newSet.delete(fieldKey);
      } else {
     
        newSet.add(fieldKey);
      }
      return newSet;
    });
  };


  const activeOptions = ADDITIONAL_INFO_OPTIONS.filter(
    option => activeFields.has(option.key)
  );

  return (
    <Grid container spacing={3}>
      <Grid size={12}>
        <Stack spacing={3}>
          <Typography variant="subtitle1" fontWeight={500}>
            {t('Additional Information')}
          </Typography>
          
        
          <Box>

            <Stack spacing={2}>
              {ADDITIONAL_INFO_OPTIONS.map((option) => {
                const isActive = activeFields.has(option.key);
                return (
                  <Box key={option.key}>
                  
                    <Box
                      onClick={() => handleLabelClick(option.key)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        padding: '8px 0',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          '& .label-text': {
                            color: 'primary.dark',
                            textDecoration: 'underline'
                          },
                          '& .arrow-icon': {
                            transform: isActive ? 'none' : 'translateX(4px)'
                          }
                        },
                        userSelect: 'none'
                      }}
                    >
                     
                      {isActive ? (
                        <KeyboardArrowDownIcon 
                          className="arrow-icon"
                          sx={{ 
                            fontSize: 20, 
                            color: 'text.secondary',
                            transition: 'all 0.2s ease'
                          }} 
                        />
                      ) : (
                        <KeyboardArrowRightIcon 
                          className="arrow-icon"
                          sx={{ 
                            fontSize: 20, 
                            color: 'primary.main',
                            transition: 'all 0.2s ease'
                          }} 
                        />
                      )}
                      
                      
                      <Typography
                        className="label-text"
                        variant="body1"
                        sx={{
                          color: isActive ? 'text.secondary' : 'primary.main',
                          fontWeight: isActive ? 'normal' : 500,
                          opacity: isActive ? 0.6 : 1,
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {t(option.label)}
                      </Typography>
                    </Box>
                    
                    
                    {isActive && (
                      <Box sx={{ mt: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          name={`additionalInfo.${option.key}`}
                          label={t(option.label)}
                          placeholder={t(option.placeholder)}
                        />
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Stack>
          </Box>


        </Stack>
      </Grid>
    </Grid>
  );
}