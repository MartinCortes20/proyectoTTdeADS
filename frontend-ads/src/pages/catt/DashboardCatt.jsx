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
import EditProfileModal from './EditProfileModal';
import DeleteProfileButton from './DeleteProfileButton';
import EditTeamModal from './EditTeamModal';
import DeleteTeamButton from './DeleteTeamButton';
import EditProtocolModal from './EditProtocolModal';
import DeleteProtocolButton from './DeleteProtocolButton';
import { consultarEquipos, consultarUsuarios, consultarProtocolos, consultarCalificaciones } from '../../api';

const DashboardCatt = () => {
	const [alumnos, setAlumnos] = useState([]);
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
				const [usuariosResp, docentesResp, equiposResp, protocolosResp, calificacionesResp] =
					await Promise.all([
						consultarUsuarios({}, { rol: 'alumno' }),
						consultarUsuarios({}, { rol: 'docente' }),
						consultarEquipos({}),
						consultarProtocolos({}),
						consultarCalificaciones({}),
					]);

				// Configurar los datos obtenidos
				setAlumnos(usuariosResp.data || []);
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

	return (
		<Box bg="#EDF2F7" minH="100vh" p={8}>
			<Flex justify="center" mb={6}>
				<Heading fontSize="3xl" color="#2B6CB0">
					Panel de CATT
				</Heading>
			</Flex>
			<Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
				{/* Alumnos */}
				<Card boxShadow="lg" borderRadius="md">
					<CardHeader bg="#2B6CB0" color="white" p={4} borderRadius="md">
						Alumnos
					</CardHeader>
					<CardBody p={4}>
						{alumnos.length > 0 ? (
							alumnos.map((alumno) => (
								<Box key={alumno.id_usuario} mb={4}>
									<Text fontWeight="bold">Nombre:</Text>
									<Text>{alumno.nombre}</Text>
									<Flex mt={4} justify="space-between">
										<EditProfileModal userData={alumno} />
										<DeleteProfileButton userId={alumno.id_usuario} />
									</Flex>
								</Box>
							))
						) : (
							<Text>No hay alumnos registrados.</Text>
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
								<Box key={docente.id_usuario} mb={4}>
									<Text fontWeight="bold">Nombre:</Text>
									<Text>{docente.nombre}</Text>
									<Flex mt={4} justify="space-between">
										<EditProfileModal userData={docente} />
										<DeleteProfileButton userId={docente.id_usuario} />
									</Flex>
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
									<Flex mt={4} justify="space-between">
										<EditTeamModal teamData={equipo} />
										<DeleteTeamButton teamId={equipo.id_equipo} />
									</Flex>
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
									<Flex mt={4} justify="space-between">
										<EditProtocolModal protocolData={protocolo} />
										<DeleteProtocolButton protocolId={protocolo.id_protocolo} />
									</Flex>
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

export default DashboardCatt;
