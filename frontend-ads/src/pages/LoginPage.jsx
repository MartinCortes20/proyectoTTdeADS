import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Box,
	Input,
	Button,
	FormControl,
	FormLabel,
	VStack,
	useToast,
} from '@chakra-ui/react';
import { iniciarSesion } from '../api'; // Asegúrate de que la función esté bien importada
import { AuthContext } from '../context/AuthContext'; // Importa el AuthContext

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const toast = useToast();
	const navigate = useNavigate();
	const { login } = useContext(AuthContext); // Obtén el método `login` del contexto

	const handleLogin = async () => {
		// Validar campos vacíos
		if (!email || !password) {
			toast({
				title: 'Error',
				description: 'Por favor, completa todos los campos.',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			return;
		}

		// Llamar a la función `iniciarSesion`
		try {
			const resultado = await iniciarSesion(email, password);

			if (resultado.success) {
				login(resultado.token); // Guarda el token usando el método del contexto

				toast({
					title: 'Inicio de sesión exitoso',
					description: 'Has iniciado sesión correctamente.',
					status: 'success',
					duration: 3000,
					isClosable: true,
					position: 'top',
				});

				// Decodificar el token para obtener el rol
				const payload = JSON.parse(atob(resultado.token.split('.')[1]));
				const { rol } = payload;

				// Redirigir según el rol
				switch (rol) {
					case 'ADMIN':
						navigate('/admin');
						break;
					case 'DOCENTE':
						navigate('/docente');
						break;
					case 'ESTUDIANTE':
						navigate('/student');
						break;
					default:
						navigate('/');
						break;
				}
			} else {
				toast({
					title: 'Error en el inicio de sesión',
					description: resultado.message,
					status: 'error',
					duration: 3000,
					isClosable: true,
					position: 'top',
				});
			}
		} catch (error) {
			toast({
				title: 'Error del servidor',
				description: 'No se pudo iniciar sesión.',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
		}
	};

	return (
		<Box
			maxW="sm"
			mx="auto"
			mt="10"
		>
			<VStack spacing={4}>
				<FormControl>
					<FormLabel>Correo</FormLabel>
					<Input
						type="email"
						placeholder="Ingresa tu correo"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
				</FormControl>
				<FormControl>
					<FormLabel>Contraseña</FormLabel>
					<Input
						type="password"
						placeholder="Ingresa tu contraseña"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</FormControl>
				<Button
					colorScheme="teal"
					onClick={handleLogin}
				>
					Iniciar Sesión
				</Button>
			</VStack>
		</Box>
	);
};

export default Login;
