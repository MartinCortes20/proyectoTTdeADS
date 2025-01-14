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
import { useState, useEffect } from 'react';
import { actualizarEquipo } from '../../api';

const academias = [
	'Academia de Programación y Algoritmos',
	'Academia de Inteligencia Artificial y Ciencia de Datos',
	'Academia de Redes y Sistemas Distribuidos',
	'Academia de Desarrollo de Software',
	'Academia de Bases de Datos y Sistemas de Información',
	'Academia de Sistemas Digitales y Electrónica',
	'Academia de Matemáticas y Ciencias Básicas',
	'Academia de Gestión y Administración',
	'Academia de Ética y Habilidades Blandas',
	'Trabajo Terminal y Estancia Profesional',
];

const EditTeamModal = ({ teamData }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	// Estado para manejar los datos del equipo
	const [formData, setFormData] = useState({
		nombre_equipo: '',
		titulo: '',
		director: '',
		director_2: '',
		area: '',
		contrasena: '',
	});

	// Cargar datos del equipo al abrir el modal
	useEffect(() => {
		if (isOpen) {
			setFormData({
				nombre_equipo: teamData?.nombre_equipo || '',
				titulo: teamData?.titulo || '',
				director: teamData?.director || '',
				director_2: teamData?.director_2 || '',
				area: teamData?.area || '',
				contrasena: '',
			});
		}
	}, [isOpen, teamData]);

	// Manejar cambios en los campos del formulario
	const handleInputChange = (key, value) => {
		setFormData({ ...formData, [key]: value });
	};

	// Función para guardar cambios
	const handleSave = async () => {
		// Obtener el token desde localStorage
		const token = localStorage.getItem('log-token');
		if (!token) {
			toast({
				title: 'Error',
				description: 'No se encontró el token de autenticación.',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
			return;
		}

		// Validar que la contraseña no esté vacía
		if (!formData.contrasena) {
			toast({
				title: 'Error',
				description: 'La contraseña es obligatoria para actualizar el equipo.',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
			return;
		}
		try {
			// Preparar los datos para enviar al backend
			const dataToSend = {
				...formData,
			};

			// Llamar a la función de API para actualizar el equipo
			const response = await actualizarEquipo(token, dataToSend);

			if (response.success) {
				toast({
					title: 'Equipo actualizado.',
					description:
						response.message || 'El equipo ha sido actualizado correctamente.',
					status: 'success',
					duration: 5000,
					isClosable: true,
					position: 'top',
				});
				onClose();
				window.location.reload();
			} else {
				toast({
					title: 'Error al actualizar.',
					description: response.message || 'Ocurrió un error inesperado.',
					status: 'error',
					duration: 5000,
					isClosable: true,
					position: 'top',
				});
			}
		} catch (error) {
			toast({
				title: 'Error del servidor.',
				description: 'No se pudo actualizar el equipo.',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
		}
	};

	return (
		<>
			<Button
				colorScheme="yellow"
				onClick={onOpen}
				size="sm"
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
								<FormLabel>Área/Academia</FormLabel>
								<Select
									placeholder="Seleccione el área o academia"
									value={formData.area}
									onChange={(e) => handleInputChange('area', e.target.value)}
								>
									{academias.map((academia, index) => (
										<option
											key={index}
											value={academia}
										>
											{academia}
										</option>
									))}
								</Select>
							</FormControl>

							<FormControl>
								<FormLabel>Contraseña</FormLabel>
								<Input
									type="password"
									placeholder="Tu contraseña para confirmar"
									value={formData.contrasena}
									onChange={(e) =>
										handleInputChange('contrasena', e.target.value)
									}
								/>
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
