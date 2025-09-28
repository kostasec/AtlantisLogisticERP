// CUSTOM ICON COMPONENT
import SearchIcon from '@/icons/SearchIcon'; // STYLED COMPONENT

import { StyledInputBase } from './styles'; // ========================================================================

// ========================================================================
export default function SearchInput({
  ref,
  bordered = true,
  ...props
}) {
  // SEARCH ICON
  const ADORNMENT = <SearchIcon sx={{
    mr: 1,
    fontSize: 18,
    color: 'text.secondary'
  }} />;
  return <StyledInputBase ref={ref} border={bordered} startAdornment={ADORNMENT} {...props} />;
}