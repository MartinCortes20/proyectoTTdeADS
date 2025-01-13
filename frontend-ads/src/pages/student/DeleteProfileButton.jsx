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
import { eliminarUsuario } from '../../api';

const DeleteProfileButton = ({ userData }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef();
	const toast = useToast();

	const handleDelete = async () => {
		try {
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

			// Preparar los datos para la eliminación
			const dataToSend = {
				boleta: userData?.boleta || null,
				clave_empleado: userData?.clave_empleado || null,
			};

			// Llamar a la API para eliminar el usuario
			const response = await eliminarUsuario(token, dataToSend);

			if (response.success) {
				toast({
					title: 'Usuario eliminado.',
					description: `El usuario ${
						userData?.nombre || 'desconocido'
					} ha sido eliminado exitosamente.`,
					status: 'success',
					duration: 5000,
					isClosable: true,
					position: 'top',
				});
				onClose();
				window.location.reload();
			} else {
				toast({
					title: 'Error al eliminar.',
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
				description: 'No se pudo eliminar al usuario.',
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
				isDisabled={!userData} // Deshabilitar si no hay datos del usuario
			>
				Eliminar Usuario
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
							Eliminar Usuario
						</AlertDialogHeader>

						<AlertDialogBody>
							{userData ? (
								<>
									¿Estás seguro de que deseas eliminar al usuario{' '}
									<strong>{userData.nombre}</strong>? Esta acción no se puede
									deshacer.
								</>
							) : (
								<>
									No se puede eliminar al usuario porque no se encontraron
									datos.
								</>
							)}
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
								isDisabled={!userData} // Deshabilitar si no hay datos del usuario
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
