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
import { actualizarEstudiante, actualizarDocente } from '../../api';

const EditProfileModal = ({ userData }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	const [formData, setFormData] = useState({
		nombre_usuario: '',
		correoActual: '',
		correoNuevo: '',
		contrasenaActual: '',
		contrasenaNueva: '',
		boleta: '',
		clave_empleado: '',
	});

	// Manejar casos en los que userData no esté definido
	useEffect(() => {
		if (isOpen && userData) {
			const identificador = userData?.identificador || '';
			setFormData({
				nombre_usuario: userData.nombre_usuario || '',
				correoActual: userData.correo_usuario || '',
				correoNuevo: '',
				contrasenaActual: '',
				contrasenaNueva: '',
				boleta: userData.tipo === 'Alumno' ? identificador : '',
				clave_empleado: userData.tipo === 'Docente' ? identificador : '',
			});
		}
	}, [isOpen, userData]);

	// Manejar cambios en el formulario
	const handleInputChange = (key, value) => {
		setFormData((prev) => ({ ...prev, [key]: value }));
	};

	// Función para guardar cambios
	const handleSave = async () => {
		if (!userData) {
			toast({
				title: 'Error',
				description: 'No hay datos de usuario disponibles.',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
			return;
		}

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

		const dataToSend = {
			nombre_usuario: formData.nombre_usuario,
			correo_actual: formData.correoActual,
			correo_nuevo: formData.correoNuevo || null,
			contrasena_actual: formData.contrasenaActual || null,
			contrasena_nueva: formData.contrasenaNueva || null,
		};

		if (userData.tipo === 'Alumno') {
			dataToSend.boleta = formData.boleta;
		} else if (userData.tipo === 'Docente') {
			dataToSend.clave_empleado = formData.clave_empleado;
		}

		try {
			let response;
			if (userData.tipo === 'Alumno') {
				response = await actualizarEstudiante(token, dataToSend);
			} else if (userData.tipo === 'Docente') {
				response = await actualizarDocente(token, dataToSend);
			}

			if (response.success) {
				toast({
					title: 'Perfil actualizado.',
					description: 'La información se guardó exitosamente.',
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
				size="sm"
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
						{userData ? (
							<>
								<FormControl>
									<FormLabel>Nombre</FormLabel>
									<Input
										placeholder="Tu nombre_usuario"
										value={formData.nombre_usuario}
										onChange={(e) =>
											handleInputChange('nombre_usuario', e.target.value)
										}
									/>
								</FormControl>
								<FormControl mt={4}>
									<FormLabel>Correo Actual</FormLabel>
									<Input
										placeholder="Tu correo_usuario actual"
										value={formData.correoActual}
										onChange={(e) =>
											handleInputChange('correoActual', e.target.value)
										}
									/>
								</FormControl>
								<FormControl mt={4}>
									<FormLabel>Correo Nuevo</FormLabel>
									<Input
										placeholder="Tu correo_usuario nuevo"
										value={formData.correoNuevo}
										onChange={(e) =>
											handleInputChange('correoNuevo', e.target.value)
										}
									/>
								</FormControl>
								{userData.tipo === 'Alumno' && (
									<FormControl mt={4}>
										<FormLabel>Boleta</FormLabel>
										<Input
											placeholder="Tu boleta"
											value={formData.boleta}
											onChange={(e) =>
												handleInputChange('boleta', e.target.value)
											}
										/>
									</FormControl>
								)}
								{userData.tipo === 'Docente' && (
									<FormControl mt={4}>
										<FormLabel>Clave Empleado</FormLabel>
										<Input
											placeholder="Clave de empleado"
											value={formData.clave_empleado}
											onChange={(e) =>
												handleInputChange('clave_empleado', e.target.value)
											}
										/>
									</FormControl>
								)}
								<FormControl mt={4}>
									<FormLabel>Contraseña Actual</FormLabel>
									<Input
										type="password"
										placeholder="Tu contraseña actual"
										value={formData.contrasenaActual}
										onChange={(e) =>
											handleInputChange('contrasenaActual', e.target.value)
										}
									/>
								</FormControl>
								<FormControl mt={4}>
									<FormLabel>Contraseña Nueva</FormLabel>
									<Input
										type="password"
										placeholder="Tu contraseña nueva"
										value={formData.contrasenaNueva}
										onChange={(e) =>
											handleInputChange('contrasenaNueva', e.target.value)
										}
									/>
								</FormControl>
							</>
						) : (
							<p>No hay datos de usuario disponibles.</p>
						)}
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							mr={3}
							onClick={handleSave}
							isDisabled={!userData}
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
