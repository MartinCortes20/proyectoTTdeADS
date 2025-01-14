import React, { useState } from 'react';
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
	useToast,
	VStack,
} from '@chakra-ui/react';
import { crearProtocolo } from '../../api';

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

const CreateProtocolModal = ({ isOpen, onClose, onSave }) => {
	const [protocolData, setProtocolData] = useState({
		titulo_protocolo: '',
		academia: '',
		lider_equipo: '',
	});
	const toast = useToast();

	// Manejar cambios en los campos del formulario
	const handleInputChange = (key, value) => {
		setProtocolData((prev) => ({ ...prev, [key]: value }));
	};

	const handleSubmit = async () => {
		try {
			// Obtener el token del usuario
			const token = localStorage.getItem('log-token');
			if (!token) {
				toast({
					title: 'Error',
					description:
						'No se encontró el token de autenticación. Por favor, inicie sesión.',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
				return;
			}

			// Preparar datos para enviar al backend
			const dataToSend = {
				lider_equipo: protocolData.lider_equipo,
				titulo_protocolo: protocolData.titulo_protocolo,
				academia: protocolData.academia,
			};

			// Llamar a la función de API para crear el protocolo
			const response = await crearProtocolo(token, dataToSend);

			if (response.success) {
				toast({
					title: 'Protocolo creado',
					description:
						response.message || 'El protocolo se ha creado exitosamente.',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
				onClose();
				if (onSave) onSave(); // Ejecutar la función de guardado si se proporciona
			} else {
				toast({
					title: 'Error al crear protocolo',
					description: response.message || 'No se pudo crear el protocolo.',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: 'Error del servidor',
				description:
					'Ocurrió un error al crear el protocolo. Por favor, intenta más tarde.',
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
				<ModalHeader>Crear Protocolo</ModalHeader>
				<ModalBody>
					<VStack
						spacing={4}
						align="stretch"
					>
						<FormControl>
							<FormLabel>Título del Protocolo</FormLabel>
							<Input
								placeholder="Ingrese el título del protocolo"
								value={protocolData.titulo_protocolo}
								onChange={(e) =>
									handleInputChange('titulo_protocolo', e.target.value)
								}
								focusBorderColor="blue.500"
							/>
						</FormControl>

						<FormControl>
							<FormLabel>Área/Academia</FormLabel>
							<Select
								placeholder="Seleccione el área o academia"
								value={protocolData.academia}
								onChange={(e) => handleInputChange('academia', e.target.value)}
								focusBorderColor="blue.500"
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
							<FormLabel>Boleta de Líder</FormLabel>
							<Input
								placeholder="Ingrese la boleta del líder"
								value={protocolData.lider_equipo}
								onChange={(e) =>
									handleInputChange('lider_equipo', e.target.value)
								}
								focusBorderColor="blue.500"
							/>
						</FormControl>
					</VStack>
				</ModalBody>
				<ModalFooter>
					<Button
						colorScheme="blue"
						mr={3}
						onClick={handleSubmit}
					>
						Crear
					</Button>
					<Button onClick={onClose}>Cancelar</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CreateProtocolModal;
