import { memo, useCallback, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles'; // LAYOUT BASED HOOK

import useLayout from '@/layouts/layout-1/context/useLayout'; // CUSTOM COMPONENTS

import MultiLevelMenu from './MultiLevelMenu';
import Link from '@/components/link';
import FlexBetween from '@/components/flexbox/FlexBetween'; // CUSTOM ICON COMPONENT

import ArrowLeftToLine from '@/icons/duotone/ArrowLeftToLine'; // STYLED COMPONENTS

import { SidebarWrapper } from '../styles';
const TOP_HEADER_AREA = 120;
export default function DashboardSidebar() {
  const {
    sidebarCompact,
    handleSidebarCompactToggle
  } = useLayout();
  const [onHover, setOnHover] = useState(false); // ACTIVATE COMPACT WHEN TOGGLE BUTTON CLICKED AND NOT ON HOVER STATE

  const isCompact = useMemo(() => sidebarCompact && !onHover, [sidebarCompact, onHover]);
  const handleMouseEnter = useCallback(() => {
    setOnHover(true);
  }, []);
  const handleMouseLeave = useCallback(() => {
    if (sidebarCompact) setOnHover(false);
  }, [sidebarCompact]);
  return <SidebarWrapper compact={sidebarCompact} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <SidebarHeader isCompact={isCompact} onToggle={handleSidebarCompactToggle} />
      <SidebarContent isCompact={isCompact} />
    </SidebarWrapper>;
}
const SidebarContent = memo(({
  isCompact
}) => <Box sx={{
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
  px: 3,
  pt: 0.3,
  pb: 3,
  '&::-webkit-scrollbar': {
    width: '6px'
  },
  '&::-webkit-scrollbar-track': {
    background: theme => theme.palette.mode === 'dark' 
      ? 'rgba(255,255,255,0.1)' 
      : 'rgba(0,0,0,0.1)',
    borderRadius: '3px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme => theme.palette.mode === 'dark' 
      ? 'rgba(255,255,255,0.3)' 
      : 'rgba(0,0,0,0.3)',
    borderRadius: '3px',
    '&:hover': {
      background: theme => theme.palette.mode === 'dark' 
        ? 'rgba(255,255,255,0.5)' 
        : 'rgba(0,0,0,0.5)'
    }
  }
}}>
    <MultiLevelMenu sidebarCompact={isCompact} />
  </Box>);
const SidebarHeader = memo(({
  isCompact,
  onToggle
}) => <FlexBetween padding="2.5rem 1.5rem 1.5rem 2.5rem" height={TOP_HEADER_AREA} sx={{ mb: '1.5rem' }}>
    <Logo />
    {!isCompact && <CollapseButton onClick={onToggle} />}
  </FlexBetween>);
const CollapseButton = memo(({
  onClick
}) => <IconButton onClick={onClick}>
   
  </IconButton>);
const Logo = memo(() => {
  const theme = useTheme();
  const logoSrc = theme.palette.mode === 'dark' ? '/static/logo/logo-white.png' : '/static/logo/logo.png';

  return <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
      <Link href="/" style={{ display: 'inline-flex' }}>
        <Box component="img" src={logoSrc} alt="logo" sx={{ width: 156, height: 'auto', display: 'block' }} />
      </Link>
    </Box>;
});