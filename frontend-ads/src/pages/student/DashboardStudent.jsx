import {
	Box,
	Grid,
	Card,
	CardHeader,
	CardBody,
	Text,
	Heading,
	Flex,
	StepIcon,
	StepNumber,
	Stepper,
	Step,
	StepIndicator,
	StepStatus,
	StepTitle,
	StepDescription,
	StepSeparator,
	useSteps,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import EditProfileModal from './EditProfileModal';
import DeleteProfileButton from './DeleteProfileButton';
import DeleteTeamButton from './DeleteTeamButton';
import EditTeamModal from './EditTeamModal';
import UpdateProtocolModal from './UpdateProtocolModal';
import EditProtocolModal from './EditProtocolModal';
import DeleteProtocolButton from './DeleteProtocolButton';
import {
	consultarEquipos,
	consultarUsuarios,
	consultarProtocolos,
} from '../../api';
import { jwtDecode } from 'jwt-decode';

const DashboardStudent = () => {
	const { activeStep, setActiveStep } = useSteps({ index: 0 });
	const [miEquipo, setMiEquipo] = useState(null);
	const [perfilUsuario, setPerfilUsuario] = useState(null);
	const [miProtocolo, setMiProtocolo] = useState(null);

	const steps = [
		{
			title: 'Perfil Completado',
			description: 'Información del perfil cargada',
		},
		{ title: 'Equipo Creado', description: 'Equipo registrado y asignado' },
		{
			title: 'Protocolo Registrado',
			description: 'Protocolo creado y asignado',
		},
		{
			title: 'Subir PDF de Protocolo',
			description: 'PDF Protocolo asignado',
		},
	];

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Obtener el token desde el localStorage
				const storedToken = localStorage.getItem('log-token');
				if (!storedToken) {
					console.error('Token no encontrado.');
					return;
				}

				// Decodificar el token para obtener la boleta
				const payload = jwtDecode(storedToken);
				const { boleta } = payload;

				// Consultar equipos
				const equiposResponse = await consultarEquipos(storedToken, {});
				if (equiposResponse.success) {
					setMiEquipo(equiposResponse.data[0]);
				} else {
					console.error('Error al consultar equipos:', equiposResponse.message);
					setMiEquipo(null);
				}

				// Consultar usuario
				const usuariosResponse = await consultarUsuarios(storedToken, {
					boleta,
				});
				if (usuariosResponse.success) {
					setPerfilUsuario(usuariosResponse.data[0]);
				} else {
					console.error(
						'Error al consultar usuarios:',
						usuariosResponse.message
					);
					setPerfilUsuario(null);
				}

				// Consultar protocolos
				const protocolosResponse = await consultarProtocolos(storedToken, {
					boleta,
				});
				if (protocolosResponse.success) {
					setMiProtocolo(protocolosResponse.data[0]);
				} else {
					console.error(
						'Error al consultar protocolos:',
						protocolosResponse.message
					);
					setMiProtocolo(null);
				}
			} catch (error) {
				console.error('Error en fetchData:', error);
			}
		};

		fetchData();
	}, []);

	useEffect(() => {
		// Actualizar el Stepper dinámicamente
		if (perfilUsuario) {
			setActiveStep(1);
		}
		if (miEquipo) {
			setActiveStep(2);
		}
		if (miProtocolo) {
			setActiveStep(3);
		}
	}, [perfilUsuario, miEquipo, miProtocolo, setActiveStep]);
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

			{/* Stepper */}
			<Box mb={8}>
				<Stepper
					index={activeStep}
					colorScheme="blue"
					size="lg"
					gap="0"
					my="8"
				>
					{steps.map((step, index) => (
						<Step key={index}>
							<StepIndicator>
								<StepStatus
									complete={<StepIcon />}
									incomplete={<StepNumber />}
									active={<StepNumber />}
								/>
							</StepIndicator>

							<Box ml={4}>
								<StepTitle>{step.title}</StepTitle>
								<StepDescription>{step.description}</StepDescription>
							</Box>

							{index < steps.length - 1 && <StepSeparator />}
						</Step>
					))}
				</Stepper>
			</Box>

			{/* Información principal */}
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
								<Text mb={2}>{perfilUsuario.boleta}</Text>

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
						{miProtocolo ? (
							<>
								<Text fontWeight="bold">Título del Protocolo:</Text>
								<Text mb={2}>{miProtocolo.titulo}</Text>

								<Text fontWeight="bold">Academia:</Text>
								<Text mb={2}>{miProtocolo.academia}</Text>

								<Text fontWeight="bold">Director:</Text>
								<Text mb={2}>{miProtocolo.director}</Text>

								<Text fontWeight="bold">Director 2:</Text>
								<Text mb={2}>{miProtocolo.director_2 || 'N/E'}</Text>

								<Text fontWeight="bold">PDF Subido:</Text>
								<Text
									color={miEquipo.pdf ? '#38A169' : '#E53E3E'}
									fontWeight="bold"
								>
									{miEquipo.pdf ? 'Sí' : 'No'}
								</Text>

								<Flex
									mt={4}
									justify="space-between"
								>
									<EditProtocolModal protocolData={miProtocolo} />
									<DeleteProtocolButton />
								</Flex>
							</>
						) : (
							<Text>No tienes un protocolo registrado actualmente.</Text>
						)}
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
						<Text fontWeight="bold">Sinodal 1:</Text>
						<Text mb={2}>{miEquipo?.sinodal_1 || 'Pendiente'}</Text>

						<Text fontWeight="bold">Sinodal 2:</Text>
						<Text mb={2}>{miEquipo?.sinodal_2 || 'Pendiente'}</Text>

						<Text fontWeight="bold">Sinodal 3:</Text>
						<Text>{miEquipo?.sinodal_3 || 'Pendiente'}</Text>
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
