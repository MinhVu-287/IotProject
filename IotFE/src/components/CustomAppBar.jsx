import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import Dashboard2 from '../pages/dashboard2';

const NAV_ITEMS = [
  { title: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { title: 'Data Sensor History', icon: <HistoryIcon />, path: '/data-sensor-history' },
  { title: 'Action History', icon: <HistoryIcon />, path: '/action-history' },
  { title: 'Profile', icon: <HistoryIcon />, path: '/profile'},
  { title: 'Dashboard 2', icon: <HistoryIcon />, path: '/dasboard2'}
];

function CustomAppBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false); // State to open/close drawer
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle drawer toggle (open/close)
  const toggleDrawer = (open) => () => {
    setMobileOpen(open);
  };

  // Handle navigation and close the drawer after clicking on the menu item
  const handleNavigation = (path) => {
    navigate(path);
    setMobileOpen(false); // Close drawer after navigation
  };

  // Drawer content with navigation items
  const drawer = (
    <Box
      onClick={toggleDrawer(false)}  // Close drawer on item click
      onKeyDown={toggleDrawer(false)}  // Close drawer on keyboard events
      sx={{ width: 250 }}  // Drawer width
    >
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItem button key={item.title} onClick={() => handleNavigation(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar with Menu Icon */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer(true)}  // Open drawer when menu icon clicked
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {NAV_ITEMS.find(item => item.path === location.pathname)?.title || 'Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Drawer that slides from the left when menu icon is clicked */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}  // Bind drawer open state to mobileOpen
        onClose={toggleDrawer(false)}  // Close drawer on click outside
        ModalProps={{
          keepMounted: true,  // Improve performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Add spacing between the AppBar and content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {/* Content goes here */}
      </Box>
    </Box>
  );
}

CustomAppBar.propTypes = {
  window: PropTypes.func,
};

export default CustomAppBar;
