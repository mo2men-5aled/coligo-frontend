// src/pages/Register.tsx
import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  FormLabel,
  Stepper,
  Step,
  StepLabel,
  Alert,
  CircularProgress,
  Link
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { registerUserThunk } from "../store/slices/userSlice";
import { useSnackbar } from "notistack";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  
  const { registrationStatus, error } = useAppSelector((state) => state.user);
  const isLoading = registrationStatus === 'loading';

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    dispatch(registerUserThunk({ name, email, password, role }))
      .unwrap()
      .then(() => {
        enqueueSnackbar("Registration successful! Please login.", { variant: "success" });
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: 'grey.100'
    }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Register
          </Typography>
          
          <Stepper activeStep={step - 1} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Role</StepLabel>
            </Step>
            <Step>
              <StepLabel>Details</StepLabel>
            </Step>
          </Stepper>

          {step === 1 && (
            <Box>
              <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
                <FormLabel component="legend">Select your role</FormLabel>
                <RadioGroup
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  row
                >
                  <FormControlLabel value="student" control={<Radio />} label="Student" />
                  <FormControlLabel value="teacher" control={<Radio />} label="Teacher" />
                </RadioGroup>
              </FormControl>
              
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                onClick={nextStep}
              >
                Next
              </Button>
            </Box>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                <TextField
                  label="Full Name"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                
                {error && (
                  <Alert severity="error">
                    {error}
                  </Alert>
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button 
                    variant="outlined" 
                    onClick={prevStep}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                  >
                    {isLoading ? 'Registering...' : 'Register'}
                  </Button>
                </Box>
                
                <Typography align="center">
                  Already have an account?{' '}
                  <Link component={RouterLink} to="/login">
                    Login
                  </Link>
                </Typography>
              </Stack>
            </form>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
