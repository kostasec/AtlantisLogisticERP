import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router'; // MUI

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography'; // CUSTOM COMPONENTS

import PopoverLayout from './_PopoverLayout';
import FlexBox from '@/components/flexbox/FlexBox';
import AvatarLoading from '@/components/avatar-loading'; // CUSTOM DEFINED HOOK

import useAuth from '@/hooks/useAuth'; // STYLED COMPONENTS

const Text = styled('p')(({
  theme
}) => ({
  fontSize: 13,
  display: 'block',
  cursor: 'pointer',
  padding: '5px 1rem',
  '&:hover': {
    backgroundColor: theme.palette.action.hover
  }
}));
const AVATAR_STYLES = {
  width: 35,
  height: 35
};
export default memo(function ProfilePopover() {
  const navigate = useNavigate();
  const {
    logout,
    user
  } = useAuth();
  const displayName = user?.name ?? 'Guest User';
  const email = user?.email ?? 'guest@example.com';
  const avatarSrc = user?.avatar || '/static/avatar/020-man-4.svg';
  const SELECT_BUTTON = <AvatarLoading alt={displayName} src={avatarSrc} percentage={100} sx={AVATAR_STYLES} />;
  const TITLE = <FlexBox alignItems="center" gap={1} p={2} pt={1}>
      <Avatar src={avatarSrc} alt={displayName} sx={AVATAR_STYLES} />

      <div>
        <Typography variant="body2" fontWeight={500}>
          {displayName}
        </Typography>

        <Typography variant="body2" color="text.secondary" fontSize={12}>
          {email}
        </Typography>
      </div>
    </FlexBox>;
  const RENDER_CONTENT = useCallback(onClose => {
    const handleMenuItem = path => () => {
      navigate(path);
      onClose();
    };

    return <Box pt={1}>
          <Text onClick={logout}>Sign Out</Text>
        </Box>;
  }, [navigate, logout]);
  return <PopoverLayout maxWidth={230} minWidth={200} showMoreButton={false} selectButton={SELECT_BUTTON} title={TITLE} renderContent={RENDER_CONTENT} />;
});