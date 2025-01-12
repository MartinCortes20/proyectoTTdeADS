import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	FormControl,
	FormLabel,
	Input,
	Select,
	useDisclosure,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

const EditTeamModal = ({ teamData, onSave }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	// Estado para manejar los datos del equipo
	const [formData, setFormData] = useState({
		nombre_equipo: teamData?.nombre_equipo || '',
		titulo: teamData?.titulo || '',
		director: teamData?.director || '',
		director_2: teamData?.director_2 || '',
		academia: teamData?.academia || '',
		integrantes_boletas: teamData?.integrantes_boletas || [''], // Mínimo dos integrantes
		lider: teamData?.lider || '',
	});

	const handleInputChange = (key, value) => {
		setFormData({ ...formData, [key]: value });
	};

	const handleMemberChange = (index, value) => {
		const updatedMembers = [...formData.integrantes_boletas];
		updatedMembers[index] = value;
		setFormData({ ...formData, integrantes_boletas: updatedMembers });
	};

	const handleAddMember = () => {
		if (formData.integrantes_boletas.length < 5) {
			setFormData({
				...formData,
				integrantes_boletas: [...formData.integrantes_boletas, ''],
			});
		} else {
			toast({
				title: 'Máximo alcanzado.',
				description: 'Solo se permiten hasta 5 miembros en el equipo.',
				status: 'warning',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
		}
	};

	const handleSave = () => {
		onSave(formData); // Callback para guardar los cambios
		toast({
			title: 'Equipo actualizado.',
			description: 'La información del equipo ha sido guardada exitosamente.',
			status: 'success',
			duration: 5000,
			isClosable: true,
			position: 'top',
		});
		onClose();
	};

	return (
		<>
			<Button
				colorScheme="yellow"
				onClick={onOpen}
			>
				Editar Equipo
			</Button>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Editar Equipo</ModalHeader>
					<ModalBody>
						<VStack
							spacing={4}
							align="stretch"
						>
							<FormControl>
								<FormLabel>Nombre del Equipo</FormLabel>
								<Input
									placeholder="Nuevo nombre del equipo"
									value={formData.nombre_equipo}
									onChange={(e) =>
										handleInputChange('nombre_equipo', e.target.value)
									}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Título del Protocolo</FormLabel>
								<Input
									placeholder="Nuevo título del protocolo"
									value={formData.titulo}
									onChange={(e) => handleInputChange('titulo', e.target.value)}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Director</FormLabel>
								<Input
									placeholder="Nuevo nombre del director"
									value={formData.director}
									onChange={(e) =>
										handleInputChange('director', e.target.value)
									}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Director 2 (Opcional)</FormLabel>
								<Input
									placeholder="Nuevo nombre del segundo director"
									value={formData.director_2}
									onChange={(e) =>
										handleInputChange('director_2', e.target.value)
									}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Miembros del Equipo</FormLabel>
								{formData.integrantes_boletas.map((member, index) => (
									<Input
										key={index}
										placeholder={`Boleta Miembro ${index + 1}`}
										value={member}
										onChange={(e) => handleMemberChange(index, e.target.value)}
										mb={2}
									/>
								))}
								<Button
									onClick={handleAddMember}
									colorScheme="blue"
									mt={2}
								>
									Añadir Miembro
								</Button>
							</FormControl>

							<FormControl>
								<FormLabel>Líder del Equipo</FormLabel>
								<Select
									placeholder="Seleccione al líder"
									value={formData.lider}
									onChange={(e) => handleInputChange('lider', e.target.value)}
								>
									{formData.integrantes_boletas.map((member, index) => (
										<option
											key={index}
											value={member}
										>
											{member || `Boleta Miembro ${index + 1}`}
										</option>
									))}
								</Select>
							</FormControl>
						</VStack>
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
		</>
	);
};

export default EditTeamModal;
