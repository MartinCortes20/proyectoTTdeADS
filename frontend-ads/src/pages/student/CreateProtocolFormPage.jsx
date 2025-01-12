// Este archivo contendrá solo la página para crear protocolos.
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

const ProtocolFormPage = () => {
	const [protocolData, setProtocolData] = useState({
		titulo: '',
		academia: '',
	});
	const toast = useToast();

	const handleInputChange = (key, value) => {
		setProtocolData({ ...protocolData, [key]: value });
	};

	const handleSubmit = async () => {
		try {
			const token = localStorage.getItem('token');
			const response = await crearProtocolo(token, protocolData);
			if (response.success) {
				toast({
					title: 'Protocolo creado',
					description: 'El protocolo se ha creado exitosamente.',
					status: 'success',
					duration: 3000,
					isClosable: true,
				});
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Ocurrió un error al crear el protocolo.',
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
						value={protocolData.titulo}
						onChange={(e) => handleInputChange('titulo', e.target.value)}
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
