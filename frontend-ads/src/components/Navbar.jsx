import React, { useContext } from 'react';
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
import { AuthContext } from '../context/AuthContext'; // Importa el AuthContext

const Navbar = () => {
	const navigate = useNavigate();
	const userRole = 'student'; // Cambiar el rol del usuario
	const { isOpen, onOpen, onClose } = useDisclosure(); // Manejo del modal
	const cancelRef = React.useRef(); // Referencia al botón de cancelar en el modal
	const toast = useToast(); // Hook para manejar el toast
	const { logout } = useContext(AuthContext); // Obtén el método `login` del contexto

	// Función para confirmar el cierre de sesión
	const handleLogoutConfirm = () => {
		logout(); // Eliminar el token o realizar operaciones necesarias
		navigate('/'); // Redirigir al usuario a la página de inicio de sesión
		onClose(); // Cerrar el modal

		// Mostrar el toast de confirmación
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
				{userRole === 'admin' && (
					<Flex display={{ base: 'none', md: 'flex' }}>
						<Link
							href="/admin/dashboard"
							mx={2}
							fontWeight="bold"
						>
							Dashboard
						</Link>
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
							href="/admin/assign-judges"
							mx={2}
							fontWeight="bold"
						>
							Asignar Sinodales
						</Link>
						<Link
							href="/admin/evaluations"
							mx={2}
							fontWeight="bold"
						>
							Calificaciones
						</Link>
					</Flex>
				)}

				{/* Menú para ESTUDIANTE */}
				{userRole === 'student' && (
					<Flex display={{ base: 'none', md: 'flex' }}>
						<Link
							href="/student"
							mx={2}
							fontWeight="bold"
						>
							Dashboard
						</Link>
						<Link
							href="/student/create-team"
							mx={2}
							fontWeight="bold"
						>
							Crear Equipo
						</Link>
						<Link
							href="/student/create-protocol"
							mx={2}
							fontWeight="bold"
						>
							Crear Protocolo
						</Link>
					</Flex>
				)}

				{/* Menú desplegable para pantallas pequeñas */}
				<Menu>
					<MenuButton
						as={IconButton}
						icon={<HamburgerIcon />}
						display={{ base: 'block', md: 'none' }}
						variant="outline"
						color="white"
						bg="#2B6CB0"
					/>
					<MenuList color="black">
						{userRole === 'admin' && (
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
						{userRole === 'student' && (
							<>
								<MenuItem
									as="a"
									href="/student"
								>
									Dashboard
								</MenuItem>
								<MenuItem
									as="a"
									href="/student/create-team"
								>
									Crear Equipo
								</MenuItem>
								<MenuItem
									as="a"
									href="/student/create-protocol"
								>
									Crear Protocolo
								</MenuItem>
							</>
						)}
					</MenuList>
				</Menu>

				<Button
					colorScheme="red"
					ml={4}
					size="sm"
					onClick={onOpen} // Abrir el modal
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
