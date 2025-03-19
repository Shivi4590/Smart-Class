import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import AttendanceAnalytics from '../components/AttendanceAnalytics';
import { seedTestData } from '../utils/seedData';

function Attendance() {
  const { userRole, currentUser } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = useCallback(async () => {
    if (!selectedClass) return;
    
    setLoading(true);
    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'student'),
        where('class', '==', selectedClass)
      );
      const querySnapshot = await getDocs(q);
      const studentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setStudents(studentsList);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
    setLoading(false);
  }, [selectedClass]);

  // Fetch students based on selected class
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Fetch attendance data for selected date and class
  useEffect(() => {
    async function fetchAttendance() {
      if (!selectedClass || !selectedDate) return;

      setLoading(true);
      try {
        const selectedDateTime = new Date(selectedDate);
        const startOfDay = new Date(selectedDateTime.setHours(0, 0, 0, 0));
        const endOfDay = new Date(selectedDateTime.setHours(23, 59, 59, 999));

        const q = query(
          collection(db, 'attendance'),
          where('class', '==', selectedClass),
          where('date', '>=', Timestamp.fromDate(startOfDay)),
          where('date', '<=', Timestamp.fromDate(endOfDay))
        );
        const querySnapshot = await getDocs(q);
        const attendanceList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAttendanceData(attendanceList);
      } catch (error) {
        console.error('Error fetching attendance:', error);
      }
      setLoading(false);
    }

    fetchAttendance();
  }, [selectedClass, selectedDate]);

  const handleMarkAttendance = async (studentId, status) => {
    try {
      const dateObj = new Date(selectedDate);
      await addDoc(collection(db, 'attendance'), {
        studentId,
        class: selectedClass,
        date: Timestamp.fromDate(dateObj),
        status,
        markedBy: currentUser.uid,
        markedAt: Timestamp.now()
      });

      // Refresh attendance data
      const updatedAttendance = [...attendanceData];
      const index = updatedAttendance.findIndex(a => a.studentId === studentId);
      if (index !== -1) {
        updatedAttendance[index].status = status;
      } else {
        updatedAttendance.push({
          studentId,
          status,
          date: Timestamp.fromDate(dateObj)
        });
      }
      setAttendanceData(updatedAttendance);
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  const getStudentAttendanceStatus = (studentId) => {
    const record = attendanceData.find(a => a.studentId === studentId);
    return record ? record.status : null;
  };

  const handleSeedData = async () => {
    setLoading(true);
    await seedTestData();
    setLoading(false);
    // Refresh the student list if a class is selected
    if (selectedClass) {
      fetchStudents();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">Attendance Management</Typography>
              {userRole === 'administrator' && (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSeedData}
                  disabled={loading}
                >
                  Generate Test Data
                </Button>
              )}
            </Box>

            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Class</InputLabel>
                  <Select
                    value={selectedClass}
                    label="Class"
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    <MenuItem value="Class-A">Class A</MenuItem>
                    <MenuItem value="Class-B">Class B</MenuItem>
                    <MenuItem value="Class-C">Class C</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  label="Date"
                />
              </Grid>
            </Grid>

            {selectedClass && (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{getStudentAttendanceStatus(student.id) || 'Not marked'}</TableCell>
                          <TableCell align="right">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleMarkAttendance(student.id, 'Present')}
                              sx={{ mr: 1 }}
                            >
                              Present
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleMarkAttendance(student.id, 'Absent')}
                            >
                              Absent
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <AttendanceAnalytics classId={selectedClass} />
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Attendance;