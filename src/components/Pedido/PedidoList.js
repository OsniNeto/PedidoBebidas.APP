import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ConfirmarDelete from '../Confirmar/ConfirmarDelete';
import { Row, Col, Button } from 'react-bootstrap';
import { useToast } from '../Alertas/AppToastsManager';

import PedidoDataService from "../../services/PedidoService";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';

const PedidoList = () => {
  const [pedidos, setPedidos] = useState([]);
  const { addSuccessMessage, addErrorMessage } = useToast();

  useEffect(() => {
    listarPedidos();
  }, []);

  const listarPedidos = () => {
    PedidoDataService.listarTodos()
      .then(response => {
        setPedidos(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const excluirPedido = (id) => {
    PedidoDataService.remover(id)
      .then(response => {
        addSuccessMessage("Pedido removido com sucesso!");
        listarPedidos();
      })
      .catch(e => {
        addErrorMessage("Erro ao remover o pedido!");
      });
  };

  return (
    <div>
      <Row>
        <Col xs={12} sm={8}>
          <h4>Lista de pedidos</h4>
        </Col>
        <Col xs={12} sm={4} className="text-end">
          <Button href="/pedido/criar">
            <FontAwesomeIcon icon={faPlus} role="button" />
          </Button>
        </Col>
      </Row>

      <table class="table">
        <thead>
          <tr>
            <th scope="col">Identificador</th>
            <th scope="col">Cliente</th>
            <th scope="col">Revenda</th>
            <th scope="col">Quantidade Itens</th>
            <th scope="col">Enviado</th>
            <th scope="col">Resultado envio</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {pedidos &&
            pedidos.map((pedido, index) => (
              <tr>
                <th>{pedido.identificador}</th>
                <th>{pedido.cliente}</th>
                <td>{pedido.revenda.razaoSocial}</td>
                <th>{pedido.quantidadeTotalItens}</th>
                <th>{pedido.enviado ? 'Sim' : 'Não'}</th>
                <th>{pedido.respostaEnvio}</th>
                <td className="text-end">
                  {!pedido.enviado && (
                    <>
                      <ConfirmarDelete onConfirm={() => excluirPedido(pedido.id)} className="text-danger me-2" />

                      <Link to={`/pedido/editar/${pedido.id}`} title="Editar">
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

export default PedidoList;