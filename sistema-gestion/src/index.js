import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import theme from './theme';

import React from 'react';
import ReactDOM from 'react-dom/client'; // Asegúrate de usar 'react-dom/client'

const root = ReactDOM.createRoot(document.getElementById('root')); // Crea un root
root.render(
	<ChakraProvider theme={theme}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</ChakraProvider>
);
