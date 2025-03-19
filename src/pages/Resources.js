import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Pagination
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, limit, startAfter, orderBy, Timestamp } from 'firebase/firestore';
import ResourceBooking from '../components/ResourceBooking';

const ITEMS_PER_PAGE = 10;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function Resources() {
  const { userRole } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    quantity: 1,
    status: 'available'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(1);
  const [lastVisible, setLastVisible] = useState(null);
  const resourcesCache = useRef({});

  // Resource types
  const resourceTypes = useMemo(() => [
    'Projector',
    'Computer',
    'Whiteboard',
    'Microscope',
    'Lab Equipment',
    'Sports Equipment',
    'Books',
    'Other'
  ], []);

  // Memoize filtered and paginated resources
  const paginatedResources = useMemo(() => {
    return resources.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  }, [resources, page]);

  // Fetch resources with pagination and caching
  const fetchResources = useCallback(async (isInitial = false) => {
    const cacheKey = `resources_${isInitial ? 'initial' : 'more'}`;
    const cachedData = resourcesCache.current[cacheKey];
    const now = Date.now();

    if (cachedData && (now - cachedData.timestamp < CACHE_DURATION)) {
      if (isInitial) {
        setResources(cachedData.data);
      } else {
        setResources(prev => [...prev, ...cachedData.data]);
      }
      return;
    }

    setLoading(true);
    try {
      let q = query(
        collection(db, 'resources'),
        orderBy('name'),
        limit(ITEMS_PER_PAGE)
      );

      if (!isInitial && lastVisible) {
        q = query(
          collection(db, 'resources'),
          orderBy('name'),
          startAfter(lastVisible),
          limit(ITEMS_PER_PAGE)
        );
      }

      const querySnapshot = await getDocs(q);
      const resourcesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

      // Cache the results
      resourcesCache.current[cacheKey] = {
        data: resourcesList,
        timestamp: now
      };

      if (isInitial) {
        setResources(resourcesList);
      } else {
        setResources(prev => [...prev, ...resourcesList]);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Failed to fetch resources');
    }
    setLoading(false);
  }, [lastVisible]);

  // Initial fetch
  useEffect(() => {
    fetchResources(true);
  }, [fetchResources]);

  const handleOpenDialog = useCallback((resource = null) => {
    if (resource) {
      setEditingResource(resource);
      setFormData(resource);
    } else {
      setEditingResource(null);
      setFormData({
        name: '',
        type: '',
        description: '',
        quantity: 1,
        status: 'available'
      });
    }
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setEditingResource(null);
    setFormData({
      name: '',
      type: '',
      description: '',
      quantity: 1,
      status: 'available'
    });
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingResource) {
        // Update existing resource
        await updateDoc(doc(db, 'resources', editingResource.id), {
          ...formData,
          updatedAt: Timestamp.now()
        });
        setSuccess('Resource updated successfully');
      } else {
        // Add new resource
        await addDoc(collection(db, 'resources'), {
          ...formData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        setSuccess('Resource added successfully');
      }
      handleCloseDialog();
      // Clear cache and refetch
      resourcesCache.current = {};
      fetchResources(true);
    } catch (error) {
      console.error('Error saving resource:', error);
      setError('Failed to save resource');
    }
  };

  const handleDelete = async (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteDoc(doc(db, 'resources', resourceId));
        setSuccess('Resource deleted successfully');
        // Clear cache and refetch
        resourcesCache.current = {};
        fetchResources(true);
      } catch (error) {
        console.error('Error deleting resource:', error);
        setError('Failed to delete resource');
      }
    }
  };

  const handleTabChange = useCallback((event, newValue) => {
    setActiveTab(newValue);
  }, []);

  const handlePageChange = useCallback((event, newValue) => {
    setPage(newValue);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Resource Management</Typography>
              {userRole === 'administrator' && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Add Resource
                </Button>
              )}
            </Box>

            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="Resource List" />
              <Tab label="Book Resource" />
            </Tabs>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

            {activeTab === 0 ? (
              loading && resources.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Status</TableCell>
                          {userRole === 'administrator' && <TableCell>Actions</TableCell>}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedResources.map((resource) => (
                          <TableRow key={resource.id}>
                            <TableCell>{resource.name}</TableCell>
                            <TableCell>{resource.type}</TableCell>
                            <TableCell>{resource.description}</TableCell>
                            <TableCell>{resource.quantity}</TableCell>
                            <TableCell>{resource.status}</TableCell>
                            {userRole === 'administrator' && (
                              <TableCell>
                                <IconButton
                                  color="primary"
                                  onClick={() => handleOpenDialog(resource)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  onClick={() => handleDelete(resource.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                      count={Math.ceil(resources.length / ITEMS_PER_PAGE)}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                </>
              )
            ) : (
              <ResourceBooking />
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Add/Edit Resource Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingResource ? 'Edit Resource' : 'Add New Resource'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Resource Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Resource Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    label="Resource Type"
                  >
                    {resourceTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    label="Status"
                  >
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="in_use">In Use</MenuItem>
                    <MenuItem value="maintenance">Maintenance</MenuItem>
                    <MenuItem value="unavailable">Unavailable</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {editingResource ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}

export default Resources;