import React, { createContext, useState, useEffect } from 'react';
import { cerrarSesion } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(localStorage.getItem('log-token') || null);

	const login = (newToken) => {
		setToken(newToken);
		localStorage.setItem('log-token', newToken);
	};

	const logout = async () => {
		try {
			await cerrarSesion();
		} catch (error) {
			console.error('Error al cerrar sesión:', error);
		}
		setToken(null);
		localStorage.removeItem('log-token');
	};

	useEffect(() => {
		const storedToken = localStorage.getItem('log-token');
		if (storedToken) {
			setToken(storedToken);
		}
	}, []);

	console.log(token);

	return (
		<AuthContext.Provider value={{ token, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
