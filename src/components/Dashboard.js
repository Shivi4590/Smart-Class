import React, { useState, useEffect, Suspense } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore';

// Lazy load chart components
const Chart = React.lazy(() => import('./Chart'));

function Dashboard() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    resourcesBooked: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Optimized queries with limits
        const studentsQuery = query(
          collection(db, 'users'),
          where('role', '==', 'student'),
          limit(20)
        );
        
        const teachersQuery = query(
          collection(db, 'users'),
          where('role', '==', 'teacher'),
          limit(20)
        );
        
        const resourcesQuery = query(
          collection(db, 'resources'),
          orderBy('createdAt', 'desc'),
          limit(20)
        );

        // Parallel queries for better performance
        const [studentsSnap, teachersSnap, resourcesSnap] = await Promise.all([
          getDocs(studentsQuery),
          getDocs(teachersQuery),
          getDocs(resourcesQuery)
        ]);

        setStats({
          totalStudents: studentsSnap.size,
          totalTeachers: teachersSnap.size,
          resourcesBooked: resourcesSnap.size
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {currentUser?.name || 'User'}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Students</Typography>
            <Typography variant="h4">{stats.totalStudents}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Teachers</Typography>
            <Typography variant="h4">{stats.totalTeachers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Resources Booked</Typography>
            <Typography variant="h4">{stats.resourcesBooked}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Suspense fallback={<CircularProgress />}>
              <Chart />
            </Suspense>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard; 