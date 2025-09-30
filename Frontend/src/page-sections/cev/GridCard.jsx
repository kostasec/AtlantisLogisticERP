import { useState, useCallback } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import { styled } from '@mui/material/styles';

const StyledRoot = styled('div')(({ theme }) => ({
  padding: '1.5rem',
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
  '.icon': {
    fontSize: 16,
    color: theme.palette.grey[500]
  }
}));

export default function EntityGridCard({
  title,
  subtitle,
  fields = [],
  contactPerson,
  contactIcons = {}
}) {
  const [showContact, setShowContact] = useState(false);

  const toggleContact = useCallback(() => {
    setShowContact(prev => !prev);
  }, []);

  return (
    <StyledRoot>
      <Stack direction="row" alignItems="center" spacing={1}>
        <div>
          <Typography variant="body2" fontWeight={500}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" fontSize={12} color="grey.500">
              {subtitle}
            </Typography>
          )}
        </div>
      </Stack>

      {fields.map((field, idx) => (
        <Stack key={idx} direction="row" alignItems="center" spacing={1} mt={idx === 0 ? 2 : 1}>
          {field.icon && <field.icon className="icon" />}
          <Typography variant="body2" color="grey.500">
            {field.label ? `${field.label}: ` : ''}
            {field.value}
          </Typography>
        </Stack>
      ))}

      {contactPerson && (
        <>
          <Button
            variant="text"
            size="small"
            sx={{ mt: 2, px: 0 }}
            onClick={toggleContact}
          >
            {showContact ? 'Hide Contact Person' : 'Show Contact Person'}
          </Button>

          <Collapse in={showContact} timeout="auto" unmountOnExit>
            <Stack spacing={0.5} mt={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                {contactIcons.name && <contactIcons.name className="icon" />}
                <Typography variant="body2" color="text.primary">
                  {contactPerson.name || '-'}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                {contactIcons.description && <contactIcons.description className="icon" />}
                <Typography variant="body2" color="text.secondary">
                  {contactPerson.description || '-'}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                {contactIcons.phoneNumber && <contactIcons.phoneNumber className="icon" />}
                <Typography variant="body2" color="text.primary">
                  {contactPerson.phoneNumber || '-'}
                </Typography>
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                {contactIcons.email && <contactIcons.email className="icon" />}
                <Typography variant="body2" color="text.primary">
                  {contactPerson.email || '-'}
                </Typography>
              </Stack>
            </Stack>
          </Collapse>
        </>
      )}
    </StyledRoot>
  );
}
