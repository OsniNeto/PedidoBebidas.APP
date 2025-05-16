import React, { useState, useEffect } from "react";
import RevendaDataService from "../../services/RevendaService";
import { Link } from "react-router-dom";
import ConfirmarDelete from '../Confirmar/ConfirmarDelete';
import { Row, Col, Button } from 'react-bootstrap';
import { useToast } from '../Alertas/AppToastsManager';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';

const RevendaList = () => {
  const [revendas, setRevendas] = useState([]);
  const { addSuccessMessage, addErrorMessage } = useToast();

  useEffect(() => {
    listarRevendas();
  }, []);

  const listarRevendas = () => {
    RevendaDataService.listarTodos()
      .then(response => {
        setRevendas(response.data);
      })
      .catch(e => {
        addErrorMessage("Erro ao listar as revendas!");
      });
  };

  const excluirRevenda = (id) => {
    RevendaDataService.remover(id)
      .then(response => {
        addSuccessMessage("Revenda removida com sucesso!");
        listarRevendas();
      })
      .catch(e => {
        addErrorMessage("Erro ao remover a revenda!");
      });
  };

  return (
    <div>
      <Row>
        <Col xs={12} sm={8}>
          <h4>Lista de revendas</h4>
        </Col>
        <Col xs={12} sm={4} className="text-end">
          <Button href="/revenda/criar">
            <FontAwesomeIcon icon={faPlus} role="button" /> Nova revenda
          </Button>
        </Col>
      </Row>

      <table class="table">
        <thead>
          <tr>
            <th scope="col">Cnpj</th>
            <th scope="col">Razão social</th>
            <th scope="col">Nome fantasia</th>
            <th scope="col">Email</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {revendas && revendas.length ?
            revendas.map((revenda, index) => (
              <tr>
                <th>{revenda.cnpj}</th>
                <td>{revenda.razaoSocial}</td>
                <td>{revenda.nomeFantasia}</td>
                <td>{revenda.email}</td>
                <td className="text-end">
                  <ConfirmarDelete onConfirm={() => excluirRevenda(revenda.id)} className="text-danger me-2" />

                  <Link to={`/revenda/editar/${revenda.id}`} title="Editar">
                    <FontAwesomeIcon icon={faPen} role="button" />
                  </Link>
                </td>
              </tr>
            ))
            :
            <tr className="text-center">
              <th colSpan={5}>Nenhuma revenda cadastrada</th>
            </tr>
            }
        </tbody>
      </table>
    </div>
  );
};

export default RevendaList;