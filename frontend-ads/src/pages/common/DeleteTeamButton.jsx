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
import { eliminarEquipo } from '../../api'; // Importar la función de API para eliminar el equipo

const DeleteTeamButton = ({ teamData }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef();
	const toast = useToast();

	const handleDelete = async () => {
		try {
			// Obtener el token desde el almacenamiento local
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
				lider: teamData.lider,
				nombre_equipo: teamData.nombre_equipo,
			};

			// Llamar a la API para eliminar el equipo
			const response = await eliminarEquipo(token, dataToSend);

			if (response.success) {
				toast({
					title: 'Equipo eliminado.',
					description: 'El equipo ha sido eliminado exitosamente.',
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
					description: response.message || 'No se pudo eliminar el equipo.',
					status: 'error',
					duration: 5000,
					isClosable: true,
					position: 'top',
				});
			}
		} catch (error) {
			toast({
				title: 'Error del servidor.',
				description: 'No se pudo eliminar el equipo.',
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
				size="sm"
			>
				Eliminar Equipo
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
							Eliminar Equipo
						</AlertDialogHeader>

						<AlertDialogBody>
							¿Estás seguro? Esto eliminará permanentemente el equipo:{' '}
							<strong>{teamData.nombre_equipo}</strong>.
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

export default DeleteTeamButton;
