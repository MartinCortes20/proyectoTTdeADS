import React, { useState } from 'react';
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	VStack,
	useToast,
	Flex,
	Heading,
	Divider,
	Text,
} from '@chakra-ui/react';
import { crearProtocolo } from '../../api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtocolFormPage = () => {
	const [protocolData, setProtocolData] = useState({
		titulo_protocolo: '',
		academia: '',
	});
	const toast = useToast();
	const navigate = useNavigate();

	// Manejar cambios en los campos del formulario
	const handleInputChange = (key, value) => {
		setProtocolData({ ...protocolData, [key]: value });
	};

	const handleSubmit = async () => {
		try {
			// Obtener el token del usuario
			const token = localStorage.getItem('log-token');
			if (!token) {
				toast({
					title: 'Error',
					description:
						'No se encontró el token de autenticación. Por favor, inicie sesión.',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
				return;
			}

			// Decodificar el token para obtener la boleta del líder
			const payload = jwtDecode(token);
			const lider_equipo = payload.boleta || payload.clave_empleado;

			// Preparar datos para enviar al backend
			const dataToSend = {
				lider_equipo,
				titulo_protocolo: protocolData.titulo_protocolo,
				academia: protocolData.academia,
			};

			// Llamar a la función de API para crear el protocolo
			const response = await crearProtocolo(token, dataToSend);

			if (response.success) {
				toast({
					title: 'Protocolo creado',
					description:
						response.message || 'El protocolo se ha creado exitosamente.',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});

				navigate('/student');
			} else {
				toast({
					title: 'Error al crear protocolo',
					description: response.message || 'No se pudo crear el protocolo.',
					status: 'error',
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: 'Error del servidor',
				description:
					'Ocurrió un error al crear el protocolo. Por favor, intenta más tarde.',
				status: 'error',
				duration: 3000,
				isClosable: true,
			});
		}
	};

	return (
		<Box
			bg="#EDF2F7"
			minH="100vh"
			p={8}
		>
			<Flex
				justify="center"
				mb={6}
			>
				<Heading
					fontSize="3xl"
					color="#2B6CB0"
				>
					Crear Protocolo
				</Heading>
			</Flex>
			<VStack
				spacing={6}
				align="stretch"
				bg="white"
				p={6}
				borderRadius="md"
				boxShadow="lg"
			>
				<Text
					fontSize="xl"
					fontWeight="bold"
					color="#2B6CB0"
				>
					Información del Protocolo
				</Text>
				<Divider mb={4} />

				<FormControl>
					<FormLabel
						fontWeight="bold"
						color="#2B6CB0"
					>
						Título del Protocolo
					</FormLabel>
					<Input
						placeholder="Ingrese el título del protocolo"
						value={protocolData.titulo_protocolo}
						onChange={(e) =>
							handleInputChange('titulo_protocolo', e.target.value)
						}
						focusBorderColor="#2B6CB0"
					/>
				</FormControl>

				<FormControl>
					<FormLabel
						fontWeight="bold"
						color="#2B6CB0"
					>
						Área/Academia
					</FormLabel>
					<Input
						placeholder="Ingrese el área o academia"
						value={protocolData.academia}
						onChange={(e) => handleInputChange('academia', e.target.value)}
						focusBorderColor="#2B6CB0"
					/>
				</FormControl>

				<Button
					colorScheme="green"
					size="lg"
					onClick={handleSubmit}
				>
					Crear Protocolo
				</Button>
			</VStack>
		</Box>
	);
};

export default ProtocolFormPage;
