// ProtocolsPage.js
import {
	Box,
	Button,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Input,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

const ProtocolsPage = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const [editing, setEditing] = useState(false);

	const handleSave = () => {
		toast({
			title: editing ? 'Protocolo actualizado.' : 'Protocolo creado.',
			description: 'La operación se realizó exitosamente.',
			status: 'success',
			duration: 5000,
			isClosable: true,
			position: 'top',
		});
		onClose();
	};

	return (
		<Box
			p={8}
			bg="#EDF2F7"
			minH="100vh"
		>
			<Button
				colorScheme="blue"
				mb={4}
				onClick={() => {
					setEditing(false);
					onOpen();
				}}
			>
				Crear Protocolo
			</Button>

			<Table
				variant="simple"
				bg="white"
				boxShadow="lg"
				borderRadius="md"
			>
				<Thead>
					<Tr>
						<Th>Título</Th>
						<Th>Líder</Th>
						<Th>Estado</Th>
						<Th>Acciones</Th>
					</Tr>
				</Thead>
				<Tbody>
					<Tr>
						<Td>Protocolo Alpha</Td>
						<Td>Juan Pérez</Td>
						<Td>En Revisión</Td>
						<Td>
							<Button
								colorScheme="yellow"
								size="sm"
								mr={2}
								onClick={() => {
									setEditing(true);
									onOpen();
								}}
							>
								Editar
							</Button>
							<Button
								colorScheme="red"
								size="sm"
							>
								Eliminar
							</Button>
						</Td>
					</Tr>
				</Tbody>
			</Table>

			{/* Modal para agregar/editar protocolo */}
			<Modal
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						{editing ? 'Editar Protocolo' : 'Crear Protocolo'}
					</ModalHeader>
					<ModalBody>
						<Input
							placeholder="Título del Protocolo"
							mb={4}
						/>
						<Input
							placeholder="Líder"
							mb={4}
						/>
						<Input
							placeholder="Estado"
							mb={4}
						/>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							onClick={handleSave}
						>
							Guardar
						</Button>
						<Button
							onClick={onClose}
							ml={3}
						>
							Cancelar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	);
};

export default ProtocolsPage;
