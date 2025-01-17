import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import UsersPage from './pages/admin/UsersPage';
import TeamsPage from './pages/admin/TeamsPage';
import AssignJudgesPage from './pages/admin/AssignJudgesPage';
import EvaluationsPage from './pages/admin/EvaluationsPage';
import DashboardStudent from './pages/student/DashboardStudent';
import TeamFormPage from './pages/student/CreateTeamFormPage';
import AuthPage from './pages/AuthPage'; // Página que incluye login y register
import ProtocolFormPage from './pages/student/CreateProtocolFormPage';
import ProtocolsPage from '../src/pages/ProtocolsPage'
import DashboardCatt from './pages/catt/DashboardCatt';
import DashboardPresident from './pages/president/DashboardPresident'
const App = () => {
	return (
		<Router>
			<Routes>
				{/* Rutas para Login y Registro (Sin Navbar) */}
				<Route
					path="/"
					element={<AuthPage />}
				/>

				{/* Rutas con Navbar */}
				<Route
					path="*"
					element={
						<>
							<Navbar />
							<Routes>
								{/* Rutas para ADMIN */}
								<Route
									path="/admin/dashboard"
									element={<DashboardAdmin />}
								/>
								<Route
									path="/admin/users"
									element={<UsersPage />}
								/>
								<Route
									path="/admin/teams"
									element={<TeamsPage />}
								/>
								<Route
									path="/admin/assign-judges"
									element={<AssignJudgesPage />}
								/>
								<Route
									path="/admin/evaluations"
									element={<EvaluationsPage />}
								/>

								{/* Rutas para ESTUDIANTE */}
								<Route
									path="/student"
									element={<DashboardStudent />}
								/>
								<Route
									path="/student/create-team"
									element={<TeamFormPage />}
								/>
								<Route
									path="/student/create-protocol"
									element={<ProtocolFormPage />}
								/>

								{/* Rutas para CATT */}
								<Route
									path="/catt"
									element={<DashboardCatt/>}
								/>

								<Route
									path="/catt/consultarUsuarios"
									element={<DashboardCatt/>}
								/>
					
							
								{/* Rutas para PRESIDENTE */}
								<Route
									path="/president"
									element={<DashboardPresident/>}
								/>
								
								
							</Routes>
						</>
					}
				/>
			</Routes>
		</Router>
	);
};

export default App;
