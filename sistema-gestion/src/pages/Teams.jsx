import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Heading, Text, VStack } from '@chakra-ui/react';
import axios from 'axios';

const Teams = () => {
	const [team, setTeam] = useState(null);
	const [form, setForm] = useState({ nombre_equipo: '', integrantes: [] });

	const fetchTeam = async () => {
		try {
			const response = await axios.post(
				'/api/consultarEquipos',
				{},
				{
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				}
			);
			setTeam(response.data);
		} catch (err) {
			console.error('Error al obtener equipo');
		}
	};

	const createTeam = async () => {
		try {
			await axios.post('/api/nuevoEquipo', form, {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
			});
			fetchTeam();
		} catch (err) {
			console.error('Error al crear equipo');
		}
	};

	useEffect(() => {
		fetchTeam();
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
				Gestión de Equipos
			</Heading>
			{team ? (
				<VStack spacing={4}>
					<Text>
						<strong>Nombre:</strong> {team.nombre}
					</Text>
					<Text>
						<strong>Integrantes:</strong> {team.integrantes.join(', ')}
					</Text>
				</VStack>
			) : (
				<>
					<Input
						placeholder="Nombre del equipo"
						value={form.nombre_equipo}
						onChange={(e) =>
							setForm({ ...form, nombre_equipo: e.target.value })
						}
					/>
					<Button
						mt={4}
						colorScheme="blue"
						onClick={createTeam}
					>
						Crear Equipo
					</Button>
				</>
			)}
		</Box>
	);
};

export default Teams;
