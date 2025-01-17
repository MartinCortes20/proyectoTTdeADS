import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardBody,
  Text,
  Heading,
  Flex,
  Spinner,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  consultarUsuariosCATT,
  consultarProfesCATT,
  eliminarDocente,
  eliminarAlumno,
} from "../../api";
import { AuthContext } from "../../context/AuthContext";
import EditProfileModal from "../student/EditProfileModal";

const DashboardCatt = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // Usuario o docente seleccionado
  const [editType, setEditType] = useState(""); // Tipo de edición: 'usuario' o 'docente'
  const { token } = useContext(AuthContext);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError("No se encontró un token válido. Por favor, inicia sesión.");
        setIsLoading(false);
        return;
      }

      try {
        const [usuariosResp, docentesResp] = await Promise.all([
          consultarUsuariosCATT(token),
          consultarProfesCATT(token),
        ]);

        if (usuariosResp.success) {
          setUsuarios(usuariosResp.data);
        } else {
          toast({
            title: "Error al cargar usuarios",
            description: usuariosResp.message || "Intenta nuevamente más tarde.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }

        if (docentesResp.success) {
          setDocentes(docentesResp.data);
        } else {
          toast({
            title: "Error al cargar docentes",
            description: docentesResp.message || "Intenta nuevamente más tarde.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (err) {
        console.error("Error al cargar los datos:", err);
        setError("Hubo un error al cargar los datos.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, toast]);

  const handleEditUser = (user, type) => {
    setSelectedUser(user); // Establecer usuario o docente seleccionado
    setEditType(type); // Definir si es un usuario o docente
  };

  const handleEliminarUsuario = async (id) => {
    try {
      const response = await eliminarAlumno(token, { id });
      if (response.success) {
        toast({
          title: "Usuario eliminado",
          description: "El usuario fue eliminado exitosamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setUsuarios(usuarios.filter((usuario) => usuario.boleta !== id));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "Error al eliminar usuario",
        description: error.message || "Intenta nuevamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEliminarDocente = async (claveEmpleado) => {
    try {
      const response = await eliminarDocente(token, claveEmpleado);
      if (response.success) {
        toast({
          title: "Docente eliminado",
          description: "El docente fue eliminado exitosamente.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setDocentes(
          docentes.filter(
            (docente) => docente.clave_empleado !== claveEmpleado
          )
        );
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      toast({
        title: "Error al eliminar docente",
        description: error.message || "Intenta nuevamente.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Text color="red.500" fontSize="lg">
          {error}
        </Text>
      </Flex>
    );
  }

  return (
    <Box bg="#EDF2F7" minH="100vh" p={8}>
      <Flex justify="center" mb={6}>
        <Heading fontSize="3xl" color="#2B6CB0">
          Panel de CATT
        </Heading>
      </Flex>
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
        {/* Usuarios */}
        <Card boxShadow="lg" borderRadius="md">
          <CardHeader bg="#2B6CB0" color="white" p={4} borderRadius="md">
            Usuarios
          </CardHeader>
          <CardBody p={4}>
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <Box key={usuario.boleta} mb={4}>
                  <Text fontWeight="bold">Nombre:</Text>
                  <Text>{usuario.nombre_alumno}</Text>
                  <Text fontWeight="bold">Boleta:</Text>
                  <Text>{usuario.boleta}</Text>
                  <Text fontWeight="bold">Correo:</Text>
                  <Text>{usuario.correo}</Text>
                  <Flex mt={2} justify="flex-end">
                    <IconButton
                      icon={<EditIcon />}
                      mr={2}
                      colorScheme="blue"
                      onClick={() => handleEditUser(usuario, "usuario")}
                      aria-label="Editar usuario"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleEliminarUsuario(usuario.boleta)}
                      aria-label="Eliminar usuario"
                    />
                  </Flex>
                </Box>
              ))
            ) : (
              <Text>No hay usuarios registrados.</Text>
            )}
          </CardBody>
        </Card>

        {/* Docentes */}
        <Card boxShadow="lg" borderRadius="md">
          <CardHeader bg="#2B6CB0" color="white" p={4} borderRadius="md">
            Docentes
          </CardHeader>
          <CardBody p={4}>
            {docentes.length > 0 ? (
              docentes.map((docente) => (
                <Box key={docente.clave_empleado} mb={4}>
                  <Text fontWeight="bold">Nombre:</Text>
                  <Text>{docente.nombre_profe}</Text>
                  <Text fontWeight="bold">Correo:</Text>
                  <Text>{docente.correo}</Text>
                  <Text fontWeight="bold">Clave:</Text>
                  <Text>{docente.clave_empleado}</Text>
                  <Flex mt={2} justify="flex-end">
                    <IconButton
                      icon={<EditIcon />}
                      mr={2}
                      colorScheme="blue"
                      onClick={() => handleEditUser(docente, "docente")}
                      aria-label="Editar docente"
                    />
                    <IconButton
                      icon={<DeleteIcon />}
                      colorScheme="red"
                      onClick={() => handleEliminarDocente(docente.clave_empleado)}
                      aria-label="Eliminar docente"
                    />
                  </Flex>
                </Box>
              ))
            ) : (
              <Text>No hay docentes registrados.</Text>
            )}
          </CardBody>
        </Card>
      </Grid>
      {/* Modal para editar perfil */}
      {selectedUser && (
        <EditProfileModal
          userData={selectedUser}
          editType={editType} // Pasar tipo de edición
        />
      )}
    </Box>
  );
};

export default DashboardCatt;
