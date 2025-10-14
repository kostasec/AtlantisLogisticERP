import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';

export default function TabButton({ children, isSelected, ...props }) {
    return (
        <ListItem disablePadding sx={{ display: 'inline', mr: 1 }}>
            <Button
                size="small"
                variant={isSelected ? 'contained' : 'outlined'}
                color={isSelected ? 'primary' : 'inherit'}
                {...props}
            >
                {children}
            </Button>
        </ListItem>
    );
}