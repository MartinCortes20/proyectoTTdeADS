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
	VStack,
	useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { subirPDF } from '../../api';

const UpdateProtocolModal = ({ protocolData, mode }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const [formData, setFormData] = useState({
		titulo: '',
		director: '',
		director_2: '',
		academia: '',
		lider: '',
		pdf: null,
	});

	// Sincronizar formData con protocolData
	useEffect(() => {
		if (protocolData) {
			setFormData({
				titulo: protocolData.titulo || '',
				director: protocolData.director || '',
				director_2: protocolData.director_2 || '',
				academia: protocolData.academia || '',
				lider: protocolData.lider || '',
				pdf: null, // Siempre inicializamos pdf como null
			});
		}
	}, [protocolData]);

	const handleInputChange = (key, value) => {
		setFormData({ ...formData, [key]: value });
	};

	const handleFileChange = (file) => {
		// console.log(file);
		setFormData({ ...formData, pdf: file?.name });
	};

	const handleSubmit = async () => {
		try {
			// Validar si se seleccionó un archivo PDF
			if (!formData.pdf) {
				toast({
					title: 'Archivo no seleccionado.',
					description: 'Por favor, selecciona un archivo PDF.',
					status: 'warning',
					duration: 5000,
					isClosable: true,
					position: 'top',
				});
				return;
			}

			// Preparar los datos para la API
			const token = localStorage.getItem('log-token');
			const dataToSend = {
				lider: protocolData.lider,
				titulo_protocolo: formData.titulo,
				pdf: formData.pdf, // Puedes cambiar esto según cómo manejes los archivos
			};
			// console.log(dataToSend);
			const response = await subirPDF(token, dataToSend);

			if (response.success) {
				toast({
					title: mode === 'update' ? 'Protocolo actualizado' : 'PDF subido',
					description: response.data.message,
					status: 'success',
					duration: 5000,
					isClosable: true,
					position: 'top',
				});
				onClose();
				window.location.reload(); // Recargar la página para reflejar los cambios
			} else {
				throw new Error(response.message || 'Error desconocido');
			}
		} catch (error) {
			toast({
				title: 'Error al realizar la acción.',
				description:
					error.message ||
					'Ocurrió un problema al intentar realizar la acción.',
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
				colorScheme={mode === 'update' ? 'blue' : 'green'}
				onClick={onOpen}
				size="sm"
			>
				{mode === 'update' ? 'Actualizar Protocolo' : 'Subir PDF'}
			</Button>

			<Modal
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						{mode === 'update' ? 'Actualizar Protocolo' : 'Subir PDF'}
					</ModalHeader>
					<ModalBody>
						<VStack spacing={4}>
							<FormControl>
								<FormLabel>Título del Protocolo</FormLabel>
								<Input
									placeholder="Título del protocolo"
									value={formData.titulo}
									onChange={(e) => handleInputChange('titulo', e.target.value)}
									isReadOnly={mode === 'upload'}
									disabled
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Director</FormLabel>
								<Input
									placeholder="Director"
									value={formData.director}
									onChange={(e) =>
										handleInputChange('director', e.target.value)
									}
									isReadOnly={mode === 'upload'}
									disabled
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Director 2</FormLabel>
								<Input
									placeholder="Director 2"
									value={formData.director_2}
									onChange={(e) =>
										handleInputChange('director_2', e.target.value)
									}
									isReadOnly={mode === 'upload'}
									disabled
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
									isReadOnly={mode === 'upload'}
									disabled
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Lider de Equipo</FormLabel>
								<Input
									placeholder="Lider de Equipo"
									value={formData.lider}
									onChange={(e) => handleInputChange('lider', e.target.value)}
									isReadOnly={mode === 'upload'}
									disabled
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
							onClick={handleSubmit}
						>
							{mode === 'update' ? 'Actualizar' : 'Subir'}
						</Button>
						<Button
							ml={3}
							onClick={onClose}
						>
							Cancelar
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateProtocolModal;
