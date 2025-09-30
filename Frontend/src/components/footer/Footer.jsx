import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  gap: 16,
  padding: 24,
  margin: theme.spacing(2, 0, 1),
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  '& .buttons': {
    textAlign: 'right',
    marginBottom: '1rem'
  },
  '& .link': {
    fontSize: 14,
    transition: 'color 300ms',
    color: theme.palette.text.secondary,
    '&:hover': {
      color: theme.palette.text.primary
    }
  },
  [theme.breakpoints.down(635)]: {
    textAlign: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    '& .buttons': {
      textAlign: 'center'
    }
  }
}));

export default function Footer() {
  return (
    <StyledCard>
      <div>
        <Typography variant="body1" fontSize={20} fontWeight={500} color="grey.500">
          Atlantis Logistic Doo
        </Typography>
      </div>
    </StyledCard>
  );
}
