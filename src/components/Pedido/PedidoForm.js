import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Row, Col, Button, Card, Toast, ToastContainer } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '../Alertas/AppToastsManager';

import PedidoDataService from "../../services/PedidoService";
import RevendaDataService from "../../services/RevendaService";

const PedidoForm = props => {
  const { id } = useParams();
  let navigate = useNavigate();
  const { addSuccessMessage, addErrorMessage } = useToast();

  const pedidoInicial = {
    id: null,
    cliente: "",
    pedidoProdutos: [],
  };
  const [pedido, setPedido] = useState(pedidoInicial);
  const [revendas, setRevendas] = useState([]);

  const getPedido = id => {
    PedidoDataService.obterPorId(id)
      .then(response => {
        setPedido(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const [validated, setValidated] = useState(false);

const onSelectChange = event => {
    pedido.revendaId = event.target.value;
}

  const addProduto = () => {
    setPedido(prev => ({
      ...prev,
      pedidoProdutos: [...prev.pedidoProdutos, {
        produto: "",
        quantidade: 1
      }]
    }));
  };

  const updateProduto = (index, field, value) => {
    const novos = [...pedido.pedidoProdutos];
    novos[index][field] = value;
    setPedido(prev => ({ ...prev, pedidoProdutos: novos }));
  };

  const removeProduto = (index) => {
    const novos = [...pedido.pedidoProdutos];
    novos.splice(index, 1);
    setPedido(prev => ({ ...prev, pedidoProdutos: novos }));
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setPedido({ ...pedido, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    setValidated(true);

    if (pedido.pedidoProdutos.length === 0) {
      addErrorMessage("Adicione ao menos um produto.");
      return;
    }

    if (form.checkValidity() === true) {
      if (id)
        atualizarPedido();
      else
        criarPedido();
    }
  };

  const atualizarPedido = () => {
    PedidoDataService.atualizar(id, pedido)
      .then(response => {
        console.log(response.data);
        addSuccessMessage("Pedido atualizado com sucesso!");
        navigate("/pedido/listar");
      })
      .catch(e => {
        addErrorMessage("Erro ao atualizar o pedido!");
      });
  };

  const criarPedido = () => {
    PedidoDataService.criar(pedido)
      .then(response => {
        addSuccessMessage("Pedido criado com sucesso!");
        navigate("/pedido/listar");
      })
      .catch(e => {
        addErrorMessage("Erro ao criar o pedido!");
      });
  };

  const cancelar = () => {
    navigate("/pedido/listar");
  };

  const listarRevendas = () => {
    RevendaDataService.listarTodos()
      .then(response => {
        setRevendas(response.data);
      })
      .catch(e => {
        addErrorMessage("Erro ao listar as revendas!");
      });
  };

  useEffect(() => {
    if (id)
      getPedido(id);
    listarRevendas();
  }, [id]);

  return (
    <div>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} sm={8}>
            <h4>Pedido</h4>
          </Col>
          <Col xs={12} sm={4} className="text-end">
            <Button type="button" variant="secondary" className="me-2" onClick={cancelar}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="revendaSelect" as={Col} md="6">
            <Form.Label>Revenda</Form.Label>
            <Form.Select
              value={pedido.revendaId} 
              onChange={onSelectChange} 
              required>
              <option value="">Selecione uma revenda</option>
              {revendas.map((revenda) => (
                <option key={revenda.id} value={revenda.id}>
                  {revenda.razaoSocial}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Selecione uma revenda.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="cliente" as={Col} md="6">
            <Form.Label>Cliente</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Cliente do pedido"
              name="cliente"
              value={pedido.cliente ?? ''}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Informe o Cliente do pedido.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        {/* Produtos */}
        <Card>
          <Card.Header>Produtos</Card.Header>
          <Card.Body>
            {pedido.pedidoProdutos.map((prod, i) => (
              <div key={i} className="border rounded p-3 mb-3">
                <Row>
                  <Col md={8}>
                    <Form.Group controlId="produto">
                      <Form.Control
                        required
                        placeholder="Produto"
                        value={prod.produto}
                        onChange={e => updateProduto(i, "produto", e.target.value)} />
                      <Form.Control.Feedback type="invalid">
                        Informe o produto do pedido.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group controlId="quantidade">
                      <Form.Control
                        required
                        placeholder="Quantidade"
                        value={prod.quantidade}
                        type="number"
                        min="1"
                        onChange={e => updateProduto(i, "quantidade", e.target.value)} />
                      <Form.Control.Feedback type="invalid">
                        Informe a quantidade de produtos.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={1}>
                    <Button variant="danger" onClick={() => removeProduto(i)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                  </Col>
                </Row>
              </div>
            ))}
            <Button variant="secondary" onClick={addProduto}>+ Adicionar produto</Button>
          </Card.Body>
        </Card>

      </Form>
    </div >
  );
};

export default PedidoForm;