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
import { consultarProtocolos } from '../../api';
import CreateProtocolModal from '../common/CreateProtocolModal';
import EditProtocolModal from '../common/EditProtocolModal';
import DeleteProtocolButton from '../common/DeleteProtocolButton';

const ProtocolsPage = () => {
	const toast = useToast();
	const [filters, setFilters] = useState({ titulo: '', academia: '' });
	const [protocols, setProtocols] = useState([]);
	const [filteredProtocols, setFilteredProtocols] = useState([]);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [editingProtocol, setEditingProtocol] = useState(null);

	// Cargar protocolos desde el backend
	const fetchProtocols = async () => {
		try {
			const token = localStorage.getItem('log-token');
			if (!token) {
				toast({
					id: 'no-token',
					title: 'Error',
					description: 'Token no encontrado.',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
				return;
			}
			const response = await consultarProtocolos(token, {});
			if (response.success) {
				setProtocols(response.data || []);
				setFilteredProtocols(response.data || []);
				toast({
					id: 'protocols-loaded',
					title: 'Protocolos cargados.',
					status: 'success',
					duration: 5000,
					isClosable: true,
				});
			} else {
				toast({
					id: 'error-loading',
					title: 'Error al cargar protocolos',
					description: response.message,
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				id: 'server-error',
				title: 'Error del servidor',
				description: 'No se pudieron cargar los protocolos.',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
	};

	// Aplicar filtro en el frontend
	const applyFilters = () => {
		let filtered = protocols;

		if (filters.titulo) {
			filtered = filtered.filter((protocol) =>
				protocol.titulo.toLowerCase().includes(filters.titulo.toLowerCase())
			);
		}

		if (filters.academia) {
			filtered = filtered.filter((protocol) =>
				protocol.academia.toLowerCase().includes(filters.academia.toLowerCase())
			);
		}

		setFilteredProtocols(filtered);
	};

	useEffect(() => {
		fetchProtocols();
	}, []);

	useEffect(() => {
		applyFilters();
	}, [filters]);

	const getTagColor = (value) => {
		switch (value) {
			case 'Pendiente':
				return 'yellow';
			case 'Aprobado':
				return 'green';
			case 'No Aprobado':
				return 'red';
			default:
				return 'gray';
		}
	};

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
						placeholder="Buscar por título"
						value={filters.titulo}
						onChange={(e) => setFilters({ ...filters, titulo: e.target.value })}
						size="sm"
					/>
					<Input
						placeholder="Buscar por academia"
						value={filters.academia}
						onChange={(e) =>
							setFilters({ ...filters, academia: e.target.value })
						}
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
						setEditingProtocol(null);
						onOpen();
					}}
				>
					Crear Protocolo
				</Button>
				<CreateProtocolModal
					isOpen={isOpen}
					onClose={onClose}
					onSave={() => fetchProtocols()}
				/>
			</Box>

			<Box
				w="full"
				maxW="1200px"
				bg="white"
				rounded="md"
				shadow="md"
				overflowX="auto"
				textAlign="center" // Centrar contenido de la tabla
			>
				<Table
					variant="simple"
					colorScheme="gray"
					size="sm"
				>
					<Thead>
						<Tr>
							<Th>Título</Th>
							<Th>Academia</Th>
							<Th>Estado</Th>
							<Th>Etapa</Th>
							<Th>Líder</Th>
							<Th>Director</Th>
							<Th>Director 2</Th>
							<Th>PDF</Th>
							<Th>Sinodal 1</Th>
							<Th>Sinodal 2</Th>
							<Th>Sinodal 3</Th>
							<Th>Calif. Sinodal 1</Th>
							<Th>Calif. Sinodal 2</Th>
							<Th>Calif. Sinodal 3</Th>
							<Th>Dictamen</Th>
							<Th>Fecha Registro</Th>
							<Th>Acciones</Th>
						</Tr>
					</Thead>
					<Tbody>
						{filteredProtocols.map((protocol) => (
							<Tr key={protocol.titulo}>
								<Td>{protocol.titulo}</Td>
								<Td>{protocol.academia}</Td>
								<Td>
									<Tag colorScheme={protocol.estatus === 'A' ? 'green' : 'red'}>
										{protocol.estatus === 'A' ? 'Activo' : 'Inactivo'}
									</Tag>
								</Td>
								<Td>{protocol.etapa}</Td>
								<Td>{protocol.lider}</Td>
								<Td>{protocol.director}</Td>
								<Td>{protocol.director_2}</Td>
								<Td>{protocol.pdf}</Td>
								<Td>{protocol.sinodal_1}</Td>
								<Td>{protocol.sinodal_2}</Td>
								<Td>{protocol.sinodal_3}</Td>
								<Td>
									<Tag colorScheme={getTagColor(protocol.calif_Sinodal1)}>
										{protocol.calif_Sinodal1}
									</Tag>
								</Td>
								<Td>
									<Tag colorScheme={getTagColor(protocol.calif_Sinodal2)}>
										{protocol.calif_Sinodal2}
									</Tag>
								</Td>
								<Td>
									<Tag colorScheme={getTagColor(protocol.calif_Sinodal3)}>
										{protocol.calif_Sinodal3}
									</Tag>
								</Td>
								<Td>
									<Tag
										colorScheme={getTagColor(protocol.dictamen || 'Pendiente')}
									>
										{protocol.dictamen || 'Pendiente'}
									</Tag>
								</Td>
								<Td>{protocol.fecha_registro}</Td>
								<Td>
									<Flex
										gap={2}
										justifyContent="center"
									>
										<EditProtocolModal protocolData={protocol} />
										<DeleteProtocolButton protocolData={protocol} />
									</Flex>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
				{filteredProtocols.length === 0 && (
					<Box
						p={4}
						textAlign="center"
					>
						<Text>No se encontraron protocolos.</Text>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default ProtocolsPage;
