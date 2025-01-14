import React, { useContext, useEffect, useState } from 'react';
import {
	Box,
	Flex,
	Button,
	Link,
	Spacer,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	IconButton,
	Image,
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode'; // Importar correctamente
import { consultarUsuarios } from '../api';

const Navbar = () => {
	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = React.useRef();
	const toast = useToast();
	const { logout } = useContext(AuthContext);

	// Estados para manejar el rol y los permisos
	const [userRole, setUserRole] = useState(null);
	const [idEquipo, setIdEquipo] = useState(null);
	const [idProtocolo, setIdProtocolo] = useState(null);
	const [perfilUsuario, setPerfilUsuario] = useState(null);

	useEffect(() => {
		(async () => {
			try {
				// Obtener el token desde el localStorage
				const storedToken = localStorage.getItem('log-token');

				if (storedToken) {
					// Decodificar el token para obtener la boleta
					const payload = jwtDecode(storedToken);
					const { boleta, rol } = payload;

					setUserRole(rol);

					// Obtener la información del usuario
					const response = await consultarUsuarios(storedToken, { boleta });
					if (response.success && response.data.length > 0) {
						const usuario = response.data[0];
						setPerfilUsuario(usuario);
						setIdEquipo(usuario.id_equipo || null);
						setIdProtocolo(usuario.id_protocolo || null);
					} else {
						toast({
							title: 'Error',
							description: 'No se pudo obtener la información del usuario.',
							status: 'error',
							duration: 3000,
							isClosable: true,
						});
					}
				}
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Ocurrió un problema al cargar los datos.',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			}
		})();
	}, []);

	// Función para confirmar el cierre de sesión
	const handleLogoutConfirm = () => {
		logout(); // Cerrar sesión
		navigate('/'); // Redirigir al inicio
		onClose(); // Cerrar modal

		// Mostrar toast de confirmación
		toast({
			title: 'Sesión cerrada',
			description: 'Has cerrado sesión exitosamente.',
			status: 'success',
			duration: 3000,
			isClosable: true,
			position: 'top',
		});
	};

	return (
		<>
			<Flex
				bg="#2B6CB0"
				p={4}
				align="center"
				color="white"
				boxShadow="md"
			>
				<Box>
					<Image
						src="/images/CATT.jpeg"
						alt="CATT"
						boxSize="60px"
						objectFit="cover"
					/>
				</Box>
				<Spacer />

				{/* Menú para ADMIN */}
				{userRole === 'ADMIN' && (
					<Flex display={{ base: 'none', md: 'flex' }}>
						{/* <Link
							href="/admin/dashboard"
							mx={2}
							fontWeight="bold"
						>
							Dashboard
						</Link> */}
						<Link
							href="/admin/users"
							mx={2}
							fontWeight="bold"
						>
							Usuarios
						</Link>
						<Link
							href="/admin/teams"
							mx={2}
							fontWeight="bold"
						>
							Equipos
						</Link>
						<Link
							href="/admin/protocols"
							mx={2}
							fontWeight="bold"
						>
							Protocolos
						</Link>
						<Link
							href="/admin/assign-judges"
							mx={2}
							fontWeight="bold"
						>
							Asignar Sinodales
						</Link>
						{/* <Link
							href="/admin/evaluations"
							mx={2}
							fontWeight="bold"
						>
							Calificaciones
						</Link> */}
					</Flex>
				)}

				{/* Menú para ESTUDIANTE */}
				{userRole === 'ESTUDIANTE' && (
					<Flex display={{ base: 'none', md: 'flex' }}>
						<Link
							href="/student"
							mx={2}
							fontWeight="bold"
						>
							Dashboard
						</Link>
						{/* Ocultar la sección "Crear Equipo" si idEquipo tiene valor */}
						{!idEquipo && (
							<Link
								href="/student/create-team"
								mx={2}
								fontWeight="bold"
							>
								Crear Equipo
							</Link>
						)}
						{/* Ocultar la sección "Crear Protocolo" si idProtocolo tiene valor */}
						{!idProtocolo && (
							<Link
								href="/student/create-protocol"
								mx={2}
								fontWeight="bold"
							>
								Crear Protocolo
							</Link>
						)}
					</Flex>
				)}

				{/* Menú desplegable para pantallas pequeñas */}
				<Menu>
					<MenuButton
						as={IconButton}
						icon={<HamburgerIcon />}
						display={{ base: 'block', md: 'none' }}
						// variant="outline"
						color="white"
						bg="#2B6CB0"
					/>
					<MenuList color="black">
						{userRole === 'ADMIN' && (
							<>
								<MenuItem
									as="a"
									href="/admin/dashboard"
								>
									Dashboard
								</MenuItem>
								<MenuItem
									as="a"
									href="/admin/users"
								>
									Usuarios
								</MenuItem>
								<MenuItem
									as="a"
									href="/admin/teams"
								>
									Equipos
								</MenuItem>
								<MenuItem
									href="/admin/protocols"
									mx={2}
									fontWeight="bold"
								>
									Protocolos
								</MenuItem>
								<MenuItem
									as="a"
									href="/admin/assign-judges"
								>
									Asignar Sinodales
								</MenuItem>
								<MenuItem
									as="a"
									href="/admin/evaluations"
								>
									Calificaciones
								</MenuItem>
							</>
						)}
						{userRole === 'ESTUDIANTE' && (
							<>
								<MenuItem
									as="a"
									href="/student"
								>
									Dashboard
								</MenuItem>
								{!idEquipo && (
									<MenuItem
										as="a"
										href="/student/create-team"
									>
										Crear Equipo
									</MenuItem>
								)}
								{!idProtocolo && (
									<MenuItem
										as="a"
										href="/student/create-protocol"
									>
										Crear Protocolo
									</MenuItem>
								)}
							</>
						)}
					</MenuList>
				</Menu>
				<Button
					colorScheme="red"
					ml={4}
					size="sm"
					onClick={onOpen}
				>
					Cerrar Sesión
				</Button>
			</Flex>
			{/* Modal de confirmación */}
			<AlertDialog
				isOpen={isOpen}
				leastDestructiveRef={cancelRef}
				onClose={onClose}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader
							fontSize="lg"
							fontWeight="bold"
						>
							Confirmar Cierre de Sesión
						</AlertDialogHeader>
						<AlertDialogBody>
							¿Estás seguro de que deseas cerrar sesión?
						</AlertDialogBody>
						<AlertDialogFooter>
							<Button
								ref={cancelRef}
								onClick={onClose}
							>
								Cancelar
							</Button>
							<Button
								colorScheme="red"
								onClick={handleLogoutConfirm}
								ml={3}
							>
								Cerrar Sesión
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default Navbar;
