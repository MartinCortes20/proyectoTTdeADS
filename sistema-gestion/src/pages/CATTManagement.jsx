import React, { useState, useEffect } from "react";
import { Box, Button, Heading, VStack, Text, Select, FormControl, FormLabel } from "@chakra-ui/react";
import axios from "axios";

const CATTManagement = () => {
  const [protocols, setProtocols] = useState([]);
  const [form, setForm] = useState({ id_protocolo: "", etapa: "" });

  const fetchProtocols = async () => {
    try {
      const response = await axios.post("/api/consultarProtocolos", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProtocols(response.data.protocolos);
    } catch (err) {
      console.error("Error al obtener protocolos", err);
    }
  };

  const assignStage = async () => {
    try {
      await axios.post("/api/actualizarProtocolo", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchProtocols();
    } catch (err) {
      console.error("Error al asignar etapa", err);
    }
  };

  useEffect(() => {
    fetchProtocols();
  }, []);

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} boxShadow="md" bg="white">
      <Heading size="lg" mb={6}>Gestión CATT</Heading>
      {protocols.length > 0 ? (
        <VStack spacing={4}>
          {protocols.map((protocol) => (
            <Box key={protocol.id_protocolo} p={4} boxShadow="sm" borderWidth="1px">
              <Text><strong>Título:</strong> {protocol.titulo}</Text>
              <Text><strong>Etapa Actual:</strong> {protocol.etapa}</Text>
              <Button mt={2} colorScheme="blue" onClick={() => setForm({ ...form, id_protocolo: protocol.id_protocolo })}>
                Asignar Etapa
              </Button>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text>No hay protocolos disponibles.</Text>
      )}
      <Heading size="md" mt={8}>Asignar Etapa</Heading>
      <FormControl mt={4}>
        <FormLabel>Etapa</FormLabel>
        <Select value={form.etapa} onChange={(e) => setForm({ ...form, etapa: e.target.value })}>
          <option value="registro">Registro</option>
          <option value="revision">Revisión</option>
          <option value="retroalimentacion">Retroalimentación</option>
          <option value="aprobacion">Aprobación</option>
        </Select>
      </FormControl>
      <Button mt={4} colorScheme="green" onClick={assignStage}>Actualizar Etapa</Button>
    </Box>
  );
};

export default CATTManagement;
