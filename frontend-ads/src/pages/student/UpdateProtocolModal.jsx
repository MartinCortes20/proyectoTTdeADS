// UpdateProtocolModal.js
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

const UpdateProtocolModal = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	const handleSave = () => {
		toast({
			title: 'Protocolo actualizado.',
			description: 'El protocolo ha sido actualizado exitosamente.',
			status: 'success',
			duration: 5000,
			isClosable: true,
			position: 'top',
		});
		onClose();
	};

	return (
		<>
			<Button
				colorScheme="green"
				onClick={onOpen}
			>
				Actualizar Protocolo
			</Button>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Actualizar Protocolo</ModalHeader>
					<ModalBody>
						<FormControl>
							<FormLabel>Título del Protocolo</FormLabel>
							<Input placeholder="Nuevo título del protocolo" />
						</FormControl>
						<FormControl mt={4}>
							<FormLabel>Subir Nuevo PDF</FormLabel>
							<Input
								type="file"
								accept=".pdf"
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

export default UpdateProtocolModal;
