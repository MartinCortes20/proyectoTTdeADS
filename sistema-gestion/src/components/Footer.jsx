import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const Footer = () => (
	<Box
		bg="gray.800"
		color="white"
		textAlign="center"
		py={4}
	>
		<Text fontSize="sm">
			© 2025 Sistema de Gestión. Todos los derechos reservados.
		</Text>
	</Box>
);

export default Footer;
