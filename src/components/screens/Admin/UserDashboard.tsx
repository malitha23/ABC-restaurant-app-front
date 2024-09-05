import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, List, ListItem, ListItemText, Divider, Collapse, IconButton } from '@mui/material';
import Navbar from '../../Navbar/Navbar';
import axios from 'axios';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  role: string;
  status: boolean;
}

interface OrderItem {
  id: number;
  order_id: number;
  item_name: string;
  item_price: string;
  item_quantity: number;
}

interface Order {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  address: string;
  phone_number: string;
  email: string | null;
  delivery_option: string;
  payment_option: string;
  total_amount: string;
  created_at: string;
  status: string;
  OrderItems: OrderItem[];
}

const UserDashboard: React.FC = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);
  const [reservations, setReservations] = useState<any[]>([]); // Adjust type as needed


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await axios.get<User>('http://localhost:3000/api/user/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData(response.data);
      } catch (err) {
        setError('Error fetching user data.');
      }
    };

    const fetchUserOrders = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await axios.get<Order[]>('http://localhost:3000/api/ordersRoutes/orders', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(response.data);
      } catch (error) {
        setError('Error fetching orders.');
      }
    };

    const fetchUserReservations = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const response = await axios.get<Order[]>('http://localhost:3000/api/reservations/userreservations', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setReservations(response.data);
      } catch (error) {
        setError('Error fetching orders.');
      }
    };

    const fetchData = async () => {
      try {
        await Promise.all([fetchUserData(), fetchUserOrders(), fetchUserReservations()]);
      } catch (error) {
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const handleExpandClick = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const cardStyle = {
    border: userData?.status === false ? '2px solid red' : 'none',
    padding: '16px',
  };

  return (
    <div>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {userData?.first_name}!
        </Typography>

        {userData?.status === false && (
          <Typography
            variant="h6"
            color="error"
            sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold' }}
          >
            Your account is blocked, please contact admin.
          </Typography>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={cardStyle}>
              <CardContent>
                <Typography variant="h6">User Details</Typography>
                <Typography variant="body1">Username: {userData?.username}</Typography>
                <Typography variant="body1">Email: {userData?.email}</Typography>
                <Typography variant="body1">First Name: {userData?.first_name}</Typography>
                <Typography variant="body1">Last Name: {userData?.last_name}</Typography>
                <Typography variant="body1">Phone Number: {userData?.phone_number}</Typography>
                <Typography variant="body1">Address: {userData?.address}</Typography>
                <Typography variant="body1">Role: {userData?.role}</Typography>
                <Typography variant="body1">Status: {userData?.status ? 'Active' : 'Inactive'}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Reservations</Typography>
                {reservations.length > 0 ? (
                  <Box sx={{ width: '100%' }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr>
                              <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Reservation Date</th>
                              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Number of People</th>
                              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Service Type</th>
                              <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reservations.map((reservation) => (
                              <tr key={reservation.id}>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{reservation.id}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(reservation.reservation_date).toLocaleString()}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{reservation.num_of_people}</td>
                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{reservation.service_type}</td>
                                <td
                                  style={{
                                    border: '1px solid #ddd',
                                    padding: '8px',
                                    fontWeight:'bold',
                                    color: reservation.status === 'pending'
                                      ? '#ff9100' // Orange for pending
                                      : reservation.status === 'rejected'
                                        ? '#f44336' // Red for rejected
                                        : reservation.status === 'approved'
                                          ? '#4caf50' // Green for approved
                                          : 'inherit' // Default color if status is not matched
                                  }}
                                >
                                  {reservation.status}
                                </td>

                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </Grid>
                    </Grid>
                  </Box>
                ) : (
                  <Typography>No reservations found.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>


          {/* Orders Section */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Orders</Typography>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div key={order.id}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Typography
                            variant="body1"
                            sx={{
                              color: order.status === 'pending' ? 'orange' :
                                order.status === 'confirmed' ? 'green' :
                                  order.status === 'rejected' ? 'red' :
                                    'inherit'
                            }}
                          >
                            Order ID: {order.id} {order.status} {new Date(order.created_at).toLocaleDateString()}
                          </Typography>

                          <IconButton onClick={() => handleExpandClick(order.id)}>
                            {expandedOrderId === order.id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                          </IconButton>
                        </Box>
                        <Collapse in={expandedOrderId === order.id}>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="body2"><strong>Total Amount:</strong> {order.total_amount}</Typography>
                          <Typography variant="body2"><strong>Status:</strong> {order.status}</Typography>
                          <Typography variant="body2"><strong>Delivery Option:</strong> {order.delivery_option}</Typography>
                          <Typography variant="body2"><strong>Payment Option:</strong> {order.payment_option}</Typography>
                          <Typography variant="body2"><strong>Created At:</strong> {new Date(order.created_at).toLocaleDateString()}</Typography>
                          <List>
                            {order.OrderItems.map((item) => (
                              <ListItem key={item.id}>
                                <ListItemText
                                  primary={item.item_name}
                                  secondary={`Quantity: ${item.item_quantity}, Price: ${item.item_price}`}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Collapse>
                      </CardContent>
                    </div>
                  ))
                ) : (
                  <Typography>No orders found.</Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default UserDashboard;
