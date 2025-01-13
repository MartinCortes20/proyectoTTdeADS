import React, { useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    FormControl,
    FormLabel,
    Input,
} from '@chakra-ui/react';

const AddEditModal = ({ isOpen, onClose, onSubmit, item }) => {
    const [formData, setFormData] = useState(item || {});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        onSubmit(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{item ? 'Editar' : 'Agregar'} Elemento</ModalHeader>
                <ModalBody>
                    <FormControl mb={4}>
                        <FormLabel>Nombre</FormLabel>
                        <Input
                            name="nombre"
                            value={formData.nombre || ''}
                            onChange={handleChange}
                            placeholder="Nombre"
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Correo</FormLabel>
                        <Input
                            name="correo"
                            value={formData.correo || ''}
                            onChange={handleChange}
                            placeholder="Correo"
                        />
                    </FormControl>
                    {/* Agrega más campos según sea necesario */}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                        Guardar
                    </Button>
                    <Button onClick={onClose}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddEditModal;
