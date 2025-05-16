import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button } from 'react-bootstrap';
import { useToast } from '../Alertas/AppToastsManager';

import ConfirmarDelete from '../Confirmar/ConfirmarDelete';
import TentativasEnvio from './TentativasEnvio';

import EmissaoDataService from "../../services/EmissaoService";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen,
  faPlus,
  faPlay
} from '@fortawesome/free-solid-svg-icons';

const EmissaoList = () => {
  const [emissoes, setEmissoes] = useState([]);
  const { addSuccessMessage, addErrorMessage } = useToast();

  useEffect(() => {
    listarEmissoes();
  }, []);

  const listarEmissoes = () => {
    EmissaoDataService.listarTodos()
      .then(response => {
        setEmissoes(response.data);
      })
      .catch(e => {
        addErrorMessage("Erro ao listar as emissões!");
      });
  };

  const excluirEmissao = (id) => {
    EmissaoDataService.remover(id)
      .then(response => {
        addSuccessMessage("Emissão removida com sucesso!");
        listarEmissoes();
      })
      .catch(e => {
        addErrorMessage("Erro ao remover a emissão!");
      });
  };

  const enviarEmissao = (id) => {
    EmissaoDataService.enviar(id)
      .then(response => {
        if (response.data.sucesso) {
          addSuccessMessage("Emissão enviada com sucesso!");
        }
        else {
          addErrorMessage(response.data.mensagem);
        }

        listarEmissoes();
      })
      .catch(e => {
        addErrorMessage("Erro ao enviar a emissão!");
      });
  }

  return (
    <div>
      <Row>
        <Col xs={12} sm={8}>
          <h4>Lista de emissões</h4>
        </Col>
        <Col xs={12} sm={4} className="text-end">
          <Button href="/emissao/criar">
            <FontAwesomeIcon icon={faPlus} role="button" />
          </Button>
        </Col>
      </Row>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">Data</th>
            <th scope="col">Sucesso</th>
            <th scope="col">Pedidos</th>
            <th scope="col">Tentativas</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {emissoes &&
            emissoes.map((emissao, index) => (
              <tr key={index}>
                <th>
                  {new Date(emissao.dataCriacao).toLocaleDateString('pt-Br')}
                  {' '}
                  {new Date(emissao.dataCriacao).toLocaleTimeString('pt-Br')}
                </th>
                <th>{emissao.sucesso ? 'Sim' : 'Não'}</th>
                <th>{emissao.pedidos.length}</th>
                <th>{emissao.tentativasEnvio.length}</th>
                <td className="text-end">
                  {emissao.tentativasEnvio.length && (
                    <TentativasEnvio className="me-2" tentativas={emissao.tentativasEnvio} />
                  )}
                  {!emissao.sucesso && (
                    <>
                      <FontAwesomeIcon
                        icon={faPlay}
                        role="button"
                        className="text-success me-2"
                        onClick={() => enviarEmissao(emissao.id)} />

                      <ConfirmarDelete onConfirm={() => excluirEmissao(emissao.id)} className="text-danger me-2" />

                      <Link to={`/emissao/editar/${emissao.id}`} title="Editar">
                        <FontAwesomeIcon icon={faPen} role="button" />
                      </Link>
                    </>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmissaoList;