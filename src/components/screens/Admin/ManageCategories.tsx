// ManageCategories.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper as MuiPaper } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import OverlayPanel from '../../OverlayPanel/OverlayPanel';

interface Category {
  id: number;
  name: string;
}

const ManageCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<string>('');
  const [updatingCategory, setUpdatingCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/categoryRoutes/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async () => {
    if(newCategory == null || newCategory == ''){
        toast.error('Please enter category name');
        return;
    }
    try {
      await axios.post('http://localhost:3000/api/categoryRoutes/categories', { name: newCategory });
      toast.success('Category added successfully!');
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      toast.error('Error adding category');
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await axios.delete(`http://localhost:3000/api/categoryRoutes/categories/${categoryId}`);
      toast.success('Category deleted successfully!');
      fetchCategories();
    } catch (error) {
      toast.error('Error deleting category');
      console.error('Error deleting category:', error);
    }
  };

  const handleUpdateCategory = async () => {
    if (updatingCategory) {
      try {
        await axios.put(`http://localhost:3000/api/categoryRoutes/categories/${updatingCategory.id}`, { name: updatingCategory.name });
        toast.success('Category updated successfully!');
        setUpdatingCategory(null);
        fetchCategories();
      } catch (error) {
        toast.error('Error updating category');
        console.error('Error updating category:', error);
      }
    }
  };

  const handleCloseOverlay = () => {
    setUpdatingCategory(null); // Hide the overlay panel
  };

  return (
    <div>
      <Typography variant="h5" gutterBottom>Manage Categories</Typography>
      <TextField
        label="New Category"
        fullWidth
        margin="normal"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddCategory}
        sx={{ mt: 2 }}
      >
        Add Category
      </Button>

      <TableContainer component={MuiPaper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map(category => (
              <TableRow key={category.id}>
                <TableCell>{category.id}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={() => setUpdatingCategory(category)}
                  >
                    Update
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    style={{ marginLeft: '5px' }}
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Category Form */}

      <OverlayPanel open={updatingCategory != null} onClose={handleCloseOverlay}>
      {updatingCategory && (
        <div>
          <TextField
            label="Update Category Name"
            fullWidth
            margin="normal"
            value={updatingCategory.name}
            onChange={(e) => setUpdatingCategory({ ...updatingCategory, name: e.target.value })}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateCategory}
            sx={{ mt: 2 }}
          >
            Update
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setUpdatingCategory(null)}
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

export default ManageCategories;
