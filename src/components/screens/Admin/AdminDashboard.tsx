import React from 'react';
import { Box, Typography, Grid, Paper, AppBar, Toolbar, IconButton, Button } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon } from '@mui/icons-material';

const AdminDashboard = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Box sx={{ width: 240, bgcolor: 'grey.800', height: '100vh', color: 'white', p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Admin Panel
        </Typography>
        <Button fullWidth color="inherit">Dashboard</Button>
        <Button fullWidth color="inherit">Users</Button>
        <Button fullWidth color="inherit">Reports</Button>
        <Button fullWidth color="inherit">Settings</Button>
      </Box>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Admin Dashboard
            </Typography>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
            <Button color="inherit">Logout</Button>
          </Toolbar>
        </AppBar>

        {/* Dashboard Content */}
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">150</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Sales Today</Typography>
              <Typography variant="h4">$1,200</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Pending Orders</Typography>
              <Typography variant="h4">20</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
