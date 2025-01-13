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
import { actualizarProtocolo } from '../../api';

const EditProtocolModal = ({ protocolData }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();

	// Estado para manejar los datos del protocolo
	const [formData, setFormData] = useState({
		titulo: protocolData?.titulo || '',
		lider: protocolData?.lider || '',
		contrasena: '',
	});

	const handleInputChange = (key, value) => {
		setFormData({ ...formData, [key]: value });
	};

	const handleSave = async () => {
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

		try {
			// Llamar a la función de actualización
			const response = await actualizarProtocolo(token, formData);

			if (response.success) {
				toast({
					title: 'Protocolo actualizado.',
					description:
						response.message || 'El protocolo se actualizó exitosamente.',
					status: 'success',
					duration: 5000,
					isClosable: true,
					position: 'top',
				});
				onClose();
				window.location.reload();
			} else {
				toast({
					title: 'Error al actualizar.',
					description:
						response.message || 'Ocurrió un error al actualizar el protocolo.',
					status: 'error',
					duration: 5000,
					isClosable: true,
					position: 'top',
				});
			}
		} catch (error) {
			toast({
				title: 'Error del servidor.',
				description: 'No se pudo actualizar el protocolo.',
				status: 'error',
				duration: 5000,
				isClosable: true,
				position: 'top',
			});
			console.error('Error al actualizar el protocolo:', error);
		}
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
								<FormLabel>Líder</FormLabel>
								<Input
									placeholder="Boleta o clave del líder"
									value={formData.lider}
									onChange={(e) => handleInputChange('lider', e.target.value)}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Contraseña</FormLabel>
								<Input
									type="password"
									placeholder="Contraseña para confirmar"
									value={formData.contrasena}
									onChange={(e) =>
										handleInputChange('contrasena', e.target.value)
									}
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
