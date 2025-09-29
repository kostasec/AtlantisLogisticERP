import { Fragment } from 'react'; // MUI

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography'; // CUSTOM COMPONENTS

import FlexRowAlign from '@/components/flexbox/FlexRowAlign'; // =========================================================================

// =========================================================================
export default function Layout({
  children
}) {
  return <Grid container sx={{ minHeight: '100vh' }}>
      <Grid size={12}>
        <FlexRowAlign sx={{ backgroundColor: 'background.paper', height: '100%' }}>
          {children}
        </FlexRowAlign>
      </Grid>
    </Grid>;
}