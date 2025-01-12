import React from "react";
import { Link } from "react-router-dom";
import { Box, Flex, Button, Text } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <Box bg="blue.500" p={4} color="white">
      <Flex justify="space-between" align="center">
        <Text fontSize="lg" fontWeight="bold">Sistema de Gestión</Text>
        <Flex gap={4}>
          <Button as={Link} to="/profile" colorScheme="whiteAlpha">Perfil</Button>
          <Button as={Link} to="/" colorScheme="red">Cerrar Sesión</Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;
