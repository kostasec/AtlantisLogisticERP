import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles'; // MUI ICON COMPONENTS

import GitHub from '@mui/icons-material/GitHub';
import Twitter from '@mui/icons-material/Twitter';
import LinkedIn from '@mui/icons-material/LinkedIn';
import FacebookRounded from '@mui/icons-material/FacebookRounded'; // CUSTOM COMPONENTS

import Link from '@/components/link';
import FlexBox from '@/components/flexbox/FlexBox'; // STYLED COMPONENT

const StyledCard = styled(Card)(({
  theme
}) => ({
  gap: 16,
  padding: 24,
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
  return <StyledCard>
      <div>
        <Typography variant="body1" fontSize={20} fontWeight={500}>
          Atlantis Logistic Doo
        </Typography>

      </div>

    </StyledCard>;
}