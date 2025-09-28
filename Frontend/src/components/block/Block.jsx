import Typography from '@mui/material/Typography'; // STYLED COMPONENT

import { StyledCard } from './styles'; // ==============================================================

// ==============================================================
export default function Block({
  ref,
  title,
  children,
  bgTransparent = false,
  ...props
}) {
  return <StyledCard ref={ref} isTransparent={bgTransparent} {...props}>
      <Typography variant="body1" fontSize={18} fontWeight={600} sx={{
      mb: 3
    }}>
        {title}
      </Typography>

      {children}
    </StyledCard>;
}