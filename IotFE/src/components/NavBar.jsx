import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Toolbar variant="dense" sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <div className="flex flex-grow justify-between">
          <Link to="/dashboard" className="text-white hover:text-gray-200">
            Dashboard
          </Link>
          <Link to="/datasensor-history" className="text-white hover:text-gray-200">
            Datasensor History
          </Link>
          <Link to="/action-history" className="text-white hover:text-gray-200">
            Action History
          </Link>
        </div>
        <div className="flex items-center ml-4">
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleClick}
            color="inherit"
          >
            <AccountCircleIcon style={{ fontSize: 40 }} />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <Link to="/profile" className="text-blue-600 hover:text-blue-800">Profile</Link>
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
