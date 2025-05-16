// ConfirmarDelete.tsx (ou .jsx, dependendo do seu projeto)
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function ConfirmarDelete({ onConfirm, titulo = "Confirmar exclusão", mensagem = "Tem certeza que deseja excluir?", className = "text-danger" }) {
    const [show, setShow] = useState(false);

    return (
        <>
            <FontAwesomeIcon
                icon={faTrash} 
                className={className} 
                role="button" 
                onClick={() => setShow(true)} />

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{titulo}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{mensagem}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Cancelar
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            setShow(false);
                            onConfirm();
                        }}
                    >
                        Excluir
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
