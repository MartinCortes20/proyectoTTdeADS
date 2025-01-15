import React, { useState, useEffect } from 'react';
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Select,
	Textarea,
	VStack,
	useToast,
} from '@chakra-ui/react';
import { rateForm, consultarProtocolos } from '../../api';

const EvaluationFormPage = () => {
	const [evaluationData, setEvaluationData] = useState({
		titulo_protocolo: '',
		titulo_corresponde_producto: 'NO',
		observaciones_1: '',
		resumen_claro: 'NO',
		observaciones_2: '',
		palabras_clave_adecuadas: 'NO',
		observaciones_3: '',
		problema_comprensible: 'NO',
		observaciones_4: '',
		objetivo_preciso_relevante: 'NO',
		observaciones_5: '',
		planteamiento_claro: 'NO',
		observaciones_6: '',
		contribuciones_justificadas: 'NO',
		observaciones_7: '',
		viabilidad_adecuada: 'NO',
		observaciones_8: '',
		propuesta_metodologica_pertinente: 'NO',
		observaciones_9: '',
		calendario_adecuado: 'NO',
		observaciones_10: '',
		aprobado: 'NO',
		recomendaciones_adicionales: '',
	});

	const [protocols, setProtocols] = useState([]);
	const toast = useToast();

	// Obtener protocolos desde el backend
	useEffect(() => {
		const fetchProtocols = async () => {
			try {
				const token = localStorage.getItem('log-token');
				if (!token) {
					throw new Error('Token no encontrado.');
				}

				const response = await consultarProtocolos(token, {});
				if (response.success) {
					setProtocols(response.data || []);
				} else {
					throw new Error(response.message);
				}
			} catch (error) {
				toast({
					title: 'Error al cargar protocolos',
					description: error.message,
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
			}
		};

		fetchProtocols();
	}, []);

	const handleInputChange = (key, value) => {
		setEvaluationData((prev) => ({ ...prev, [key]: value }));
	};

	const handleSubmit = async () => {
		try {
			const token = localStorage.getItem('log-token');
			if (!token) {
				toast({
					title: 'Error',
					description: 'No se encontró el token de autenticación.',
					status: 'error',
					duration: 5000,
					isClosable: true,
				});
				return;
			}

			const response = await rateForm(token, evaluationData);

			if (response.success) {
				toast({
					title: 'Evaluación registrada',
					description: 'La evaluación se registró con éxito.',
					status: 'success',
					duration: 5000,
					isClosable: true,
				});
				setEvaluationData({
					titulo_protocolo: '',
					titulo_corresponde_producto: 'NO',
					observaciones_1: '',
					resumen_claro: 'NO',
					observaciones_2: '',
					palabras_clave_adecuadas: 'NO',
					observaciones_3: '',
					problema_comprensible: 'NO',
					observaciones_4: '',
					objetivo_preciso_relevante: 'NO',
					observaciones_5: '',
					planteamiento_claro: 'NO',
					observaciones_6: '',
					contribuciones_justificadas: 'NO',
					observaciones_7: '',
					viabilidad_adecuada: 'NO',
					observaciones_8: '',
					propuesta_metodologica_pertinente: 'NO',
					observaciones_9: '',
					calendario_adecuado: 'NO',
					observaciones_10: '',
					aprobado: 'NO',
					recomendaciones_adicionales: '',
				});
			} else {
				throw new Error(response.message);
			}
		} catch (error) {
			toast({
				title: 'Error',
				description:
					error.message || 'Ocurrió un error al registrar la evaluación.',
				status: 'error',
				duration: 5000,
				isClosable: true,
			});
		}
	};

	return (
		<Box
			p={8}
			bg="#EDF2F7"
			minH="100vh"
		>
			<VStack
				spacing={6}
				align="stretch"
				bg="white"
				p={6}
				borderRadius="md"
				boxShadow="lg"
			>
				<FormControl>
					<FormLabel>Título del Protocolo</FormLabel>
					<Select
						placeholder="Seleccione el título del protocolo"
						value={evaluationData.titulo_protocolo}
						onChange={(e) =>
							handleInputChange('titulo_protocolo', e.target.value)
						}
					>
						{protocols.map((protocol) => (
							<option
								key={protocol.id_protocolo}
								value={protocol.titulo}
							>
								{protocol.titulo}
							</option>
						))}
					</Select>
				</FormControl>

				{/* Preguntas de evaluación */}
				{[
					{
						label: '¿El título corresponde al producto?',
						field: 'titulo_corresponde_producto',
						observation: 'observaciones_1',
					},
					{
						label: '¿El resumen es claro?',
						field: 'resumen_claro',
						observation: 'observaciones_2',
					},
					{
						label: '¿Las palabras clave son adecuadas?',
						field: 'palabras_clave_adecuadas',
						observation: 'observaciones_3',
					},
					{
						label: '¿El problema es comprensible?',
						field: 'problema_comprensible',
						observation: 'observaciones_4',
					},
					{
						label: '¿El objetivo es preciso y relevante?',
						field: 'objetivo_preciso_relevante',
						observation: 'observaciones_5',
					},
					{
						label: '¿El planteamiento es claro?',
						field: 'planteamiento_claro',
						observation: 'observaciones_6',
					},
					{
						label: '¿Las contribuciones están justificadas?',
						field: 'contribuciones_justificadas',
						observation: 'observaciones_7',
					},
					{
						label: '¿La viabilidad es adecuada?',
						field: 'viabilidad_adecuada',
						observation: 'observaciones_8',
					},
					{
						label: '¿La propuesta metodológica es pertinente?',
						field: 'propuesta_metodologica_pertinente',
						observation: 'observaciones_9',
					},
					{
						label: '¿El calendario es adecuado?',
						field: 'calendario_adecuado',
						observation: 'observaciones_10',
					},
				].map(({ label, field, observation }, index) => (
					<React.Fragment key={index}>
						<FormControl>
							<FormLabel>{label}</FormLabel>
							<Select
								value={evaluationData[field]}
								onChange={(e) => handleInputChange(field, e.target.value)}
							>
								<option value="SI">Sí</option>
								<option value="NO">No</option>
							</Select>
						</FormControl>
						<FormControl>
							<FormLabel>Observaciones</FormLabel>
							<Textarea
								placeholder="Ingrese observaciones"
								value={evaluationData[observation]}
								onChange={(e) => handleInputChange(observation, e.target.value)}
							/>
						</FormControl>
					</React.Fragment>
				))}

				<FormControl>
					<FormLabel>¿Fue aprobado el protocolo?</FormLabel>
					<Select
						value={evaluationData.aprobado}
						onChange={(e) => handleInputChange('aprobado', e.target.value)}
					>
						<option value="SI">Sí</option>
						<option value="NO">No</option>
					</Select>
				</FormControl>

				<FormControl>
					<FormLabel>Recomendaciones Adicionales</FormLabel>
					<Textarea
						placeholder="Ingrese recomendaciones adicionales"
						value={evaluationData.recomendaciones_adicionales}
						onChange={(e) =>
							handleInputChange('recomendaciones_adicionales', e.target.value)
						}
					/>
				</FormControl>

				<Button
					colorScheme="blue"
					onClick={handleSubmit}
				>
					Registrar Evaluación
				</Button>
			</VStack>
		</Box>
	);
};

export default EvaluationFormPage;
