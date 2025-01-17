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
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const EditProfileModal = ({ userData }) => {
	const { token } = useContext(AuthContext);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	// Estados para los datos del formulario
	const [nombre, setNombre] = useState('');
	const [boleta, setBoleta] = useState('');
	const [correoActual, setCorreoActual] = useState('');

	// Cargar datos del usuario cuando se abre el modal
	useEffect(() => {
		if (isOpen) {
			setNombre(userData.nombre || '');
			setBoleta(userData.boleta || '');
			setCorreoActual(userData.correo || '');
		}
	}, [isOpen, userData]);

	// Función para guardar cambios
	const handleSave = async () => {
		const dataToSend = {
			boleta,
			nombre,
			correo_actual: correoActual,
		};

		try {
			console.log(token);
			
			const response = await axios.post(
				'http://localhost:8080/api/gestionTT/usuario/actualizarEstudiante',
				dataToSend,
				{
					headers: {
						'Content-Type': 'application/json',
						'log-token': token,
					},
				}
			);

			toast({
				title: 'Perfil actualizado.',
				description: 'Tu información ha sido guardada exitosamente.',
				status: 'success',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
			onClose();
		} catch (error) {
			toast({
				title: 'Error al actualizar.',
				description:
					error.response?.data.message || 'Ocurrió un error inesperado.',
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
			>
				Editar Perfil
			</Button>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Editar Perfil</ModalHeader>
					<ModalBody>
						<FormControl>
							<FormLabel>Nombre</FormLabel>
							<Input
								placeholder="Tu nombre"
								value={nombre}
								onChange={(e) => setNombre(e.target.value)}
							/>
						</FormControl>
						<FormControl mt={4}>
							<FormLabel>Boleta</FormLabel>
							<Input
								placeholder="Tu boleta"
								value={boleta}
								onChange={(e) => setBoleta(e.target.value)}
							/>
						</FormControl>
						<FormControl mt={4}>
							<FormLabel>Correo Actual</FormLabel>
							<Input
								placeholder="Tu correo actual"
								value={correoActual}
								onChange={(e) => setCorreoActual(e.target.value)}
							/>
						</FormControl>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={handleSave}
						>
							Guardar
						</Button>
						<Button onClick={onClose}>Cancelar</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default EditProfileModal;
