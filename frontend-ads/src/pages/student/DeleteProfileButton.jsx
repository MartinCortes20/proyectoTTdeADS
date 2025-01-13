import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Button,
	useToast,
	useDisclosure,
} from '@chakra-ui/react';
import { useRef } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { eliminarUsuario } from '../../api';

const DeleteProfileButton = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef();
	const toast = useToast();
	const navigate = useNavigate();

	const handleDelete = async () => {
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

		// Decodificar el token para obtener la boleta
		const payload = jwtDecode(token);
		const { boleta } = payload;

		// Preparar los datos para la solicitud
		const dataToSend = { boleta };

		// Llamar a la función eliminarUsuario
		try {
			const response = await eliminarUsuario(token, dataToSend);

			if (response.success) {
				toast({
					title: 'Perfil eliminado.',
					description: 'Tu cuenta ha sido eliminada exitosamente.',
					status: 'success',
					duration: 5000,
					isClosable: true,
					position: 'top',
				});
				onClose(); // Cerrar el modal

				// Opcional: Redirigir al usuario después de eliminar su cuenta
				navigate('/');
			} else {
				toast({
					title: 'Error al eliminar cuenta.',
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
				description: 'No se pudo eliminar la cuenta.',
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
				colorScheme="red"
				onClick={onOpen}
			>
				Eliminar Cuenta
			</Button>

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
							Eliminar Cuenta
						</AlertDialogHeader>

						<AlertDialogBody>
							¿Estás seguro? Esta acción no se puede deshacer.
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
								onClick={handleDelete}
								ml={3}
							>
								Eliminar
							</Button>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</>
	);
};

export default DeleteProfileButton;
