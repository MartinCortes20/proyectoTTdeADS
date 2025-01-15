import React, { useEffect, useState } from 'react';
import {
	Box,
	Grid,
	Card,
	CardHeader,
	CardBody,
	Text,
	Heading,
	Flex,
	useToast,
	Tag,
} from '@chakra-ui/react';
import EditProfileModal from '../common/EditProfileModal';
import DeleteProfileButton from '../common/DeleteProfileButton';
import {
	consultarUsuarios,
	consultarEquipos,
	consultarProtocolos,
} from '../../api';
import { jwtDecode } from 'jwt-decode';

const DashboardSinodal = () => {
	const [perfilUsuario, setPerfilUsuario] = useState(null);
	const [equiposAsignados, setEquiposAsignados] = useState([]);
	const [protocolosAsignados, setProtocolosAsignados] = useState([]);
	const toast = useToast();

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Obtener el token desde el localStorage
				const token = localStorage.getItem('log-token');
				if (!token) {
					toast({
						title: 'Error',
						description: 'Token no encontrado.',
						status: 'error',
						duration: 5000,
						isClosable: true,
					});
					return;
				}

				// Decodificar el token para obtener información del usuario
				const decoded = jwtDecode(token);
				console.log('decoded', decoded);

				// Agregar clave_usuario a los datos
				const requestData = {
					...decoded,
					clave_empleado: decoded.boleta,
				};

				// Consultar información del usuario
				const usuarioResponse = await consultarUsuarios(token, requestData);
				if (usuarioResponse.success) {
					setPerfilUsuario(usuarioResponse.data[0]);
				} else {
					throw new Error(usuarioResponse.message);
				}

				// Consultar equipos asignados
				const equiposResponse = await consultarEquipos(token, requestData);
				if (equiposResponse.success) {
					setEquiposAsignados(equiposResponse.data);
				} else {
					throw new Error(equiposResponse.message);
				}

				// Consultar protocolos asignados
				const protocolosResponse = await consultarProtocolos(
					token,
					requestData
				);
				if (protocolosResponse.success) {
					setProtocolosAsignados(protocolosResponse.data);
				} else {
					throw new Error(protocolosResponse.message);
				}
			} catch (error) {
				toast({
					title: 'Error',
					description: error.message || 'Ocurrió un error al cargar los datos.',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
			}
		};

		fetchData();
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
					Dashboard Docente Sinodal
				</Heading>
			</Flex>

			<Grid
				templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
				gap={6}
			>
				{/* Información del perfil */}
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
					<CardBody>
						{perfilUsuario ? (
							<>
								<Text fontWeight="bold">Nombre:</Text>
								<Text mb={2}>{perfilUsuario.nombre}</Text>

								<Text fontWeight="bold">Correo:</Text>
								<Text mb={2}>{perfilUsuario.correo}</Text>

								<Text fontWeight="bold">Clave Empleado:</Text>
								<Text mb={2}>{perfilUsuario.clave_empleado}</Text>

								<Text fontWeight="bold">Estado:</Text>
								<Text
									color={perfilUsuario.estado === 'A' ? '#38A169' : '#E53E3E'}
									fontWeight="bold"
								>
									{perfilUsuario.estado === 'A' ? 'Activo' : 'Inactivo'}
								</Text>

								<Flex
									mt={4}
									justify="space-between"
								>
									<EditProfileModal userData={perfilUsuario} />
									<DeleteProfileButton userData={perfilUsuario} />
								</Flex>
							</>
						) : (
							<Text>No se encontró información del perfil.</Text>
						)}
					</CardBody>
				</Card>

				{/* Información de equipos */}
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
						Equipos Asignados
					</CardHeader>
					<CardBody>
						{equiposAsignados.length > 0 ? (
							equiposAsignados.map((equipo, index) => (
								<Box
									key={index}
									mb={4}
									p={4}
									bg="gray.50"
									borderRadius="md"
								>
									<Text fontWeight="bold">Nombre del Equipo:</Text>
									<Text mb={2}>{equipo.nombre_equipo}</Text>

									<Text fontWeight="bold">Líder:</Text>
									<Text mb={2}>{equipo.lider}</Text>

									<Text fontWeight="bold">Estado:</Text>
									<Tag
										colorScheme={equipo.estado === 'A' ? 'green' : 'red'}
										variant="subtle"
									>
										{equipo.estado === 'A' ? 'Activo' : 'Inactivo'}
									</Tag>
								</Box>
							))
						) : (
							<Text>No hay equipos asignados.</Text>
						)}
					</CardBody>
				</Card>

				{/* Información de protocolos */}
				<Card
					boxShadow="lg"
					borderRadius="md"
					gridColumn="1 / -1"
				>
					<CardHeader
						bg="#2B6CB0"
						color="white"
						p={4}
						borderRadius="md"
					>
						Protocolos Asignados
					</CardHeader>
					<CardBody>
						<Grid
							templateColumns={{
								base: '1fr',
								md: 'repeat(2, 1fr)',
								lg: 'repeat(3, 1fr)',
							}}
							gap={4}
						>
							{protocolosAsignados.length > 0 ? (
								protocolosAsignados.map((protocolo, index) => (
									<Box
										key={index}
										p={4}
										bg="gray.50"
										borderRadius="md"
										boxShadow="md"
									>
										<Text fontWeight="bold">Título del Protocolo:</Text>
										<Text mb={2}>{protocolo.titulo}</Text>

										<Text fontWeight="bold">Academia:</Text>
										<Text mb={2}>{protocolo.academia}</Text>

										<Text fontWeight="bold">Director:</Text>
										<Text mb={2}>{protocolo.director}</Text>

										<Text fontWeight="bold">Director 2:</Text>
										<Text mb={2}>{protocolo.director_2 || 'N/E'}</Text>

										<Text fontWeight="bold">Estado:</Text>
										<Tag
											colorScheme={
												protocolo.estado === 'Registrado' ? 'yellow' : 'green'
											}
											variant="subtle"
										>
											{protocolo.estado}
										</Tag>

										<Text
											fontWeight="bold"
											mt={2}
										>
											Estatus:
										</Text>
										<Text mb={2}>{protocolo.estatus}</Text>

										<Text fontWeight="bold">Etapa:</Text>
										<Text mb={2}>{protocolo.etapa}</Text>

										<Text fontWeight="bold">PDF Subido:</Text>
										<Text
											color={
												protocolo.pdf !== 'EN PROGRESO'
													? 'green.500'
													: 'red.500'
											}
										>
											{protocolo.pdf !== 'EN PROGRESO' ? 'Sí' : 'No'}
										</Text>

										<Text fontWeight="bold">Sinodales:</Text>
										<Text>Sinodal 1: {protocolo.sinodal_1 || 'Pendiente'}</Text>
										<Text>Sinodal 2: {protocolo.sinodal_2 || 'Pendiente'}</Text>
										<Text>Sinodal 3: {protocolo.sinodal_3 || 'Pendiente'}</Text>
									</Box>
								))
							) : (
								<Text>No hay protocolos asignados.</Text>
							)}
						</Grid>
					</CardBody>
				</Card>
			</Grid>
		</Box>
	);
};

export default DashboardSinodal;
