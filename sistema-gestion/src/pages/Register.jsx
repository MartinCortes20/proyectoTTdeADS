import React, { useState } from 'react';
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Heading,
	Text,
} from '@chakra-ui/react';
import axios from 'axios';

const Register = () => {
	const [form, setForm] = useState({
		nombre: '',
		correo: '',
		boleta: '',
		contrasena: '',
	});
	const [message, setMessage] = useState('');

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async () => {
		try {
			await axios.post('/api/registroUsuario', form);
			setMessage('Usuario registrado exitosamente');
		} catch (err) {
			setMessage(err.response.data.message || 'Error al registrar');
		}
	};

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
				Registro
			</Heading>
			{message && (
				<Text
					color="blue.500"
					mb={4}
				>
					{message}
				</Text>
			)}
			<FormControl mb={4}>
				<FormLabel>Nombre</FormLabel>
				<Input
					name="nombre"
					value={form.nombre}
					onChange={handleChange}
				/>
			</FormControl>
			<FormControl mb={4}>
				<FormLabel>Correo</FormLabel>
				<Input
					type="email"
					name="correo"
					value={form.correo}
					onChange={handleChange}
				/>
			</FormControl>
			<FormControl mb={4}>
				<FormLabel>Boleta</FormLabel>
				<Input
					name="boleta"
					value={form.boleta}
					onChange={handleChange}
				/>
			</FormControl>
			<FormControl mb={6}>
				<FormLabel>Contraseña</FormLabel>
				<Input
					type="password"
					name="contrasena"
					value={form.contrasena}
					onChange={handleChange}
				/>
			</FormControl>
			<Button
				colorScheme="blue"
				width="full"
				onClick={handleSubmit}
			>
				Registrar
			</Button>
		</Box>
	);
};

export default Register;
