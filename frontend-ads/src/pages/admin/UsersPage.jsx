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
	Select,
	useToast,
	Tag,
	Flex,
	Text,
	IconButton,
	useDisclosure,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { consultarUsuarios } from '../../api';
import EditProfileModal from '../common/EditProfileModal';
import DeleteProfileButton from '../common/DeleteProfileButton';
import CreateUserModal from '../common/CreateUserModal';

const UsersPage = () => {
	const toast = useToast();
	const [filters, setFilters] = useState({ tipo: '', correo_usuario: '' });
	const [users, setUsers] = useState([]); // Datos originales del backend
	const [filteredUsers, setFilteredUsers] = useState([]); // Usuarios filtrados para mostrar en la tabla
	const { isOpen, onOpen, onClose } = useDisclosure();

	// Cargar usuarios desde el backend
	const fetchUsers = async () => {
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
			const response = await consultarUsuarios(token, {});
			if (response.success) {
				setUsers(response.data || []);
				setFilteredUsers(response.data || []); // Inicializar usuarios filtrados
				toast({
					id: 'users-loaded',
					title: 'Usuarios cargados.',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
			} else {
				toast({
					id: 'error-loading',
					title: 'Error al cargar usuarios',
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
				description: 'No se pudieron cargar los usuarios.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	// Aplicar filtro en el frontend
	const applyFilters = () => {
		let filtered = users;

		// Filtrar por correo
		if (filters.correo_usuario) {
			filtered = filtered.filter((user) =>
				user.correo_usuario
					.toLowerCase()
					.includes(filters.correo_usuario.toLowerCase())
			);
		}

		// Filtrar por tipo (Alumno o Docente)
		if (filters.tipo) {
			filtered = filtered.filter((user) => user.tipo === filters.tipo);
		}

		setFilteredUsers(filtered);
	};

	// Ejecutar la función de cargar usuarios cuando se monta el componente
	useEffect(() => {
		fetchUsers();
	}, []);

	// Ejecutar filtros cada vez que cambien los valores del filtro
	useEffect(() => {
		applyFilters();
	}, [filters]);

	console.log(users);

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
						placeholder="Buscar por correo"
						value={filters.correo_usuario}
						onChange={(e) =>
							setFilters({ ...filters, correo_usuario: e.target.value })
						}
						size="sm"
					/>
					<Select
						placeholder="Filtrar por tipo"
						value={filters.tipo}
						onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
						size="sm"
					>
						<option value="Alumno">Alumno</option>
						<option value="Docente">Docente</option>
					</Select>
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
					onClick={onOpen}
				>
					Crear Usuario
				</Button>
				<CreateUserModal
					isOpen={isOpen}
					onClose={onClose}
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
							<Th textAlign="center">Nombre</Th>
							<Th textAlign="center">Correo</Th>
							<Th textAlign="center">Tipo</Th>
							<Th textAlign="center">Identificador</Th>
							<Th textAlign="center">Estado</Th>
							<Th textAlign="center">Acciones</Th>
						</Tr>
					</Thead>
					<Tbody>
						{filteredUsers.map((user) => (
							<Tr key={user.identificador}>
								<Td textAlign="center">{user.nombre_usuario}</Td>
								<Td textAlign="center">{user.correo_usuario}</Td>
								<Td textAlign="center">{user.tipo}</Td>
								<Td textAlign="center">{user.identificador}</Td>
								<Td textAlign="center">
									<Tag colorScheme={user.estado === 'A' ? 'green' : 'red'}>
										{user.estado === 'A' ? 'Activo' : 'Inactivo'}
									</Tag>
								</Td>
								<Td textAlign="center">
									<Flex
										gap={2}
										justifyContent="center"
									>
										<EditProfileModal userData={user} />
										<DeleteProfileButton userData={user} />
									</Flex>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
				{filteredUsers.length === 0 && (
					<Box
						p={4}
						textAlign="center"
					>
						<Text>No se encontraron usuarios.</Text>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default UsersPage;
