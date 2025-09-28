import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
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

export default function EntityGridCard({ avatar, title, subtitle, fields = [] }) {
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
    </StyledRoot>
  );
}
