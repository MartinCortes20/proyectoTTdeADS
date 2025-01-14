import React, { useState } from 'react';
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
	Select,
	Button,
	useToast,
	VStack,
} from '@chakra-ui/react';
import { crearEstudiante, crearMaestro } from '../../api';

const CreateUserModal = ({ isOpen, onClose }) => {
	const [formData, setFormData] = useState({
		nombre: '',
		correo: '',
		contrasena: '',
		boleta: '',
		clave_empleado: '',
		rol: '',
		academia: '',
		funcion: '',
	});

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

	const toast = useToast();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleRegister = async () => {
		try {
			let response;
			if (formData.rol === 'ESTUDIANTE') {
				delete formData.clave_empleado;
				delete formData.academia;
				response = await crearEstudiante(
					formData.nombre,
					formData.correo,
					formData.contrasena,
					formData.boleta
				);
			} else if (formData.rol === 'DOCENTE') {
				delete formData.boleta;
				response = await crearMaestro(
					formData.nombre,
					formData.correo,
					formData.contrasena,
					formData.clave_empleado,
					formData.funcion,
					formData.academia
				);
			}

			if (response.success === false) {
				toast({
					title: 'Error al registrar.',
					description: response.message,
					status: 'error',
					duration: 3000,
					isClosable: true,
					position: 'top',
				});
			} else {
				toast({
					title: 'Registro exitoso.',
					description: response.message || '¡Usuario creado correctamente!',
					status: 'success',
					duration: 3000,
					isClosable: true,
					position: 'top',
				});
				onClose();
				window.location.reload();
			}
		} catch (error) {
			console.error('Error inesperado:', error);
			toast({
				title: 'Error inesperado.',
				description: 'Intenta de nuevo más tarde.',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
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
				<ModalHeader>Crear Usuario</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<VStack spacing={4}>
						<FormControl isRequired>
							<FormLabel>Nombre</FormLabel>
							<Input
								type="text"
								name="nombre"
								placeholder="Ingresa tu nombre"
								value={formData.nombre}
								onChange={handleChange}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Correo</FormLabel>
							<Input
								type="email"
								name="correo"
								placeholder="Ingresa tu correo"
								value={formData.correo}
								onChange={handleChange}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Contraseña</FormLabel>
							<Input
								type="password"
								name="contrasena"
								placeholder="Ingresa tu contraseña"
								value={formData.contrasena}
								onChange={handleChange}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Rol</FormLabel>
							<Select
								name="rol"
								placeholder="Selecciona un rol"
								value={formData.rol}
								onChange={handleChange}
							>
								<option value="ESTUDIANTE">Estudiante</option>
								<option value="DOCENTE">Docente</option>
							</Select>
						</FormControl>

						{formData.rol === 'ESTUDIANTE' && (
							<FormControl isRequired>
								<FormLabel>Boleta</FormLabel>
								<Input
									type="text"
									name="boleta"
									placeholder="Ingresa tu boleta"
									value={formData.boleta}
									onChange={handleChange}
								/>
							</FormControl>
						)}
						{formData.rol === 'DOCENTE' && (
							<>
								<FormControl isRequired>
									<FormLabel>Clave de Empleado</FormLabel>
									<Input
										type="text"
										name="clave_empleado"
										placeholder="Ingresa tu clave de empleado"
										value={formData.clave_empleado}
										onChange={handleChange}
									/>
								</FormControl>
								<FormControl isRequired>
									<FormLabel>Función</FormLabel>
									<Select
										name="funcion"
										placeholder="Selecciona una función"
										value={formData.funcion}
										onChange={handleChange}
									>
										<option value="ADMIN">ADMIN</option>
										<option value="CATT">CATT</option>
										<option value="DIRECTOR">DIRECTOR</option>
										<option value="DOCENTE">DOCENTE</option>
										<option value="PRESIDENTE ACADEMIA">
											PRESIDENTE ACADEMIA
										</option>
										<option value="PROFESOR">PROFESOR</option>
										<option value="SECRETARIO">SECRETARIO</option>
										<option value="SINODAL">SINODAL</option>
										<option value="TECNICO">TECNICO</option>
									</Select>
								</FormControl>
								<FormControl isRequired>
									<FormLabel>Academia</FormLabel>
									<Select
										name="academia"
										placeholder="Selecciona una academia"
										value={formData.academia}
										onChange={handleChange}
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
							</>
						)}
					</VStack>
				</ModalBody>
				<ModalFooter>
					<Button
						colorScheme="blue"
						mr={3}
						onClick={handleRegister}
					>
						Crear
					</Button>
					<Button onClick={onClose}>Cancelar</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CreateUserModal;
