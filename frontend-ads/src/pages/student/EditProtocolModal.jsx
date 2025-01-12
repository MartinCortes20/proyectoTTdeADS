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
	VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

const EditProtocolModal = ({ protocolData, onSave }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	// Estado para manejar los datos del protocolo
	const [formData, setFormData] = useState({
		titulo: protocolData?.titulo || '',
		director: protocolData?.director || '',
		director_2: protocolData?.director_2 || '',
		academia: protocolData?.academia || '',
		pdf: protocolData?.pdf || null,
	});

	const handleInputChange = (key, value) => {
		setFormData({ ...formData, [key]: value });
	};

	const handleFileChange = (file) => {
		setFormData({ ...formData, pdf: file });
	};

	const handleSave = () => {
		onSave(formData); // Callback para guardar los cambios
		toast({
			title: 'Protocolo actualizado.',
			description:
				'La información del protocolo ha sido guardada exitosamente.',
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
				colorScheme="yellow"
				onClick={onOpen}
			>
				Editar Protocolo
			</Button>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Editar Protocolo</ModalHeader>
					<ModalBody>
						<VStack
							spacing={4}
							align="stretch"
						>
							<FormControl>
								<FormLabel>Título del Protocolo</FormLabel>
								<Input
									placeholder="Nuevo título del protocolo"
									value={formData.titulo}
									onChange={(e) => handleInputChange('titulo', e.target.value)}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Director</FormLabel>
								<Input
									placeholder="Nuevo nombre del director"
									value={formData.director}
									onChange={(e) =>
										handleInputChange('director', e.target.value)
									}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Director 2 (Opcional)</FormLabel>
								<Input
									placeholder="Nuevo nombre del segundo director"
									value={formData.director_2}
									onChange={(e) =>
										handleInputChange('director_2', e.target.value)
									}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Academia</FormLabel>
								<Input
									placeholder="Academia"
									value={formData.academia}
									onChange={(e) =>
										handleInputChange('academia', e.target.value)
									}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Archivo PDF</FormLabel>
								<Input
									type="file"
									accept="application/pdf"
									onChange={(e) => handleFileChange(e.target.files[0])}
								/>
							</FormControl>
						</VStack>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme="blue"
							onClick={handleSave}
						>
							Guardar
						</Button>
						<Button
							onClick={onClose}
							ml={3}
						>
							Cancelar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default EditProtocolModal;
