import React, { useState, useEffect } from 'react';
import {
	Box,
	FormControl,
	FormLabel,
	Select,
	Button,
	Text,
	Heading,
	VStack,
	useToast,
} from '@chakra-ui/react';
import {
	consultarProtocolos,
	consultarEquipos,
	asignarSinodales,
} from '../../api';

const AssignJudgesPage = () => {
	const toast = useToast();
	const [protocols, setProtocols] = useState([]);
	const [teams, setTeams] = useState([]);
	const [selectedProtocol, setSelectedProtocol] = useState('');
	const [selectedTeam, setSelectedTeam] = useState('');

	// Cargar protocolos y equipos desde el backend
	useEffect(() => {
		const fetchData = async () => {
			try {
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

				// Obtener equipos
				const responseEquipos = await consultarEquipos(token, {});
				if (responseEquipos.success) {
					setTeams(responseEquipos.data || []);
				} else {
					throw new Error(responseEquipos.message);
				}

				// Obtener protocolos
				const responseProtocols = await consultarProtocolos(token, {});
				if (responseProtocols.success) {
					setProtocols(responseProtocols.data || []);
				} else {
					throw new Error(responseProtocols.message);
				}
			} catch (error) {
				toast({
					title: 'Error al cargar datos',
					description: error.message,
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
			}
		};

		fetchData();
	}, []);

	const handleAssign = async () => {
		if (!selectedTeam || !selectedProtocol) {
			toast({
				title: 'Error',
				description: 'Debe seleccionar un equipo y un protocolo.',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
			return;
		}

		try {
			const token = localStorage.getItem('log-token');

			// Preparar datos para enviar al backend
			const data = {
				equipo: selectedTeam,
				titulo_protocolo: selectedProtocol,
			};

			// Llamar a la API para asignar sinodales
			const response = await asignarSinodales(token, data);

			if (response.success) {
				toast({
					title: 'Sinodales asignados',
					description: `Sinodales asignados para el equipo "${selectedTeam}" y protocolo "${selectedProtocol}".`,
					status: 'success',
					duration: 5000,
					isClosable: true,
				});
				setSelectedTeam('');
				setSelectedProtocol('');
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Ocurrió un error al asignar los sinodales.',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
	};

	const handleReset = () => {
		setSelectedTeam('');
		setSelectedProtocol('');
	};

	return (
		<Box
			p={8}
			bg="#EDF2F7"
			minH="100vh"
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
		>
			<Box
				bg="white"
				p={8}
				borderRadius="md"
				boxShadow="lg"
				w={{ base: '90%', md: '70%', lg: '60%' }}
				minH="80vh"
				display="flex"
				flexDirection="column"
				justifyContent="space-around"
			>
				<VStack
					spacing={6}
					align="stretch"
				>
					<Heading
						as="h2"
						size="lg"
						textAlign="center"
						color="teal.600"
					>
						Asignar Sinodales
					</Heading>
					<Text
						textAlign="center"
						color="gray.600"
					>
						Seleccione un equipo y un protocolo para asignar sinodales.
					</Text>

					<FormControl>
						<FormLabel>Seleccionar Equipo</FormLabel>
						<Select
							placeholder="Seleccione un equipo"
							value={selectedTeam}
							onChange={(e) => setSelectedTeam(e.target.value)}
							bg="gray.50"
						>
							{teams.map((team) => (
								<option
									key={team.id_equipo}
									value={team.nombre_equipo}
								>
									{team.nombre_equipo}
								</option>
							))}
						</Select>
					</FormControl>

					<FormControl>
						<FormLabel>Seleccionar Protocolo</FormLabel>
						<Select
							placeholder="Seleccione un protocolo"
							value={selectedProtocol}
							onChange={(e) => setSelectedProtocol(e.target.value)}
							bg="gray.50"
						>
							{protocols.map((protocol) => (
								<option
									key={protocol.id_protocolo}
									value={protocol.titulo}
								>
									{protocol.titulo}
								</option>
							))}
						</Select>
					</FormControl>

					<VStack spacing={4}>
						<Button
							colorScheme="blue"
							onClick={handleAssign}
							w="full"
						>
							Asignar Sinodales
						</Button>
						<Button
							colorScheme="gray"
							variant="outline"
							onClick={handleReset}
							w="full"
						>
							Reiniciar Selección
						</Button>
					</VStack>
				</VStack>
			</Box>
		</Box>
	);
};

export default AssignJudgesPage;
