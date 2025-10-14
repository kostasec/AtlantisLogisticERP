import Typography from '@mui/material/Typography';


export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <div>
      <Typography variant="body1" fontSize={20} fontWeight={500} color="grey.500" textAlign='center'>
        © Atlantis Logistic {year}.
      </Typography>
    </div>
  );
}
