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
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import EditProfileModal from './EditProfileModal';
import DeleteProfileButton from './DeleteProfileButton';
import DeleteTeamButton from './DeleteTeamButton';
import EditTeamModal from './EditTeamModal';
import UpdateProtocolModal from './UpdateProtocolModal';
import EditProtocolModal from './EditProtocolModal';
import DeleteProtocolButton from './DeleteProtocolButton';
import { consultarEquipos, consultarUsuarios } from '../../api';
import { jwtDecode } from 'jwt-decode';

const DashboardStudent = () => {
	const [token, setToken] = useState('');
	const [miEquipo, setMiEquipo] = useState(null);
	const [perfilUsuario, setPerfilUsuario] = useState(null);

	useEffect(() => {
		// Obtener el token desde el localStorage
		const storedToken = localStorage.getItem('log-token');
		setToken(storedToken);

		if (storedToken) {
			// Decodificar el token para obtener la boleta
			const payload = jwtDecode(storedToken);
			const { boleta } = payload;

			// Obtener la información del equipo
			consultarEquipos(storedToken, {}).then((response) => {
				if (response.success) {
					setMiEquipo(response.data[0]);
				} else {
					setMiEquipo(null);
				}
			});

			// Obtener la información del usuario
			consultarUsuarios(storedToken, { boleta }).then((response) => {
				if (response.success) {
					setPerfilUsuario(response.data[0]);
				} else {
					setPerfilUsuario(null);
				}
			});
		}
	}, []);

	return (
		<Box
			bg="#EDF2F7"
			minH="100vh"
			p={8}
		>
			<Flex
				justify="center"
				mb={6}
			>
				<Heading
					fontSize="3xl"
					color="#2B6CB0"
				>
					Panel de Estudiante
				</Heading>
			</Flex>
			<Grid
				templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
				gap={6}
			>
				{/* Información del Equipo */}
				<Card
					boxShadow="lg"
					borderRadius="md"
				>
					<CardHeader
						bg="#2B6CB0"
						color="white"
						p={4}
						borderRadius="md"
					>
						Información del Equipo
					</CardHeader>
					<CardBody p={4}>
						{miEquipo ? (
							<>
								<Text fontWeight="bold">Nombre del Equipo:</Text>
								<Text mb={2}>{miEquipo.nombre_equipo}</Text>

								<Text fontWeight="bold">Título:</Text>
								<Text mb={2}>{miEquipo.titulo}</Text>

								<Text fontWeight="bold">Director:</Text>
								<Text mb={2}>{miEquipo.director}</Text>

								<Text fontWeight="bold">Director 2:</Text>
								<Text mb={2}>{miEquipo.director_2}</Text>

								<Text fontWeight="bold">PDF Subido:</Text>
								<Text
									color={miEquipo.pdf ? '#38A169' : '#E53E3E'}
									fontWeight="bold"
								>
									{miEquipo.pdf ? 'Sí' : 'No'}
								</Text>

								<Text fontWeight="bold">Líder:</Text>
								<Text mb={2}>{miEquipo.lider}</Text>

								<Text fontWeight="bold">Integrantes:</Text>
								<Text mb={2}>
									{miEquipo.integrantes
										? miEquipo.integrantes.join(', ')
										: 'Sin integrantes'}
								</Text>

								<Flex
									mt={4}
									justify="space-between"
								>
									{/* Pasar la información del equipo al modal */}
									<EditTeamModal teamData={miEquipo} />
									<DeleteTeamButton />
								</Flex>
							</>
						) : (
							<Text>No tienes un equipo registrado actualmente.</Text>
						)}
					</CardBody>
				</Card>

				{/* Información del Perfil */}
				<Card
					boxShadow="lg"
					borderRadius="md"
				>
					<CardHeader
						bg="#2B6CB0"
						color="white"
						p={4}
						borderRadius="md"
					>
						Información del Perfil
					</CardHeader>
					<CardBody p={4}>
						{perfilUsuario ? (
							<>
								<Text fontWeight="bold">Nombre:</Text>
								<Text mb={2}>{perfilUsuario.nombre}</Text>

								<Text fontWeight="bold">Boleta:</Text>
								<Text mb={2}>
									{perfilUsuario.boleta || perfilUsuario.clave_empleado}
								</Text>

								<Text fontWeight="bold">Correo:</Text>
								<Text mb={2}>{perfilUsuario.correo}</Text>

								<Text fontWeight="bold">Estado:</Text>
								<Text
									fontSize="lg"
									fontWeight="bold"
									color={perfilUsuario.estado === 'A' ? '#38A169' : '#E53E3E'}
								>
									{perfilUsuario.estado === 'A' ? 'Activo' : 'Inactivo'}
								</Text>
							</>
						) : (
							<Text>No se encontró información del perfil.</Text>
						)}

						<Flex
							mt={4}
							justify="space-between"
						>
							<EditProfileModal userData={perfilUsuario} />
							<DeleteProfileButton />
						</Flex>
					</CardBody>
				</Card>
				{/* Información del Protocolo */}
				<Card
					boxShadow="lg"
					borderRadius="md"
				>
					<CardHeader
						bg="#2B6CB0"
						color="white"
						p={4}
						borderRadius="md"
					>
						Información del Protocolo
					</CardHeader>
					<CardBody p={4}>
						<Text fontWeight="bold">Líder del Equipo:</Text>
						<Text mb={2}>2025033811</Text>

						<Text fontWeight="bold">Título del Protocolo:</Text>
						<Text mb={2}>Real Madrid</Text>

						<Text fontWeight="bold">Academia:</Text>
						<Text mb={2}>ISC</Text>

						<Flex
							mt={4}
							justify="space-between"
						>
							<EditProtocolModal />
							<DeleteProtocolButton />
						</Flex>
					</CardBody>
				</Card>

				{/* Sinodales Asignados */}
				<Card
					boxShadow="lg"
					borderRadius="md"
				>
					<CardHeader
						bg="#2B6CB0"
						color="white"
						p={4}
						borderRadius="md"
					>
						Sinodales Asignados
					</CardHeader>
					<CardBody p={4}>
						{miEquipo ? (
							<>
								<Text fontWeight="bold">Sinodal 1:</Text>
								<Text mb={2}>{miEquipo.sinodal_1 || 'Pendiente'}</Text>

								<Text fontWeight="bold">Sinodal 2:</Text>
								<Text mb={2}>{miEquipo.sinodal_2 || 'Pendiente'}</Text>

								<Text fontWeight="bold">Sinodal 3:</Text>
								<Text>{miEquipo.sinodal_3 || 'Pendiente'}</Text>
							</>
						) : (
							<Text>No hay sinodales asignados actualmente.</Text>
						)}
					</CardBody>
				</Card>

				{/* Etapa del Protocolo */}
				<Card
					boxShadow="lg"
					borderRadius="md"
				>
					<CardHeader
						bg="#2B6CB0"
						color="white"
						p={4}
						borderRadius="md"
					>
						Etapa del Protocolo
					</CardHeader>
					<CardBody p={4}>
						<Text fontWeight="bold">Etapa Actual:</Text>
						<Text
							fontSize="lg"
							fontWeight="bold"
							color="#D69E2E"
						>
							Revisión
						</Text>
					</CardBody>
				</Card>

				{/* Actualizar Protocolo */}
				<Card
					boxShadow="lg"
					borderRadius="md"
				>
					<CardHeader
						bg="#2B6CB0"
						color="white"
						p={4}
						borderRadius="md"
					>
						Actualizar Protocolo
					</CardHeader>
					<CardBody p={4}>
						<Text fontWeight="bold">
							Sube un nuevo archivo PDF si es necesario.
						</Text>
						<Flex
							mt={4}
							justify="center"
						>
							<UpdateProtocolModal />
						</Flex>
					</CardBody>
				</Card>
			</Grid>
		</Box>
	);
};

export default DashboardStudent;
