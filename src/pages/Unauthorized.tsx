import { Image, Text, Box, Center, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import unauthorized from "../assets/Unauthorized.png";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Center>
        <Box width="35rem">
          <Image src={unauthorized} alt="unauthorized" />
          <Text fontSize="2xl" textAlign="center">
            You are not authorized to view this page. Please login to continue.
          </Text>

          <Center>
            <Button
              size="lg"
              variant="solid"
              mt={4}
              colorScheme="blue"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </Button>
          </Center>
        </Box>
      </Center>
    </Box>
  );
};

export default Unauthorized;
