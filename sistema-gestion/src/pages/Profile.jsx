import React, { useEffect, useState } from "react";
import { Box, Button, Heading, Text } from "@chakra-ui/react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.post("/api/consultarUsuarios", {}, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProfile(response.data);
      } catch (err) {
        console.error("Error al obtener el perfil");
      }
    };

    fetchProfile();
  }, []);

  const handleDelete = async () => {
    try {
      await axios.post("/api/darDeBajaUsuario", { boleta: profile.boleta });
      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      console.error("Error al eliminar el usuario");
    }
  };

  return profile ? (
    <Box maxW="md" mx="auto" mt={8} p={6} boxShadow="md" bg="white">
      <Heading size="lg" mb={6}>Perfil</Heading>
      <Text><strong>Nombre:</strong> {profile.nombre}</Text>
      <Text><strong>Correo:</strong> {profile.correo}</Text>
      <Text><strong>Boleta:</strong> {profile.boleta}</Text>
      <Button mt={4} colorScheme="red" onClick={handleDelete}>Eliminar Cuenta</Button>
    </Box>
  ) : (
    <Text>Cargando perfil...</Text>
  );
};

export default Profile;
