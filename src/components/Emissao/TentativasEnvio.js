// ConfirmarDelete.tsx (ou .jsx, dependendo do seu projeto)
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function TentativasEnvio({ tentativas = [], className = "me-2" }) {
    const [show, setShow] = useState(false);

    return (
        <>
            <FontAwesomeIcon
                icon={faSearch}
                className={className}
                role="button"
                onClick={() => setShow(true)} />

            <Modal show={show} onHide={() => setShow(false)} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title>Tentantivas de envio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Data</th>
                                <th scope="col">Sucesso</th>
                                <th scope="col">Mensagem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tentativas &&
                                tentativas.map((tentativa, index) => (
                                    <tr key={index}>
                                        <th>
                                            {new Date(tentativa.dataCriacao).toLocaleDateString('pt-Br')}
                                            {' '}
                                            {new Date(tentativa.dataCriacao).toLocaleTimeString('pt-Br')}
                                        </th>
                                        <th>{tentativa.sucesso ? 'Sim' : 'Não'}</th>
                                        <th>{tentativa.mensagem}</th>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Fechar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
