import Box from '@mui/material/Box'; // STYLED COMPONENT

import { Shape, Text } from './styles'; // ==============================================================

// ==============================================================
export default function SectionTitle({
  title,
  fontSize = 36,
  centered = false,
  children,
  ...props
}) {
  return (
    <Box mb={4} {...props}>
      <Text centered={centered} fontSize={fontSize}>
        {title}
      </Text>

      <Shape centered={centered} />

      {/* render children so pages using SectionTitle can pass content */}
      {children}
    </Box>
  );
}