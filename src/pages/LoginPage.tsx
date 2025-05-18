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
import { Link as RouterLink } from "react-router-dom";
import { login } from "../api/login";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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

  const { authorize: AuthAuthorize } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      login(credentials.email, credentials.password),
    onSuccess: (data) => {
      AuthAuthorize(data.data.access_token);
      dispatch(authorize());
      dispatch(setUser(data.data));

      const isTeacher = data.data.role === "teacher";
      if (isTeacher) {
        dispatch(authorizeTeacher());
      }

      navigate("/");

      enqueueSnackbar("Login successful", { variant: "success" });
    },
    onError: (error: Error | { response: { data: { message: string } } }) => {
      if (error instanceof Error) {
        enqueueSnackbar(error.message, { variant: "error" });
      }
      if ("response" in error) {
        setErrors([error.response.data.message]);
      } else {
        setErrors([error.message]);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ email, password });
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
                disabled={isPending}
                startIcon={
                  isPending ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : null
                }
              >
                {isPending ? "Logging in..." : "Login"}
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
