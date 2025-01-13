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
	useBreakpointValue,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import EditProfileModal from './EditProfileModal';
import DeleteProfileButton from './DeleteProfileButton';
import DeleteTeamButton from './DeleteTeamButton';
import EditTeamModal from './EditTeamModal';
import UpdateProtocolModal from './UpdatePDFProtocolModal';
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
	const stepperOrientation = useBreakpointValue({
		base: 'vertical',
		md: 'horizontal',
	});

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

	const stepsProtocol = [
		{ title: 'Registro', description: 'Creación inicial del protocolo' },
		{ title: 'Revisión', description: 'Revisión por los responsables' },
		{ title: 'Retroalimentación', description: 'Ajustes y correcciones' },
		{ title: 'Aprobación', description: 'Protocolo aprobado oficialmente' },
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
		// Determinar el paso activo basado en las condiciones
		if (!perfilUsuario) {
			setActiveStep(0);
		} else if (!miEquipo) {
			setActiveStep(1);
		} else if (!miProtocolo) {
			setActiveStep(2);
		} else if (miProtocolo?.pdf === 'EN PROGRESO') {
			setActiveStep(3);
		} else {
			setActiveStep(4); // Último paso, PDF completado
		}
	}, [perfilUsuario, miEquipo, miProtocolo, setActiveStep]);

	console.log(miEquipo, miProtocolo, perfilUsuario);

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
					orientation={stepperOrientation} // Usa la variable para cambiar la orientación
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
									<DeleteTeamButton teamData={miEquipo} />
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
							<DeleteProfileButton userData={perfilUsuario} />
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
									color={
										miProtocolo?.pdf !== 'EN PROGRESO' ? '#38A169' : '#E53E3E'
									}
									fontWeight="bold"
								>
									{miProtocolo?.pdf !== 'EN PROGRESO' ? 'Sí' : 'No'}
								</Text>

								<Flex
									mt={4}
									justify="space-between"
								>
									<EditProtocolModal protocolData={miProtocolo} />
									<DeleteProtocolButton protocolData={miProtocolo} />
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

				{/* Etapas del Protocolo en Stepper */}
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
						Etapas del Protocolo
					</CardHeader>
					<CardBody>
						{miProtocolo ? (
							<Stepper
								index={stepsProtocol.findIndex(
									(step) => step.title === miProtocolo.etapa
								)}
								colorScheme="yellow"
								orientation={stepperOrientation}
								size="lg"
							>
								{stepsProtocol.map((step, index) => (
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
						) : (
							<Text>
								No se encontró información de las etapas del protocolo.
							</Text>
						)}
					</CardBody>
				</Card>

				{/* Actualizar Protocolo */}
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
						{miProtocolo?.pdf !== 'EN PROGRESO'
							? 'Actualizar Protocolo'
							: 'Subir PDF'}
					</CardHeader>
					<CardBody p={4}>
						<Text fontWeight="bold">
							{miProtocolo?.pdf !== 'EN PROGRESO'
								? 'Actualiza los detalles del protocolo o sube un nuevo archivo PDF.'
								: 'Sube un archivo PDF para completar el protocolo.'}
						</Text>
						<Flex
							mt={4}
							justify="center"
						>
							<UpdateProtocolModal
								protocolData={{
									lider: miProtocolo?.lider || miEquipo?.lider || '',
									titulo: miProtocolo?.titulo || miEquipo?.titulo || '',
									director: miProtocolo?.director || miEquipo?.director || '',
									director_2:
										miProtocolo?.director_2 || miEquipo?.director_2 || '',
									academia: miProtocolo?.academia || miEquipo?.academia || '',
								}}
								mode={miProtocolo?.pdf !== 'EN PROGRESO' ? 'update' : 'upload'}
							/>
						</Flex>
					</CardBody>
				</Card>
			</Grid>
		</Box>
	);
};

export default DashboardStudent;
