import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer.jsx';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Teams from './pages/Teams';
import Protocols from './pages/Protocols';
import SinodalManagement from './pages/SinodalManagement';
import CATTManagement from './pages/CATTManagement';

function App() {
	return (
		<>
			<Navbar />
			<Routes>
				<Route
					path="/"
					element={<Login />}
				/>
				<Route
					path="/register"
					element={<Register />}
				/>
				<Route
					path="/profile"
					element={<Profile />}
				/>
				<Route
					path="/teams"
					element={<Teams />}
				/>
				<Route
					path="/protocols"
					element={<Protocols />}
				/>
				<Route
					path="/sinodal"
					element={<SinodalManagement />}
				/>
				<Route
					path="/catt"
					element={<CATTManagement />}
				/>
			</Routes>
			<Footer />
		</>
	);
}

export default App;
