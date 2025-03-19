// AttendanceAnalytics.js
import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function AttendanceAnalytics() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attendanceData, setAttendanceData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      setError('');
      try {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));

        const q = query(
          collection(db, 'attendance'),
          where('date', '>=', Timestamp.fromDate(thirtyDaysAgo)),
          where('date', '<=', Timestamp.fromDate(today))
        );

        const querySnapshot = await getDocs(q);
        const attendanceRecords = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        // Process data for chart
        const dateLabels = [];
        const presentCount = [];
        const absentCount = [];

        // Group by date and count present/absent
        attendanceRecords.forEach(record => {
          const date = record.date.toDate().toLocaleDateString();
          const dateIndex = dateLabels.indexOf(date);

          if (dateIndex === -1) {
            dateLabels.push(date);
            presentCount.push(record.status === 'present' ? 1 : 0);
            absentCount.push(record.status === 'absent' ? 1 : 0);
          } else {
            if (record.status === 'present') {
              presentCount[dateIndex]++;
            } else {
              absentCount[dateIndex]++;
            }
          }
        });

        setAttendanceData({
          labels: dateLabels,
          datasets: [
            {
              label: 'Present',
              data: presentCount,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              tension: 0.1
            },
            {
              label: 'Absent',
              data: absentCount,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              tension: 0.1
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setError('Failed to fetch attendance data');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Attendance Trends (Last 30 Days)',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Attendance Analytics
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {loading ? (
        <Grid container justifyContent="center" sx={{ py: 3 }}>
          <CircularProgress />
        </Grid>
      ) : (
        <div style={{ height: '400px' }}>
          <Line options={options} data={attendanceData} />
        </div>
      )}
    </Paper>
  );
}

export default AttendanceAnalytics;