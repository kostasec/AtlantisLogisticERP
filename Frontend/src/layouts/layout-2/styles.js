import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import ButtonBase from '@mui/material/ButtonBase';
import { styled } from '@mui/material/styles'; // UTILS

import { SECONDARY_SIDEBAR_GAP, SECONDARY_SIDEBAR_WIDTH } from '@/utils/constants'; // ==============================================================

// ==============================================================
// FOR DASHBOARD HEADER
export const DashboardHeaderRoot = styled(AppBar)(({
  theme
}) => ({
  boxShadow: 'none',
  paddingTop: '1rem',
  paddingBottom: '1rem',
  backgroundImage: 'none',
  backdropFilter: 'blur(6px)',
  backgroundColor: 'transparent',
  color: theme.palette.text.primary
}));
export const StyledToolBar = styled(Toolbar)({
  '@media (min-width: 0px)': {
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: 'auto'
  }
}); // FOR SIDEBAR

export const MainMenu = styled('div')(({
  theme
}) => ({
  left: 0,
  width: 80,
  height: '100%',
  position: 'fixed',
  boxShadow: `${theme.shadows[4]}, 0 12px 32px rgba(15, 23, 42, 0.12), 0 4px 12px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(15, 23, 42, 0.08)`,
  transition: 'left 0.3s ease',
  zIndex: theme.zIndex.drawer + 11,
  backgroundColor: theme.palette.grey[100],
  backgroundImage: `linear-gradient(180deg, ${theme.palette.common.white} 0%, ${theme.palette.grey[50]} 25%, ${theme.palette.grey[100]} 55%, ${theme.palette.grey[200]} 80%, ${theme.palette.grey[300]} 100%)`,
  borderRight: `1px solid ${theme.palette.grey[300]}`,
  [theme.breakpoints.down('md')]: {
    left: -80
  },
  '.navigation-list': {
    paddingInline: '1rem'
  },
  ...theme.applyStyles('dark', {
    boxShadow: 'none',
    borderRight: `1px solid ${theme.palette.grey[800]}`,
    backgroundImage: `linear-gradient(180deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`
  })
}));
export const SecondarySideBar = styled('div', {
  shouldForwardProp: prop => prop !== 'show'
})(({
  theme,
  show
}) => ({
  height: '100%',
  position: 'fixed',
  boxShadow: theme.shadows[1],
  width: SECONDARY_SIDEBAR_WIDTH,
  zIndex: theme.zIndex.drawer + 1,
  transition: 'left 0.3s ease-in-out',
  left: show ? 80 : -(SECONDARY_SIDEBAR_WIDTH + SECONDARY_SIDEBAR_GAP),
  backgroundColor: theme.palette.grey[100],
  backgroundImage: `linear-gradient(180deg, ${theme.palette.common.white} 0%, ${theme.palette.grey[50]} 25%, ${theme.palette.grey[100]} 55%, ${theme.palette.grey[200]} 80%, ${theme.palette.grey[300]} 100%)`,
  borderLeft: `1px solid ${theme.palette.grey[200]}`,
  boxShadow: `${theme.shadows[3]}, 0 12px 32px rgba(15, 23, 42, 0.12), 0 4px 12px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(15, 23, 42, 0.08)`,
  ...theme.applyStyles('dark', {
    boxShadow: 'none',
    borderLeft: `1px solid ${theme.palette.grey[800]}`,
    backgroundImage: `linear-gradient(180deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`
  })
}));
export const LogoBox = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: '1rem',
  marginBottom: '1.25rem',
  justifyContent: 'center'
}));
export const Dot = styled('div')({
  width: 4,
  height: 4,
  marginRight: 10,
  borderRadius: '50%'
});
export const SubMenuItem = styled('div', {
  shouldForwardProp: prop => prop !== 'active'
})(({
  theme,
  active
}) => ({
  display: 'flex',
  cursor: 'pointer',
  alignItems: 'center',
  padding: '0.6rem 1.2rem',
  '.title': {
    color: active ? theme.palette.primary.main : theme.palette.text.secondary
  },
  '.dot': {
    backgroundColor: active ? theme.palette.primary.main : theme.palette.text.secondary
  },
  '&:hover': {
    backgroundColor: theme.palette.primary[25],
    '.title': {
      color: theme.palette.primary.main
    },
    '.dot': {
      backgroundColor: theme.palette.primary.main
    },
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.divider
    })
  }
}));
export const MobileSidebarWrapper = styled('div', {
  shouldForwardProp: prop => prop !== 'show'
})(({
  theme,
  show
}) => ({
  '.main-list': {
    width: 80,
    height: '100%',
    position: 'fixed',
  boxShadow: `${theme.shadows[3]}, 0 12px 32px rgba(15, 23, 42, 0.12), 0 4px 12px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(15, 23, 42, 0.08)`,
    transition: 'transform 0.3s',
    zIndex: theme.zIndex.drawer + 3,
  backgroundColor: theme.palette.grey[100],
  backgroundImage: `linear-gradient(180deg, ${theme.palette.common.white} 0%, ${theme.palette.grey[50]} 25%, ${theme.palette.grey[100]} 55%, ${theme.palette.grey[200]} 80%, ${theme.palette.grey[300]} 100%)`,
    borderRight: `1px solid ${theme.palette.grey[300]}`,
    transform: show ? 'translateX(0)' : 'translateX(-100%)',
    '.navigation-list': {
      paddingInline: '1rem',
      paddingBottom: '.75rem'
    }
  },
  '.backdrop': {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'fixed',
    zIndex: theme.zIndex.drawer,
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  '.secondary-list-wrapper': {
    width: 250,
    height: '100%',
    position: 'fixed',
    left: show ? 0 : -300,
    transition: 'left 0.3s',
    zIndex: theme.zIndex.drawer + 1,
  backgroundColor: theme.palette.grey[100],
  backgroundImage: `linear-gradient(180deg, ${theme.palette.common.white} 0%, ${theme.palette.grey[50]} 25%, ${theme.palette.grey[100]} 55%, ${theme.palette.grey[200]} 80%, ${theme.palette.grey[300]} 100%)`,
    borderLeft: `1px solid ${theme.palette.grey[200]}`,
    '.list-inner': {
      height: '100%',
      marginLeft: '80px',
      position: 'relative',
      width: 'calc(100% - 80px)'
    }
  },
  ...theme.applyStyles('dark', {
    '.main-list': {
      boxShadow: 'none',
      borderRight: `1px solid ${theme.palette.grey[800]}`,
      backgroundImage: `linear-gradient(180deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`
    },
    '.secondary-list-wrapper': {
      backgroundImage: `linear-gradient(180deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`,
      borderLeft: `1px solid ${theme.palette.grey[800]}`
    }
  })
}));
export const NavItemButton = styled(ButtonBase, {
  shouldForwardProp: prop => prop !== 'active'
})(({
  theme,
  active
}) => ({
  height: 48,
  width: '100%',
  marginBottom: 8,
  borderRadius: '8px',
  padding: '10px 10px',
  '.MuiSvgIcon-root': {
    fontSize: 20,
    color: active ? theme.palette.primary.main : theme.palette.text.secondary
  },
  ...(active && {
    backgroundColor: theme.palette.primary[25],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.action.hover
    })
  }),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
    '.MuiSvgIcon-root': {
      color: theme.palette.primary.main
    }
  }
}));