import React, { useState, useEffect } from 'react';
import {
	Box,
	FormControl,
	FormLabel,
	Select,
	Button,
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

	console.log(selectedProtocol, selectedTeam);
	return (
		<Box
			p={8}
			bg="#EDF2F7"
			minH="100vh"
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
		>
			<Box
				bg="white"
				p={6}
				borderRadius="md"
				boxShadow="lg"
			>
				<FormControl mb={4}>
					<FormLabel>Seleccionar Equipo</FormLabel>
					<Select
						placeholder="Seleccione un equipo"
						value={selectedTeam}
						onChange={(e) => setSelectedTeam(e.target.value)}
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

				<FormControl mb={4}>
					<FormLabel>Seleccionar Protocolo</FormLabel>
					<Select
						placeholder="Seleccione un protocolo"
						value={selectedProtocol}
						onChange={(e) => setSelectedProtocol(e.target.value)}
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

				<Button
					colorScheme="blue"
					onClick={handleAssign}
				>
					Asignar Sinodales
				</Button>
			</Box>
		</Box>
	);
};

export default AssignJudgesPage;
