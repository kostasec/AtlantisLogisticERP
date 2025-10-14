import Box from '@mui/material/Box';

export default function Tabs({ children, buttons, ButtonsContainer }) {
    const ButtonsWrap = ButtonsContainer || (({ children: c }) => <Box mb={2}>{c}</Box>);

    return (
        <>
            <ButtonsWrap>{buttons}</ButtonsWrap>
            <Box>{children}</Box>
        </>
    );
}