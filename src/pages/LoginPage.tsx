import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { login } from "../api/login";
import { useAppDispatch } from "../store/hooks";
import {
  authorize,
  authorizeTeacher,
  setUser,
} from "../store/slices/authSlice";
import { useAuth } from "../context/auth/context";
import { useSnackbar } from "notistack";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { authorize: AuthAuthorize } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const data = await login(email, password);

      AuthAuthorize(data.data.access_token);
      dispatch(authorize());
      dispatch(setUser(data.data));

      const isTeacher = data.data.role === "teacher";
      if (isTeacher) {
        dispatch(authorizeTeacher());
      }

      enqueueSnackbar("Login successful", { variant: "success" });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.100",
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
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
              {errors.length > 0 && (
                <Alert severity="error">{errors.join(", ")}</Alert>
              )}
              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <Typography align="center">
                Don't have an account?{" "}
                <Link component={RouterLink} to="/register">
                  Register
                </Link>
              </Typography>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}
