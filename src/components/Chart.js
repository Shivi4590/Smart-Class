import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const Chart = ({ attendanceData, resourceData }) => {
  // Sample data - replace with real data from your backend
  const defaultAttendanceData = [
    { name: 'Mon', students: 85, teachers: 95 },
    { name: 'Tue', students: 83, teachers: 96 },
    { name: 'Wed', students: 90, teachers: 94 },
    { name: 'Thu', students: 87, teachers: 95 },
    { name: 'Fri', students: 89, teachers: 97 },
  ];

  const defaultResourceData = [
    { name: 'Projector', booked: 12 },
    { name: 'Lab', booked: 17 },
    { name: 'Library', booked: 15 },
    { name: 'Sports', booked: 8 },
    { name: 'Music Room', booked: 10 },
  ];

  const data = attendanceData || defaultAttendanceData;
  const resources = resourceData || defaultResourceData;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Weekly Attendance Overview
        </Typography>
        <Paper sx={{ p: 2, height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="students" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }}
                name="Student Attendance %"
              />
              <Line 
                type="monotone" 
                dataKey="teachers" 
                stroke="#82ca9d"
                name="Teacher Attendance %"
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Resource Utilization
        </Typography>
        <Paper sx={{ p: 2, height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={resources}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey="booked" 
                fill="#8884d8"
                name="Times Booked"
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Chart;