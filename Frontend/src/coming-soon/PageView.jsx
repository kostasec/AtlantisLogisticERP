import { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography'; // CUSTOM COMPONENTS

import SectionTitle from '@/components/section-title';
import GradientBackground from '@/components/gradient-background'; // STYLED COMPONENT

import { MainContent } from './styles';
export default function ComingSoonPageView() {
  const [email, setEmail] = useState('');
  const handleSubmit = useCallback(() => {
    console.log(email);
  }, [email]);
  return <GradientBackground>
      <Container>
        <MainContent>
          <SectionTitle centered title="Coming Soon!" />
          <Typography variant="body1" fontSize={18} color="text.secondary">
          </Typography>



        </MainContent>
      </Container>
    </GradientBackground>;
}