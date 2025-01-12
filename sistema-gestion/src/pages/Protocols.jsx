import React, { useState, useEffect } from 'react';
import { Box, Button, Heading, Input, VStack, Text } from '@chakra-ui/react';
import axios from 'axios';

const Protocols = () => {
	const [protocol, setProtocol] = useState(null);
	const [form, setForm] = useState({
		titulo: '',
		director: '',
		director2: '',
		pdf: '',
	});

	const fetchProtocol = async () => {
		try {
			const response = await axios.post(
				'/api/consultarProtocolos',
				{},
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				}
			);
			setProtocol(response.data.protocolos[0]);
		} catch (err) {
			console.error('Error al obtener protocolo');
		}
	};

	const createProtocol = async () => {
		try {
			await axios.post('/api/crearProtocolo', form, {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			});
			fetchProtocol();
		} catch (err) {
			console.error('Error al crear protocolo');
		}
	};

	useEffect(() => {
		fetchProtocol();
	}, []);

	return (
		<Box
			maxW="md"
			mx="auto"
			mt={8}
			p={6}
			boxShadow="md"
			bg="white"
		>
			<Heading
				size="lg"
				mb={6}
			>
				Gestión de Protocolos
			</Heading>
			{protocol ? (
				<VStack spacing={4}>
					<Text>
						<strong>Título:</strong> {protocol.titulo}
					</Text>
					<Text>
						<strong>Directores:</strong> {protocol.director},{' '}
						{protocol.director_2}
					</Text>
				</VStack>
			) : (
				<>
					<Input
						placeholder="Título"
						value={form.titulo}
						onChange={(e) => setForm({ ...form, titulo: e.target.value })}
					/>
					<Input
						placeholder="Director"
						value={form.director}
						onChange={(e) => setForm({ ...form, director: e.target.value })}
					/>
					<Input
						placeholder="Segundo Director"
						value={form.director2}
						onChange={(e) => setForm({ ...form, director2: e.target.value })}
					/>
					<Button
						mt={4}
						colorScheme="blue"
						onClick={createProtocol}
					>
						Crear Protocolo
					</Button>
				</>
			)}
		</Box>
	);
};

export default Protocols;
