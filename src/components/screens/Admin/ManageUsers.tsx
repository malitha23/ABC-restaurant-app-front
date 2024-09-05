import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper as MuiPaper, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import OverlayPanel from '../../OverlayPanel/OverlayPanel';

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

const ManageUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [newUser, setNewUser] = useState<User | null>(null);
    const [updatingUser, setUpdatingUser] = useState<User | null>(null);

    // Fetch users from the API on component mount
    useEffect(() => {
        fetchUsers();
    }, []);

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
     
 
    // const handleAddUser = async () => {
    //     if (newUser) {
    //         try {
    //             await axios.post('http://localhost:3000/api/userRoutes/users', newUser);
    //             toast.success('User added successfully!');
    //             setNewUser(null);
    //             fetchUsers();
    //         } catch (error) {
    //             toast.error('Error adding user');
    //             console.error('Error adding user:', error);
    //         }
    //     } else {
    //         toast.error('Please fill in all user details');
    //     }
    // };

    const handleDeleteUser = async (userId: number) => {
        try {
            const token = localStorage.getItem('userToken');
            await axios.delete(`http://localhost:3000/api/admin/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Include the token in the Authorization header
                }
            });
            toast.success('User deleted successfully!');
            fetchUsers();
        } catch (error) {
            toast.error('Error deleting user');
            console.error('Error deleting user:', error);
        }
    };

    const handleUpdateUser = async () => {
        if (updatingUser) {
            try {
                const token = localStorage.getItem('userToken');
                await axios.put(`http://localhost:3000/api/admin/users/${updatingUser.id}`, updatingUser, {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the Authorization header
                    }
                });
                toast.success('User updated successfully!');
                setUpdatingUser(null);
                fetchUsers();
            } catch (error) {
                toast.error('Error updating user');
                console.error('Error updating user:', error);
            }
        }
    };

    const handleCloseOverlay = () => {
        setUpdatingUser(null); // Hide the overlay panel
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        if (updatingUser) {
            setUpdatingUser({ ...updatingUser, status: event.target.value === 'true' });
        }
    };

    return (
        <div>
            <Typography variant="h5" gutterBottom>Manage Users</Typography>

            {/* Add New User Form
            {newUser && (
                <div>
                    <Typography variant="h6">Add New User</Typography>
                    <TextField
                        label="Username"
                        fullWidth
                        margin="normal"
                        value={newUser.username || ''}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    />
                    <TextField
                        label="Email"
                        fullWidth
                        margin="normal"
                        value={newUser.email || ''}
                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                    <TextField
                        label="First Name"
                        fullWidth
                        margin="normal"
                        value={newUser.first_name || ''}
                        onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                    />
                    <TextField
                        label="Last Name"
                        fullWidth
                        margin="normal"
                        value={newUser.last_name || ''}
                        onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                    />
                    <TextField
                        label="Phone Number"
                        fullWidth
                        margin="normal"
                        value={newUser.phone_number || ''}
                        onChange={(e) => setNewUser({ ...newUser, phone_number: e.target.value })}
                    />
                    <TextField
                        label="Address"
                        fullWidth
                        margin="normal"
                        value={newUser.address || ''}
                        onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                    />
                    <TextField
                        label="Role"
                        fullWidth
                        margin="normal"
                        value={newUser.role || ''}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    />
                    <TextField
                        label="Status"
                        fullWidth
                        margin="normal"
                        value={newUser.status || ''}
                        onChange={(e) => setNewUser({ ...newUser, status: e.target.value  })}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddUser}
                        sx={{ mt: 2 }}
                    >
                        Add User
                    </Button>
                </div>
            )} */}

            <TableContainer component={MuiPaper} sx={{ mt: 2, overflowX: 'scroll' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.first_name}</TableCell>
                                <TableCell>{user.last_name}</TableCell>
                                <TableCell>{user.phone_number}</TableCell>
                                <TableCell>{user.address}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>{user.status ? 'Active' : 'Inactive'}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="warning"
                                        onClick={() => setUpdatingUser(user)}
                                    >
                                        Update
                                    </Button>  
                                </TableCell>
                                <TableCell>
                                <Button
                                        variant="contained"
                                        color="error"
                                        style={{ marginLeft: '5px' }}
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Update User Form */}
            <OverlayPanel open={!!updatingUser} onClose={handleCloseOverlay}>
                {updatingUser && (
                    <div>
                        <Typography variant="h6">Update User</Typography>
                        <TextField
                            label="Username"
                            fullWidth
                            margin="normal"
                            value={updatingUser.username}
                            onChange={(e) => setUpdatingUser({ ...updatingUser, username: e.target.value })}
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            margin="normal"
                            value={updatingUser.email}
                            onChange={(e) => setUpdatingUser({ ...updatingUser, email: e.target.value })}
                        />
                        <TextField
                            label="First Name"
                            fullWidth
                            margin="normal"
                            value={updatingUser.first_name}
                            onChange={(e) => setUpdatingUser({ ...updatingUser, first_name: e.target.value })}
                        />
                        <TextField
                            label="Last Name"
                            fullWidth
                            margin="normal"
                            value={updatingUser.last_name}
                            onChange={(e) => setUpdatingUser({ ...updatingUser, last_name: e.target.value })}
                        />
                        <TextField
                            label="Phone Number"
                            fullWidth
                            margin="normal"
                            value={updatingUser.phone_number}
                            onChange={(e) => setUpdatingUser({ ...updatingUser, phone_number: e.target.value })}
                        />
                        <TextField
                            label="Address"
                            fullWidth
                            margin="normal"
                            value={updatingUser.address}
                            onChange={(e) => setUpdatingUser({ ...updatingUser, address: e.target.value })}
                        />
                        <TextField
                            label="Role"
                            fullWidth
                            margin="normal"
                            value={updatingUser.role}
                            onChange={(e) => setUpdatingUser({ ...updatingUser, role: e.target.value })}
                        />
                        <Select
                            value={updatingUser.status ? 'true' : 'false'}
                            onChange={(e) => handleStatusChange(e)}
                            fullWidth
                        >
                            <MenuItem value="true">Active</MenuItem>
                            <MenuItem value="false">Inactive</MenuItem>
                        </Select>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpdateUser}
                            sx={{ mt: 2 }}
                        >
                            Update
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleCloseOverlay}
                            sx={{ mt: 2, ml: 1 }}
                        >
                            Cancel
                        </Button>
                    </div>
                )}
            </OverlayPanel>
        </div>
    );
};

export default ManageUsers;
