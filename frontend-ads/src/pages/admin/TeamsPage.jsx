import React, { useState, useEffect } from 'react';
import {
	Box,
	Button,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Input,
	useToast,
	Tag,
	Flex,
	Text,
	IconButton,
	useDisclosure,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { consultarEquipos } from '../../api';
import CreateTeamModal from '../common/CreateTeamModal';
import EditTeamModal from '../common/EditTeamModal';
import DeleteTeamButton from '../common/DeleteTeamButton';

const TeamsPage = () => {
	const toast = useToast();
	const [filters, setFilters] = useState({ nombre_equipo: '', lider: '' });
	const [teams, setTeams] = useState([]);
	const [filteredTeams, setFilteredTeams] = useState([]);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [editingTeam, setEditingTeam] = useState(null);

	// Cargar equipos desde el backend
	const fetchTeams = async () => {
		try {
			const token = localStorage.getItem('log-token');
			if (!token) {
				toast({
					id: 'no-token',
					title: 'Error',
					description: 'Token no encontrado.',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
				return;
			}
			const response = await consultarEquipos(token, {});
			if (response.success) {
				setTeams(response.data || []);
				setFilteredTeams(response.data || []); // Inicializar equipos filtrados
				toast({
					id: 'teams-loaded',
					title: 'Equipos cargados.',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
			} else {
				toast({
					id: 'error-loading',
					title: 'Error al cargar equipos',
					description: response.message,
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				id: 'server-error',
				title: 'Error del servidor',
				description: 'No se pudieron cargar los equipos.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	// Aplicar filtro en el frontend
	const applyFilters = () => {
		let filtered = teams;

		// Filtrar por nombre del equipo
		if (filters.nombre_equipo) {
			filtered = filtered.filter((team) =>
				team.nombre_equipo
					.toLowerCase()
					.includes(filters.nombre_equipo.toLowerCase())
			);
		}

		// Filtrar por líder
		if (filters.lider) {
			filtered = filtered.filter((team) =>
				team.lider.toLowerCase().includes(filters.lider.toLowerCase())
			);
		}

		setFilteredTeams(filtered);
	};

	// Ejecutar la función de cargar equipos cuando se monta el componente
	useEffect(() => {
		fetchTeams();
	}, []);

	// Ejecutar filtros cada vez que cambien los valores del filtro
	useEffect(() => {
		applyFilters();
	}, [filters]);

	return (
		<Box
			p={4}
			bg="#EDF2F7"
			minH="100vh"
			display="flex"
			flexDirection="column"
			alignItems="center"
		>
			<Box
				w="full"
				maxW="1200px"
				bg="white"
				p={6}
				rounded="md"
				shadow="md"
				mb={4}
			>
				<Flex
					direction={{ base: 'column', md: 'row' }}
					gap={4}
					align={{ md: 'center' }}
					mb={4}
				>
					<Input
						placeholder="Buscar por nombre del equipo"
						value={filters.nombre_equipo}
						onChange={(e) =>
							setFilters({ ...filters, nombre_equipo: e.target.value })
						}
						size="sm"
					/>
					<Input
						placeholder="Buscar por líder"
						value={filters.lider}
						onChange={(e) => setFilters({ ...filters, lider: e.target.value })}
						size="sm"
					/>
					<IconButton
						aria-label="Aplicar filtro"
						icon={<SearchIcon />}
						colorScheme="blue"
						size="sm"
						onClick={applyFilters}
					/>
				</Flex>
				<Button
					colorScheme="green"
					size="sm"
					onClick={() => {
						setEditingTeam(null);
						onOpen();
					}}
				>
					Crear Equipo
				</Button>
				<CreateTeamModal
					isOpen={isOpen}
					onClose={onClose}
					editingTeam={editingTeam}
					onSave={() => fetchTeams()} // Recargar equipos al guardar
				/>
			</Box>

			<Box
				w="full"
				maxW="1200px"
				bg="white"
				rounded="md"
				shadow="md"
				overflowX="auto"
				overflowY="hidden"
			>
				<Table
					variant="simple"
					colorScheme="gray"
					size="sm"
				>
					<Thead>
						<Tr>
							<Th textAlign="center">Nombre del Equipo</Th>
							<Th textAlign="center">Líder</Th>
							<Th textAlign="center">Estado</Th>
							<Th textAlign="center">Acciones</Th>
						</Tr>
					</Thead>
					<Tbody>
						{filteredTeams.map((team) => (
							<Tr key={team.id_equipo}>
								<Td textAlign="center">{team.nombre_equipo}</Td>
								<Td textAlign="center">{team.lider}</Td>
								<Td textAlign="center">
									<Tag colorScheme={team.estado === 'A' ? 'green' : 'red'}>
										{team.estado === 'A' ? 'Activo' : 'Inactivo'}
									</Tag>
								</Td>
								<Td textAlign="center">
									<Flex
										gap={2}
										justifyContent="center"
									>
										{/* <EditTeamModal teamData={team} /> */}
										<DeleteTeamButton teamData={team} />
									</Flex>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
				{filteredTeams.length === 0 && (
					<Box
						p={4}
						textAlign="center"
					>
						<Text>No se encontraron equipos.</Text>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default TeamsPage;
