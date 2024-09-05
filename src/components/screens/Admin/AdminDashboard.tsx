import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, AppBar, Toolbar, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper as MuiPaper, Collapse, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { Menu as MenuIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import OverlayPanel from '../../OverlayPanel/OverlayPanel';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import ManageCategories from './ManageCategories';
import ManageUsers from './ManageUsers';

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  role: string;
}

interface Item {
  id: number;
  name: string;
  price: string;
  image: File | null; // Change to File or null
  category_id: number;
  category: {
    name: string;
  };
}


interface Category {
  id: number;
  name: string;
}

const AdminDashboard = () => {
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null); // Store user data
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState([]);
  const [newItem, setNewItem] = useState<Item>({
    id: 0,
    name: '',
    price: '',
    image: null,
    category_id: 1,
    category: {
      name: '',
    },
  });
  const [selectedSection, setSelectedSection] = useState<string>('dashboard'); // Track selected section
  const [addingItem, setAddingItem] = useState<boolean>(false); // Track if add item form is visible
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    'databaseOperations': false,
    'categories': false,
  });
  const [updateingItem, setUpdateingItem] = useState<boolean>(false); // Track if add item form is visible
  const [updatingItem, setUpdatingItem] = useState<Item>({
    id: 0,
    name: '',
    price: '',
    image: null,
    category_id: 1,
    category: {
      name: '',
    },
  });
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleClickOpen = (image: string) => {
    setSelectedImage(image);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user'); // Retrieve the JSON string

    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Parse the JSON string and set the user state
    } else {
      console.log('No user data found');
    }

    fetchItems();
    fetchCategories();
    fetchUsers();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/itemRoutes/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/categoryRoutes/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('userToken'); // Retrieve the token from localStorage
      const response = await axios.get('http://localhost:3000/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      console.log(response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };


  const handleCloseOverlay = () => {
    setOverlayVisible(false); // Hide the overlay panel
  };

  const handleOpenOverlay = () => {
    setOverlayVisible(true); // Show the overlay panel
  };

  const handleaddingItemCloseOverlay = () => {
    setAddingItem(false); // Hide the overlay panel
  };

  const handleupdatingItemCloseOverlay = () => {
    setUpdateingItem(false); // Hide the overlay panel
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    setOverlayVisible(false);
    toast.success('Logout successful!');
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  };

  const handleAddItem = async () => {
    try {
      const formData = new FormData();
      formData.append('name', newItem.name);
      formData.append('price', newItem.price);
      formData.append('category_id', String(newItem.category_id));
      if (newItem.image) {
        formData.append('image', newItem.image);
      }

      await axios.post('http://localhost:3000/api/itemRoutes/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Item added successfully!');
      fetchItems(); // Refresh items list
      setNewItem({
        id: 0,
        name: '',
        price: '',
        image: null,
        category_id: 0,
        category: {
          name: '',
        },
      });
      setAddingItem(false); // Close add item form
    } catch (error) {
      toast.error('Error adding item');
      console.error('Error adding item:', error);
    }
  };


  const handleDeleteItem = async (itemId: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/itemRoutes/items/${itemId}`);
      toast.success('Item deleted successfully!');
      fetchItems(); // Refresh items list
    } catch (error) {
      toast.error('Error deleting item');
      console.error('Error deleting item:', error);
    }
  };

  const handleUpdateItem = async (item: Item) => {
    try {
      const formData = new FormData();
      formData.append('name', item.name);
      formData.append('price', item.price);
      formData.append('category_id', String(item.category_id));

      // Only append the image if a new one has been selected
      if (item.image) {
        formData.append('image', item.image); // Assuming `item.image` is a File object
      }

      await axios.put(`http://localhost:3000/api/itemRoutes/items/${item.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }, // Set appropriate headers for form data
      });

      toast.success('Item updated successfully!');
      fetchItems(); // Refresh items list
      setUpdateingItem(false);
    } catch (error) {
      toast.error('Error updating item');
      console.error('Error updating item:', error);
    }
  };


  const handleMenuClick = (section: string) => {
    setSelectedSection(section);
  };

  const handleExpandClick = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div>
      <ToastContainer />
      <Box sx={{ display: 'flex' }}>
        {/* Sidebar */}
        <Box sx={{ width: 240, bgcolor: 'grey.800', height: '100vh', color: 'white', p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Admin Panel
          </Typography>
          <Button
            fullWidth
            color={selectedSection === 'dashboard' ? 'secondary' : 'inherit'}
            onClick={() => handleMenuClick('dashboard')}
          >
            Dashboard
          </Button>
          <Button
            fullWidth
            color={selectedSection === 'manageItems' ? 'secondary' : 'inherit'}
            onClick={() => handleMenuClick('manageItems')}
          >
            Manage Items
          </Button>
          <Button
            fullWidth
            color={selectedSection === 'manageCategories' ? 'secondary' : 'inherit'}
            onClick={() => handleMenuClick('manageCategories')}
          >
            Manage Categories
          </Button>
          <Button
            fullWidth
            color={selectedSection === 'users' ? 'secondary' : 'inherit'}
            onClick={() => handleMenuClick('users')}
          >
            Users
          </Button>
          <Button
            fullWidth
            color={selectedSection === 'reports' ? 'secondary' : 'inherit'}
            onClick={() => handleMenuClick('reports')}
          >
            Reports
          </Button>
          <Button
            fullWidth
            color={selectedSection === 'settings' ? 'secondary' : 'inherit'}
            onClick={() => handleMenuClick('settings')}
          >
            Settings
          </Button>
        </Box>

        {/* Main Content */}
        <Box sx={{ flexGrow: 1, p: 3 }}>
          {/* Header - Only visible for Dashboard */}
          {selectedSection === 'dashboard' && (
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
                <Button color="inherit" onClick={handleOpenOverlay}>Logout</Button>
              </Toolbar>
            </AppBar>
          )}

          {selectedSection === 'manageCategories' && (
            <Grid item xs={12}>
              <ManageCategories />
            </Grid>
          )}

          {selectedSection === 'users' && (
            <Grid item xs={12}>
              <ManageUsers />
            </Grid>
          )}

          {/* Dashboard Content */}
          {selectedSection === 'dashboard' && (
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6">Total Users</Typography>
                  <Typography variant="h4">{users.length}</Typography>
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
          )}

          {/* Manage Items Content */}
          {selectedSection === 'manageItems' && (
            <div>
              <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2 }}
                onClick={() => setAddingItem(true)}
              >
                Add Item
              </Button>

              <OverlayPanel open={addingItem} onClose={handleaddingItemCloseOverlay}>
                {addingItem && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" gutterBottom>Add New Item</Typography>
                    <TextField
                      label="Name"
                      fullWidth
                      margin="normal"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                    <TextField
                      label="Price"
                      type="number"
                      fullWidth
                      margin="normal"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setNewItem({ ...newItem, image: e.target.files[0] });
                        }
                      }}
                      style={{ marginBottom: 16 }}
                    />
                    <TextField
                      label="Category"
                      select
                      fullWidth
                      margin="normal"
                      SelectProps={{ native: true }}
                      value={newItem.category_id}
                      onChange={(e) => setNewItem({ ...newItem, category_id: Number(e.target.value) })}
                    >
                      <option value="" disabled>Select category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </TextField>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddItem}
                      sx={{ mt: 2 }}
                    >
                      Add
                    </Button>
                  </Box>
                )}
              </OverlayPanel>
              <OverlayPanel open={updateingItem} onClose={handleupdatingItemCloseOverlay}>
                {updateingItem && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h5" gutterBottom>Update Item</Typography>
                    <TextField
                      label="Name"
                      fullWidth
                      margin="normal"
                      value={updatingItem.name}
                      onChange={(e) => setUpdatingItem({ ...updatingItem, name: e.target.value })}
                    />
                    <TextField
                      label="Price"
                      type="number"
                      fullWidth
                      margin="normal"
                      value={updatingItem.price}
                      onChange={(e) => setUpdatingItem({ ...updatingItem, price: e.target.value })}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUpdatingItem({ ...updatingItem, image: e.target.files[0] });
                        }
                      }}
                      style={{ marginBottom: 16 }}
                    />
                    <TextField
                      label="Category"
                      select
                      fullWidth
                      margin="normal"
                      SelectProps={{ native: true }}
                      value={updatingItem.category_id}
                      onChange={(e) => setUpdatingItem({ ...updatingItem, category_id: Number(e.target.value) })}
                    >
                      <option value="" disabled>Select category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </TextField>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleUpdateItem(updatingItem)}
                      sx={{ mt: 2 }}
                    >
                      Update
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      // onClick={() => setUpdatingItem(null)} // Close update form
                      sx={{ mt: 2, ml: 1 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </OverlayPanel>

              <TableContainer component={MuiPaper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Image</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {items.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {/* Display image if available */}
                          {item.image ? (
                            <img
                              src={`http://localhost:3000/api${item.image}`}
                              alt={item.name}
                              style={{ width: 100, height: 'auto' }} // Adjust size as needed
                              onClick={() => handleClickOpen(`http://localhost:3000/api${item.image}`)}
                            />
                          ) : (
                            'No image'
                          )}
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>${item.price}</TableCell>
                        <TableCell>{item.category.name}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="warning"
                            onClick={() => {
                              setUpdateingItem(true);
                              setUpdatingItem(item);
                            }}
                          >
                            Update
                          </Button>
                          <Button
                            variant="contained"
                            color="error"  // Sets the button's background color to red (danger)
                            style={{ marginLeft: '5px' }}
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* Fullscreen Image Dialog */}
              <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle>
                  Fullscreen Image
                  <IconButton
                    edge="end"
                    color="inherit"
                    onClick={handleClose}
                    aria-label="close"
                    style={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  {selectedImage && (
                    <img
                      src={selectedImage}
                      alt="Fullscreen"
                      style={{ width: '100%', height: 'auto' }}
                    />
                  )}
                </DialogContent>
              </Dialog>

            </div>
          )}
        </Box>
      </Box>

      {/* Overlay Panel */}
      <OverlayPanel open={overlayVisible} onClose={handleCloseOverlay}>
        {user && (
          <div className="user-info">
            <h2>{user.username}</h2>
            <p><strong>Full Name:</strong> {user.first_name} {user.last_name}</p>
            <p><strong>Phone Number:</strong> {user.phone_number}</p>
            <p><strong>Address:</strong> {user.address}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <br />
            <button
              className="px-4 py-2 rounded-full text-white bg-dark"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </OverlayPanel>
    </div>
  );
};

export default AdminDashboard;
