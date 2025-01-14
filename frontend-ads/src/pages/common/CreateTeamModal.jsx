import React, { useState, useEffect } from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	FormControl,
	FormLabel,
	Input,
	Button,
	VStack,
	Select,
	useToast,
} from '@chakra-ui/react';
import { crearEquipo, actualizarEquipo } from '../../api';

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

const CreateTeamModal = ({ isOpen, onClose, editingTeam, onSave }) => {
	const [teamData, setTeamData] = useState({
		nombre_equipo: '',
		titulo: '',
		integrantes_boletas: [''],
		lider: '',
		director: '',
		director_2: '',
		academia: '',
	});
	const toast = useToast();

	// Cargar datos del equipo en caso de edición
	useEffect(() => {
		if (editingTeam) {
			setTeamData({
				nombre_equipo: editingTeam.nombre_equipo || '',
				titulo: editingTeam.titulo || '',
				integrantes_boletas: editingTeam.integrantes_boletas || [''],
				lider: editingTeam.lider || '',
				director: editingTeam.director || '',
				director_2: editingTeam.director_2 || '',
				academia: editingTeam.academia || '',
			});
		} else {
			setTeamData({
				nombre_equipo: '',
				titulo: '',
				integrantes_boletas: [''],
				lider: '',
				director: '',
				director_2: '',
				academia: '',
			});
		}
	}, [editingTeam]);

	const handleInputChange = (key, value) => {
		setTeamData({ ...teamData, [key]: value });
	};

	const handleMemberChange = (index, value) => {
		const updatedMembers = [...teamData.integrantes_boletas];
		updatedMembers[index] = value;
		setTeamData({ ...teamData, integrantes_boletas: updatedMembers });
	};

	const handleAddMember = () => {
		if (teamData.integrantes_boletas.length < 5) {
			setTeamData({
				...teamData,
				integrantes_boletas: [...teamData.integrantes_boletas, ''],
			});
		} else {
			toast({
				title: 'Máximo alcanzado',
				description: 'Solo se permiten hasta 5 miembros en el equipo.',
				status: 'warning',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	const handleSubmit = async () => {
		try {
			const token = localStorage.getItem('log-token');
			let response;
			if (editingTeam) {
				response = await actualizarEquipo(token, teamData);
			} else {
				response = await crearEquipo(token, teamData);
			}

			if (response.success) {
				toast({
					title: editingTeam ? 'Equipo actualizado' : 'Equipo creado',
					description: `El equipo "${teamData.nombre_equipo}" se ha ${
						editingTeam ? 'actualizado' : 'creado'
					} exitosamente.`,
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
				onSave();
				onClose();
			} else {
				toast({
					title: 'Error',
					description: response.message || 'Ocurrió un error inesperado.',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			console.error('Error en la solicitud:', error);
			toast({
				title: 'Error interno del servidor',
				description:
					'No se pudo completar la solicitud. Intente nuevamente más tarde.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="lg"
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					{editingTeam ? 'Editar Equipo' : 'Crear Equipo'}
				</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack spacing={4}>
						<FormControl>
							<FormLabel>Nombre del Equipo</FormLabel>
							<Input
								placeholder="Ingrese el nombre del equipo"
								value={teamData.nombre_equipo}
								onChange={(e) =>
									handleInputChange('nombre_equipo', e.target.value)
								}
							/>
						</FormControl>

						<FormControl>
							<FormLabel>Título del Equipo</FormLabel>
							<Input
								placeholder="Ingrese el título del equipo"
								value={teamData.titulo}
								onChange={(e) => handleInputChange('titulo', e.target.value)}
							/>
						</FormControl>

						<FormControl>
							<FormLabel>Miembros del Equipo</FormLabel>
							{teamData.integrantes_boletas.map((member, index) => (
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
								size="sm"
							>
								Añadir Miembro
							</Button>
						</FormControl>

						<FormControl>
							<FormLabel>Líder del Equipo</FormLabel>
							<Select
								placeholder="Seleccione al líder"
								value={teamData.lider}
								onChange={(e) => handleInputChange('lider', e.target.value)}
							>
								{teamData.integrantes_boletas.map((member, index) => (
									<option
										key={index}
										value={member}
									>
										{member || `Boleta Miembro ${index + 1}`}
									</option>
								))}
							</Select>
						</FormControl>

						<FormControl>
							<FormLabel>Director</FormLabel>
							<Input
								placeholder="Ingrese la clave del director"
								value={teamData.director}
								onChange={(e) => handleInputChange('director', e.target.value)}
							/>
						</FormControl>

						<FormControl>
							<FormLabel>Director 2 (Opcional)</FormLabel>
							<Input
								placeholder="Ingrese la clave del segundo director"
								value={teamData.director_2}
								onChange={(e) =>
									handleInputChange('director_2', e.target.value)
								}
							/>
						</FormControl>

						<FormControl>
							<FormLabel>Área/Academia</FormLabel>
							<Select
								placeholder="Seleccione el área o academia"
								value={teamData.academia}
								onChange={(e) => handleInputChange('academia', e.target.value)}
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
					</VStack>
				</ModalBody>
				<ModalFooter>
					<Button
						colorScheme="blue"
						mr={3}
						onClick={handleSubmit}
					>
						{editingTeam ? 'Actualizar' : 'Crear'}
					</Button>
					<Button onClick={onClose}>Cancelar</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CreateTeamModal;
