import React from 'react';
import { Modal } from 'react-bootstrap';

const ModalImage = (props) => {
    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header>
                <Modal.Title>Image</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.modalContent}
            </Modal.Body>
        </Modal>
    );
};

export default ModalImage;