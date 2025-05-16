import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Row, Col, Button, Card, Toast, ToastContainer } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faBan } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '../Alertas/AppToastsManager';

import EmissaoDataService from "../../services/EmissaoService";
import PedidoDataService from "../../services/PedidoService";

const EmissaoForm = props => {
  const { id } = useParams();
  let navigate = useNavigate();
  const { addSuccessMessage, addErrorMessage } = useToast();

  const emissaoInicial = {
    id: null,
    cliente: "",
    pedidoProdutos: [],
  };
  const [emissao, setEmissao] = useState(emissaoInicial);
  const [pedidos, setPedidos] = useState([]);

  const obterEmissao = id => {
    EmissaoDataService.obterPorId(id)
      .then(response => {
        setEmissao(response.data);

        const pedidosSelecionados = response.data.pedidos.map(p => ({
          ...p.pedido,
          selecionado: true
        }));

        setPedidos(prev => [...prev, ...pedidosSelecionados]);
      })
      .catch(e => {
        addErrorMessage("Erro ao obter emissão.");
      });
  };

  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    setValidated(true);

    if (!temPedidosSelecionados()) {
      addErrorMessage("Adicione ao menos um pedido.");
      return;
    }

    if (form.checkValidity() === true) {
      if (id)
        atualizarEmissao();
      else
        criarEmissao();
    }
  };

  const temPedidosSelecionados = () => {
    return pedidos.some(p => p.selecionado);
  };

  const atualizarEmissao = () => {
    var idsSelecionados = pedidos
      .filter(p => p.selecionado)
      .map(p => p.id);

    var payload = {
      pedidos: idsSelecionados
    };

    EmissaoDataService.atualizar(id, payload)
      .then(response => {
        addSuccessMessage("Emissão atualizada com sucesso!");
        navigate("/emissao/listar");
      })
      .catch(e => {
        addErrorMessage("Erro ao atualizar a emissão!");
      });
  };

  const criarEmissao = () => {
    var idsSelecionados = pedidos
      .filter(p => p.selecionado)
      .map(p => p.id);

    var payload = {
      pedidos: idsSelecionados
    };

    EmissaoDataService.criar(payload)
      .then(response => {
        addSuccessMessage("Pedido criado com sucesso!");
        navigate("/emissao/listar");
      })
      .catch(e => {
        addErrorMessage("Erro ao criar o pedido!");
      });
  };

  const cancelar = () => {
    navigate("/emissao/listar");
  };

  const listarPedidos = () => {
    PedidoDataService.listarNaoEmitidos()
      .then(response => {
        const pedidosSelecionados = response.data.map(p => ({
          ...p,
          selecionado: false
        }));

        setPedidos(prev => [...prev, ...pedidosSelecionados]);
      })
      .catch(e => {
        addErrorMessage("Erro ao listar os pedidos!");
      });
  };

  const setSelecionado = (id, selecionado) => {
    setPedidos(pedidos.map(p =>
      p.id === id ? { ...p, selecionado } : p
    ));
  };

  useEffect(() => {
    if (id)
      obterEmissao(id);
    listarPedidos();
  }, [id]);

  return (
    <div>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} sm={8}>
            <h4>Emissão</h4>
          </Col>
          <Col xs={12} sm={4} className="text-end">
            <Button type="button" variant="secondary" className="me-2" onClick={cancelar}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </Col>
        </Row>

        <Row>
          <Col xs={12} sm={6}>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Identificador</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Revenda</th>
                  <th scope="col">Quantidade Itens</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {pedidos &&
                  pedidos
                    .filter(pedido => !pedido.selecionado)
                    .map((pedido, index) => (
                      <tr key={index}>
                        <th>{pedido.identificador}</th>
                        <th>{pedido.cliente}</th>
                        <td>{pedido.revenda.razaoSocial}</td>
                        <th>{pedido.quantidadeTotalItens}</th>
                        <td className="text-end">
                          <FontAwesomeIcon
                            icon={faCheck}
                            role="button"
                            className="text-success"
                            onClick={() => setSelecionado(pedido.id, true)}
                          />
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </Col>
          <Col xs={12} sm={6}>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Identificador</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Revenda</th>
                  <th scope="col">Quantidade Itens</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {pedidos &&
                  pedidos
                    .filter(pedido => pedido.selecionado)
                    .map((pedido, index) => (
                      <tr>
                        <th>{pedido.identificador}</th>
                        <th>{pedido.cliente}</th>
                        <td>{pedido.revenda.razaoSocial}</td>
                        <th>{pedido.quantidadeTotalItens}</th>
                        <td className="text-end">
                          <FontAwesomeIcon
                            icon={faBan}
                            className="text-danger"
                            role="button"
                            onClick={() => setSelecionado(pedido.id, false)}
                          />
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </Col>
        </Row>
      </Form>
    </div >
  );
};

export default EmissaoForm;