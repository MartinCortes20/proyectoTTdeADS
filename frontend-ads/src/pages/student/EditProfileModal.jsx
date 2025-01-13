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
import { useState, useEffect } from 'react';
import { actualizarEstudiante } from '../../api'; // Usa la función del API
import { jwtDecode } from 'jwt-decode';

const EditProfileModal = ({ userData }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	// Estados para los datos del formulario
	const [nombre, setNombre] = useState('');
	const [correoActual, setCorreoActual] = useState('');
	const [correoNuevo, setCorreoNuevo] = useState('');
	const [contrasenaActual, setContrasenaActual] = useState('');
	const [contrasenaNueva, setContrasenaNueva] = useState('');

	// Cargar datos del usuario cuando se abre el modal
	useEffect(() => {
		if (isOpen) {
			setNombre(userData?.nombre || '');
			setCorreoActual(userData?.correo || '');
		}
	}, [isOpen, userData]);

	// Función para guardar cambios
	const handleSave = async () => {
		// Obtener el token del almacenamiento
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

		// Decodificar el token para obtener la boleta
		const payload = jwtDecode(token);
		const { boleta } = payload;

		// Preparar los datos para enviar al backend
		const dataToSend = {
			boleta,
			nombre,
			correo_actual: correoActual,
			correo_nuevo: correoNuevo || null,
			contrasena_actual: contrasenaActual || null,
			contrasena_nueva: contrasenaNueva || null,
		};

		try {
			const response = await actualizarEstudiante(token, dataToSend);

			if (response.success) {
				toast({
					title: 'Perfil actualizado.',
					description: 'Tu información ha sido guardada exitosamente.',
					status: 'success',
					duration: 5000,
					isClosable: true,
					position: 'top',
				});
				onClose(); // Cerrar el modal
				window.location.reload(); // Recargar la página para ver los cambios
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
				description: 'No se pudo actualizar el perfil.',
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
							<FormLabel>Correo Actual</FormLabel>
							<Input
								placeholder="Tu correo actual"
								value={correoActual}
								onChange={(e) => setCorreoActual(e.target.value)}
							/>
						</FormControl>
						<FormControl mt={4}>
							<FormLabel>Correo Nuevo</FormLabel>
							<Input
								placeholder="Tu correo nuevo"
								value={correoNuevo}
								onChange={(e) => setCorreoNuevo(e.target.value)}
							/>
						</FormControl>
						<FormControl mt={4}>
							<FormLabel>Contraseña Actual</FormLabel>
							<Input
								type="password"
								placeholder="Tu contraseña actual"
								value={contrasenaActual}
								onChange={(e) => setContrasenaActual(e.target.value)}
							/>
						</FormControl>
						<FormControl mt={4}>
							<FormLabel>Contraseña Nueva</FormLabel>
							<Input
								type="password"
								placeholder="Tu contraseña nueva"
								value={contrasenaNueva}
								onChange={(e) => setContrasenaNueva(e.target.value)}
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
