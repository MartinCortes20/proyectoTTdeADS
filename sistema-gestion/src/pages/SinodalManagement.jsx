import React, { useState, useEffect } from "react";
import { Box, Button, Heading, VStack, Text, Input, FormControl, FormLabel } from "@chakra-ui/react";
import axios from "axios";

const SinodalManagement = () => {
  const [protocols, setProtocols] = useState([]);
  const [form, setForm] = useState({ id_protocolo: "", calificacion: "", observaciones: "" });

  const fetchProtocols = async () => {
    try {
      const response = await axios.post("/api/consultarProtocolos", {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProtocols(response.data.protocolos);
    } catch (err) {
      console.error("Error al obtener protocolos asignados", err);
    }
  };

  const rateProtocol = async () => {
    try {
      await axios.post("/api/calificarProtocolo", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchProtocols();
    } catch (err) {
      console.error("Error al calificar protocolo", err);
    }
  };

  useEffect(() => {
    fetchProtocols();
  }, []);

  return (
    <Box maxW="md" mx="auto" mt={8} p={6} boxShadow="md" bg="white">
      <Heading size="lg" mb={6}>Gestión de Sinodalías</Heading>
      {protocols.length > 0 ? (
        <VStack spacing={4}>
          {protocols.map((protocol) => (
            <Box key={protocol.id_protocolo} p={4} boxShadow="sm" borderWidth="1px">
              <Text><strong>Título:</strong> {protocol.titulo}</Text>
              <Text><strong>Líder:</strong> {protocol.lider}</Text>
              <Button mt={2} colorScheme="blue" onClick={() => setForm({ ...form, id_protocolo: protocol.id_protocolo })}>
                Calificar
              </Button>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text>No tienes protocolos asignados.</Text>
      )}
      <Heading size="md" mt={8}>Calificar Protocolo</Heading>
      <FormControl mt={4}>
        <FormLabel>Calificación</FormLabel>
        <Input value={form.calificacion} onChange={(e) => setForm({ ...form, calificacion: e.target.value })} />
      </FormControl>
      <FormControl mt={4}>
        <FormLabel>Observaciones</FormLabel>
        <Input value={form.observaciones} onChange={(e) => setForm({ ...form, observaciones: e.target.value })} />
      </FormControl>
      <Button mt={4} colorScheme="green" onClick={rateProtocol}>Enviar Calificación</Button>
    </Box>
  );
};

export default SinodalManagement;
