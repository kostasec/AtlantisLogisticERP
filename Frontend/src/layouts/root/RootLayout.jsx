import Box from '@mui/material/Box';
import Footer from '@/components/footer';
export default function RootLayout({
  children
}) {
  return <Box sx={theme => ({
    backgroundColor: 'white',
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.background.default
    })
  })}>
      {children}
      <Footer />
    </Box>;
}