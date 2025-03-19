import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Paper,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
  ListSubheader
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { collection, addDoc, getDocs, query, where, Timestamp, doc, getDoc, limit, orderBy } from 'firebase/firestore';

const RESOURCE_QUERY_LIMIT = 50;

function ResourceBooking() {
  const { currentUser } = useAuth();
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [existingBookings, setExistingBookings] = useState([]);

  // Group resources by type for better organization
  const groupedResources = useMemo(() => {
    const groups = {};
    resources.forEach(resource => {
      if (resource.status === 'available') {
        if (!groups[resource.type]) {
          groups[resource.type] = [];
        }
        groups[resource.type].push(resource);
      }
    });
    return groups;
  }, [resources]);

  // Fetch resources
  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'resources'),
        orderBy('type'),
        orderBy('name'),
        limit(RESOURCE_QUERY_LIMIT)
      );

      const querySnapshot = await getDocs(q);
      const resourcesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setResources(resourcesList);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Failed to fetch resources');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  // Fetch existing bookings
  const fetchExistingBookings = useCallback(async () => {
    if (!selectedResource || !bookingDate) return;

    try {
      const startOfDay = new Date(bookingDate);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(bookingDate);
      endOfDay.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, 'bookings'),
        where('resourceId', '==', selectedResource),
        where('date', '>=', Timestamp.fromDate(startOfDay)),
        where('date', '<=', Timestamp.fromDate(endOfDay))
      );

      const querySnapshot = await getDocs(q);
      const bookingsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setExistingBookings(bookingsList);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to fetch bookings');
    }
  }, [selectedResource, bookingDate]);

  // Check time slot availability
  const isTimeSlotAvailable = useCallback((start, end) => {
    const startTime = start.getTime();
    const endTime = end.getTime();
    
    return !existingBookings.some(booking => {
      const bookingStart = booking.startTime.toDate().getTime();
      const bookingEnd = booking.endTime.toDate().getTime();
      return (
        (startTime >= bookingStart && startTime < bookingEnd) ||
        (endTime > bookingStart && endTime <= bookingEnd) ||
        (startTime <= bookingStart && endTime >= bookingEnd)
      );
    });
  }, [existingBookings]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedResource('');
    setBookingDate('');
    setStartTime('');
    setEndTime('');
    setPurpose('');
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedResource || !bookingDate || !startTime || !endTime || !purpose) {
      setError('Please fill in all required fields');
      return;
    }

    const startDateTime = new Date(`${bookingDate}T${startTime}`);
    const endDateTime = new Date(`${bookingDate}T${endTime}`);

    if (startDateTime >= endDateTime) {
      setError('End time must be after start time');
      return;
    }

    if (!isTimeSlotAvailable(startDateTime, endDateTime)) {
      setError('This time slot is already booked');
      return;
    }

    try {
      setLoading(true);
      const resourceDoc = await getDoc(doc(db, 'resources', selectedResource));
      const resourceData = resourceDoc.data();

      if (!resourceData) {
        throw new Error('Resource not found');
      }

      await addDoc(collection(db, 'bookings'), {
        resourceId: selectedResource,
        resourceName: resourceData.name,
        resourceType: resourceData.type,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
        date: Timestamp.fromDate(startDateTime),
        startTime: Timestamp.fromDate(startDateTime),
        endTime: Timestamp.fromDate(endDateTime),
        purpose,
        status: 'pending',
        createdAt: Timestamp.now()
      });

      setSuccess('Resource booked successfully');
      handleCloseDialog();
      await fetchExistingBookings();
    } catch (error) {
      console.error('Error booking resource:', error);
      setError('Failed to book resource: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Book a Resource
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth required>
            <InputLabel>Select Resource</InputLabel>
            <Select
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              label="Select Resource"
              disabled={loading}
            >
              {Object.entries(groupedResources).map(([type, resources]) => [
                <ListSubheader key={type}>{type}</ListSubheader>,
                ...resources.map(resource => (
                  <MenuItem key={resource.id} value={resource.id}>
                    {resource.name}
                  </MenuItem>
                ))
              ])}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleOpenDialog}
            disabled={!selectedResource || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Book Now'}
          </Button>
        </Grid>
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>Book Resource</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="date"
                  label="Booking Date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split('T')[0] }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Start Time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="End Time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={loading}>Cancel</Button>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Book'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
}

export default React.memo(ResourceBooking); 