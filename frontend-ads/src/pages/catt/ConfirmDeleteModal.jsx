import React from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Text,
} from '@chakra-ui/react';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Confirmar Eliminación</ModalHeader>
                <ModalBody>
                    <Text>¿Estás seguro que deseas eliminar "{itemName}"?</Text>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="red" mr={3} onClick={onConfirm}>
                        Eliminar
                    </Button>
                    <Button onClick={onClose}>Cancelar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfirmDeleteModal;
