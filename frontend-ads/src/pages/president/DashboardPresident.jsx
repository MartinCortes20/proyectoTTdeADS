import {
	Box,
	Grid,
	Card,
	CardHeader,
	CardBody,
	Text,
	Heading,
	Flex,
	Button,
	Spinner,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { consultarUsuarios, consultarEquipos, consultarProtocolos, consultarCalificaciones } from '../../api';

const DashboardPresidente = () => {
	const [docentes, setDocentes] = useState([]);
	const [equipos, setEquipos] = useState([]);
	const [protocolos, setProtocolos] = useState([]);
	const [calificaciones, setCalificaciones] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Llamadas a la API
				const [docentesResp, equiposResp, protocolosResp, calificacionesResp] = await Promise.all([
					consultarUsuarios({}, { rol: 'docente' }),
					consultarEquipos({}),
					consultarProtocolos({}),
					consultarCalificaciones({}),
				]);

				setDocentes(docentesResp.data || []);
				setEquipos(equiposResp.data || []);
				setProtocolos(protocolosResp.data || []);
				setCalificaciones(calificacionesResp.data || []);
			} catch (err) {
				console.error('Error al cargar los datos:', err);
				setError('Hubo un error al cargar los datos.');
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

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

	// Renderizar botones para docentes (actualizar, eliminar)
	const renderDocenteActions = (docente) => (
		<Flex mt={4} justify="space-between">
			<Button colorScheme="blue" onClick={() => console.log(`Actualizar docente: ${docente.id_usuario}`)}>
				Actualizar
			</Button>
			<Button colorScheme="red" onClick={() => console.log(`Eliminar docente: ${docente.id_usuario}`)}>
				Eliminar
			</Button>
		</Flex>
	);

	return (
		<Box bg="#EDF2F7" minH="100vh" p={8}>
			<Flex justify="center" mb={6}>
				<Heading fontSize="3xl" color="#2B6CB0">
					Panel del Presidente de Academia
				</Heading>
			</Flex>
			<Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
				{/* Docentes */}
				<Card boxShadow="lg" borderRadius="md">
					<CardHeader bg="#2B6CB0" color="white" p={4} borderRadius="md">
						Docentes
					</CardHeader>
					<CardBody p={4}>
						{docentes.length > 0 ? (
							docentes.map((docente) => (
								<Box key={docente.id_usuario} mb={4}>
									<Text fontWeight="bold">Nombre:</Text>
									<Text>{docente.nombre}</Text>
									<Text fontWeight="bold">Correo:</Text>
									<Text>{docente.correo}</Text>
									{renderDocenteActions(docente)}
								</Box>
							))
						) : (
							<Text>No hay docentes registrados.</Text>
						)}
					</CardBody>
				</Card>

				{/* Equipos */}
				<Card boxShadow="lg" borderRadius="md">
					<CardHeader bg="#2B6CB0" color="white" p={4} borderRadius="md">
						Equipos
					</CardHeader>
					<CardBody p={4}>
						{equipos.length > 0 ? (
							equipos.map((equipo) => (
								<Box key={equipo.id_equipo} mb={4}>
									<Text fontWeight="bold">Nombre del Equipo:</Text>
									<Text>{equipo.nombre_equipo}</Text>
									<Text fontWeight="bold">Líder:</Text>
									<Text>{equipo.lider}</Text>
								</Box>
							))
						) : (
							<Text>No hay equipos registrados.</Text>
						)}
					</CardBody>
				</Card>

				{/* Protocolos */}
				<Card boxShadow="lg" borderRadius="md">
					<CardHeader bg="#2B6CB0" color="white" p={4} borderRadius="md">
						Protocolos
					</CardHeader>
					<CardBody p={4}>
						{protocolos.length > 0 ? (
							protocolos.map((protocolo) => (
								<Box key={protocolo.id_protocolo} mb={4}>
									<Text fontWeight="bold">Título:</Text>
									<Text>{protocolo.titulo}</Text>
									<Text fontWeight="bold">Academia:</Text>
									<Text>{protocolo.academia}</Text>
								</Box>
							))
						) : (
							<Text>No hay protocolos registrados.</Text>
						)}
					</CardBody>
				</Card>

				{/* Calificaciones */}
				<Card boxShadow="lg" borderRadius="md">
					<CardHeader bg="#2B6CB0" color="white" p={4} borderRadius="md">
						Calificaciones
					</CardHeader>
					<CardBody p={4}>
						{calificaciones.length > 0 ? (
							calificaciones.map((calificacion) => (
								<Box key={calificacion.id_calificacion} mb={4}>
									<Text fontWeight="bold">Protocolo:</Text>
									<Text>{calificacion.protocolo}</Text>
									<Text fontWeight="bold">Calificación:</Text>
									<Text>{calificacion.calificacion}</Text>
								</Box>
							))
						) : (
							<Text>No hay calificaciones disponibles.</Text>
						)}
					</CardBody>
				</Card>
			</Grid>
		</Box>
	);
};

export default DashboardPresidente;
