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

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async () => {
		try {
			const response = await axios.post('/api/inicioSesion', {
				correo: email,
				contrasena: password,
			});
			localStorage.setItem('token', response.data.token);
			window.location.href = '/profile';
		} catch (err) {
			setError(err.response.data.message || 'Error al iniciar sesión');
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
				Iniciar Sesión
			</Heading>
			{error && (
				<Text
					color="red.500"
					mb={4}
				>
					{error}
				</Text>
			)}
			<FormControl mb={4}>
				<FormLabel>Correo</FormLabel>
				<Input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</FormControl>
			<FormControl mb={6}>
				<FormLabel>Contraseña</FormLabel>
				<Input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</FormControl>
			<Button
				colorScheme="blue"
				width="full"
				onClick={handleSubmit}
			>
				Iniciar Sesión
			</Button>
		</Box>
	);
};

export default Login;
