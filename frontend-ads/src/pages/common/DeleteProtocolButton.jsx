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
import { eliminarProtocolo } from '../../api';

const DeleteProtocolButton = ({ protocolData }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef();
	const toast = useToast();

	const handleDelete = async () => {
		try {
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

			// Preparar los datos para la eliminación
			const dataToSend = {
				lider: protocolData.lider,
				titulo_protocolo: protocolData.titulo,
			};

			// Llamar a la API para eliminar el protocolo
			const response = await eliminarProtocolo(token, dataToSend);

			if (response.success) {
				toast({
					title: 'Protocolo eliminado.',
					description: `El protocolo "${protocolData.titulo}" ha sido eliminado exitosamente.`,
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
					description: response.message || 'No se pudo eliminar el protocolo.',
					status: 'error',
					duration: 5000,
					isClosable: true,
					position: 'top',
				});
			}
		} catch (error) {
			toast({
				title: 'Error del servidor.',
				description: 'No se pudo eliminar el protocolo.',
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
				Eliminar Protocolo
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
							Eliminar Protocolo
						</AlertDialogHeader>

						<AlertDialogBody>
							¿Estás seguro de que deseas eliminar el protocolo "
							<strong>{protocolData.titulo}</strong>"? Esto eliminará el
							protocolo permanentemente.
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

export default DeleteProtocolButton;
