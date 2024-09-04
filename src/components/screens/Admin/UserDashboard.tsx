import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';

const UserDashboard = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, User!
      </Typography>

      {/* Product List */}
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={`https://source.unsplash.com/random?product-${item}`}
                alt={`Product ${item}`}
              />
              <CardContent>
                <Typography variant="h5">Product {item}</Typography>
                <Typography variant="body2">Product description goes here.</Typography>
                <Button variant="contained" color="primary" sx={{ mt: 2 }}>
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserDashboard;
