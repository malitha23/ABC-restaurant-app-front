import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Tabs, Tab } from '@mui/material';
import axios from 'axios';
import './StaffDashboard.css';

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

interface Reservation {
  id: number;
  reservation_date: string;
  num_of_people: number;
  service_type: string;
  status: string;
}

const StaffDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchUserOrders(), fetchUserReservations()]);
      } catch (error) {
        setError('Error fetching data.');
      }
    };

    fetchData();
  }, []);

  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get<Order[]>('http://localhost:3000/api/ordersRoutes/stafforders', {
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
      const response = await axios.get<Reservation[]>('http://localhost:3000/api/reservations/starfreservations', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReservations(response.data);
    } catch (error) {
      setError('Error fetching reservations.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Adjust the redirect URL as needed
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.put(`http://localhost:3000/api/ordersRoutes/update/${orderId}`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setOrders(prevOrders => prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      ));
      fetchUserOrders();
    } catch (error) {
      setError('Error updating order status.');
    }
  };

  const handleUpdateReservationStatus = async (reservationId: number, status: string) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.put(`http://localhost:3000/api/reservations/updatereservation/${reservationId}`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReservations(prevReservations => prevReservations.map(reservation =>
        reservation.id === reservationId ? { ...reservation, status } : reservation
      ));
      fetchUserReservations();
    } catch (error) {
      setError('Error updating reservation status.');
    }
  };

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const confirmedOrders = orders.filter(order => order.status === 'confirmed');
  const rejectedOrders = orders.filter(order => order.status === 'rejected');

  const pendingReservations = reservations.filter(reservation => reservation.status === 'pending');
  const confirmedReservations = reservations.filter(reservation => reservation.status === 'confirmed');
  const rejectedReservations = reservations.filter(reservation => reservation.status === 'rejected');

  return (
    <div>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Staff Dashboard
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Tabs */}
        <Tabs
          value={tabIndex}
          onChange={(event, newValue) => setTabIndex(newValue)}
          aria-label="tabs"
          sx={{ mb: 3 }}
        >
          <Tab label="Orders" />
          <Tab label="Reservations" />
        </Tabs>

        {/* Conditional Rendering */}
        {tabIndex === 0 && (
          <>
            {/* Pending Orders Table */}
            <Typography variant="h6" gutterBottom>
              Pending Orders
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{`${order.first_name} ${order.last_name}`}</TableCell>
                      <TableCell>
                        {order.OrderItems.map(item => (
                          <div key={item.id}>{item.item_name} (x{item.item_quantity})</div>
                        ))}
                      </TableCell>
                      <TableCell>{order.total_amount}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')}
                          sx={{ mr: 1 }}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleUpdateOrderStatus(order.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Confirmed Orders Table */}
            <Typography variant="h6" gutterBottom>
              Confirmed Orders
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {confirmedOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{`${order.first_name} ${order.last_name}`}</TableCell>
                      <TableCell>
                        {order.OrderItems.map(item => (
                          <div key={item.id}>{item.item_name} (x{item.item_quantity})</div>
                        ))}
                      </TableCell>
                      <TableCell>{order.total_amount}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Rejected Orders Table */}
            <Typography variant="h6" gutterBottom>
              Rejected Orders
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>Created At</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rejectedOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{`${order.first_name} ${order.last_name}`}</TableCell>
                      <TableCell>
                        {order.OrderItems.map(item => (
                          <div key={item.id}>{item.item_name} (x{item.item_quantity})</div>
                        ))}
                      </TableCell>
                      <TableCell>{order.total_amount}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {tabIndex === 1 && (
          <>
            {/* Pending Reservations Table */}
            <Typography variant="h6" gutterBottom>
              Pending Reservations
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reservation ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Number of People</TableCell>
                    <TableCell>Service Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingReservations.map(reservation => (
                    <TableRow key={reservation.id}>
                      <TableCell>{reservation.id}</TableCell>
                      <TableCell>{new Date(reservation.reservation_date).toLocaleDateString()}</TableCell>
                      <TableCell>{reservation.num_of_people}</TableCell>
                      <TableCell>{reservation.service_type}</TableCell>
                      <TableCell>{reservation.status}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => handleUpdateReservationStatus(reservation.id, 'confirmed')}
                          sx={{ mr: 1 }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleUpdateReservationStatus(reservation.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Confirmed Reservations Table */}
            <Typography variant="h6" gutterBottom>
              Confirmed Reservations
            </Typography>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reservation ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Number of People</TableCell>
                    <TableCell>Service Type</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {confirmedReservations.map(reservation => (
                    <TableRow key={reservation.id}>
                      <TableCell>{reservation.id}</TableCell>
                      <TableCell>{new Date(reservation.reservation_date).toLocaleDateString()}</TableCell>
                      <TableCell>{reservation.num_of_people}</TableCell>
                      <TableCell>{reservation.service_type}</TableCell>
                      <TableCell sx={{
                        color: reservation.status === 'pending'
                          ? '#ff9100' // Orange for pending
                          : reservation.status === 'rejected'
                            ? '#f44336' // Red for rejected
                            : reservation.status === 'approved'
                              ? '#4caf50' // Green for approved
                              : 'inherit' // Default color if status is not matched
                      }}>{reservation.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Rejected Reservations Table */}
            <Typography variant="h6" gutterBottom>
              Rejected Reservations
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reservation ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Number of People</TableCell>
                    <TableCell>Service Type</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rejectedReservations.map(reservation => (
                    <TableRow key={reservation.id}>
                      <TableCell>{reservation.id}</TableCell>
                      <TableCell>{new Date(reservation.reservation_date).toLocaleDateString()}</TableCell>
                      <TableCell>{reservation.num_of_people}</TableCell>
                      <TableCell>{reservation.service_type}</TableCell>
                      <TableCell sx={{
                        color: reservation.status === 'pending'
                          ? '#ff9100' // Orange for pending
                          : reservation.status === 'rejected'
                            ? '#f44336' // Red for rejected
                            : reservation.status === 'approved'
                              ? '#4caf50' // Green for approved
                              : 'inherit' // Default color if status is not matched
                      }}>{reservation.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </div>
  );
};

export default StaffDashboard;
