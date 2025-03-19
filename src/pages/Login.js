import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper, 
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Create Alert component
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Login() {
  const [tabValue, setTabValue] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState('Class-A');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      
      if (tabValue === 0) {
        // Login with shorter timeout
        const loginTimeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout. Please check your internet connection.')), 5000)
        );
        
        try {
          await Promise.race([
            login(email, password),
            loginTimeout
          ]);
          navigate('/dashboard');
        } catch (error) {
          if (error.message.includes('timeout')) {
            throw new Error('Connection timeout. Please try again.');
          }
          throw error;
        }
      } else {
        // Register
        if (!name) {
          throw new Error('Please enter your name');
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords don't match");
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        const userData = {
          name,
          role,
          ...(role === 'student' && { class: selectedClass })
        };
        
        await signup(email, password, userData);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError(
        error.code === 'auth/invalid-credential'
          ? 'Invalid email or password'
          : error.code === 'auth/email-already-in-use'
          ? 'Email already in use'
          : error.code === 'auth/weak-password'
          ? 'Password should be at least 6 characters'
          : error.code === 'auth/network-request-failed'
          ? 'Network error. Please check your internet connection.'
          : error.message || 'Authentication failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Typography component="h1" variant="h5" gutterBottom>
          Smart Classroom Management
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="auth tabs" variant="fullWidth">
            <Tab label="Login" {...a11yProps(0)} />
            <Tab label="Register" {...a11yProps(1)} />
          </Tabs>
        </Box>

        {error && (
          <Box sx={{ width: '100%', mb: 2, mt: 2 }}>
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          </Box>
        )}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
          <TabPanel value={tabValue} index={1}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </TabPanel>

          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <TabPanel value={tabValue} index={1}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                value={role}
                label="Role"
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
              >
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="administrator">Administrator</MenuItem>
              </Select>
            </FormControl>

            {role === 'student' && (
              <FormControl fullWidth margin="normal">
                <InputLabel id="class-label">Class</InputLabel>
                <Select
                  labelId="class-label"
                  id="class"
                  value={selectedClass}
                  label="Class"
                  onChange={(e) => setSelectedClass(e.target.value)}
                  disabled={loading}
                >
                  <MenuItem value="Class-A">Class A</MenuItem>
                  <MenuItem value="Class-B">Class B</MenuItem>
                  <MenuItem value="Class-C">Class C</MenuItem>
                </Select>
              </FormControl>
            )}
          </TabPanel>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                <Typography variant="button">
                  {tabValue === 0 ? 'Signing In...' : 'Registering...'}
                </Typography>
              </Box>
            ) : (
              tabValue === 0 ? "Sign In" : "Register"
            )}
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={() => {
              setTabValue(tabValue === 0 ? 1 : 0);
              setError('');
            }}
            sx={{ mt: 1 }}
            disabled={loading}
          >
            {tabValue === 0 ? "Need an account? Register" : "Already have an account? Sign In"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;