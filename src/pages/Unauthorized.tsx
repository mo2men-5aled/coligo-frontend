import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

import unauthorized from "../assets/Unauthorized.png";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <Box
          component="img"
          src={unauthorized}
          alt="unauthorized"
          sx={{ width: "100%", maxWidth: 560, mb: 2 }}
        />
        <Typography variant="h5" gutterBottom>
          You are not authorized to view this page. Please login to continue.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{ mt: 2 }}
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </Container>
    </Box>
  );
};

export default Unauthorized;
