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

const DeleteTeamButton = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const cancelRef = useRef();
	const toast = useToast();

	const handleDelete = () => {
		// Mostrar Toast
		toast({
			title: 'Equipo eliminado.',
			description: 'El equipo ha sido eliminado exitosamente.',
			status: 'success',
			duration: 5000,
			isClosable: true,
			position: 'top',
		});

		// Cerrar el modal
		onClose();
	};

	return (
		<>
			<Button
				colorScheme="red"
				onClick={onOpen}
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
							¿Estás seguro? Esto eliminará permanentemente el equipo.
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
