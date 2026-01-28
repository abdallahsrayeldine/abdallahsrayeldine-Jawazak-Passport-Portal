import * as React from 'react';
import { MenuItemLink, MenuProps } from 'react-admin';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import { Box, IconButton, Collapse } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const MyMenu: React.FC<MenuProps> = (props) => {
  const [openProfiles, setOpenProfiles] = React.useState(true);
  const [openApps, setOpenApps] = React.useState(true);

  return (
    <div>
      <Box display="flex" alignItems="center" px={2} py={1}>
        <Box component="span" sx={{ fontWeight: 'bold' }}>Admin</Box>
      </Box>

      <Box px={1} py={0.5} display="flex" alignItems="center">
        <IconButton size="small" onClick={() => setOpenProfiles(v => !v)}>
          {openProfiles ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <Box ml={0.5} fontWeight={600} sx={{ color: 'teal' }}>Profiles</Box>
      </Box>
      <Collapse in={openProfiles} timeout="auto" unmountOnExit>
        <MenuItemLink to="/all_signed_up_new_user_view" primaryText="All Profiles" leftIcon={<PersonIcon sx={{ color: 'teal' }} />} />
        <MenuItemLink to="/pending_signed_up_new_user_view" primaryText="Pending Profiles" leftIcon={<PersonIcon sx={{ color: 'orange' }} />} />
        <MenuItemLink to="/verified_signed_up_new_user_view" primaryText="Verified Profiles" leftIcon={<PersonIcon sx={{ color: 'green' }} />} />
        <MenuItemLink to="/rejected_signed_up_new_user_view" primaryText="Rejected Profiles" leftIcon={<PersonIcon sx={{ color: 'red' }} />} />
      </Collapse>

      <Box px={1} py={0.5} display="flex" alignItems="center" mt={1}>
        <IconButton size="small" onClick={() => setOpenApps(v => !v)}>
          {openApps ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
        <Box ml={0.5} fontWeight={600} sx={{ color: 'indigo' }}>Applications</Box>
      </Box>
      <Collapse in={openApps} timeout="auto" unmountOnExit>
        <MenuItemLink to="/all_application_submission_view" primaryText="All Applications" leftIcon={<DescriptionIcon sx={{ color: 'indigo' }} />} />
        <MenuItemLink to="/pending_admin_verification_application_submission_view" primaryText="Pending Applications" leftIcon={<DescriptionIcon sx={{ color: 'orange' }} />} />
        <MenuItemLink to="/accepted_application_submission_view" primaryText="Accepted Applications" leftIcon={<DescriptionIcon sx={{ color: 'green' }} />} />
        <MenuItemLink to="/rejected_application_submission_view" primaryText="Rejected Applications" leftIcon={<DescriptionIcon sx={{ color: 'red' }} />} />
      </Collapse>
    </div>
  );
};

export default MyMenu;
