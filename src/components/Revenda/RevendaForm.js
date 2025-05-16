import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import RevendaDataService from "../../services/RevendaService";
import { Form, Row, Col, Button, Card, Toast, ToastContainer } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useToast } from '../Alertas/AppToastsManager';
import MaskedInput from './../Mask/MaskedInput';

const RevendaForm = props => {
  const { id } = useParams();
  let navigate = useNavigate();
  const { addSuccessMessage, addErrorMessage } = useToast();
  const [cnpjErro, setCnpjErro] = useState(false);
  const [validated, setValidated] = useState(false);

  const revendaInicial = {
    id: null,
    cnpj: "",
    razaoSocial: "",
    nomeFantasia: "",
    email: "",
    telefones: [],
    contatos: [],
    enderecosEntrega: [],
  };
  const [revenda, setRevenda] = useState(revendaInicial);

  const getRevenda = id => {
    RevendaDataService.obterPorId(id)
      .then(response => {
        setRevenda(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const addTelefone = () => {
    setRevenda(prev => ({
      ...prev,
      telefones: [...prev.telefones, {
        numero: "",
      }]
    }));
  };

  const updateTelefone = (index, field, value) => {
    const novos = [...revenda.telefones];
    novos[index][field] = value;
    setRevenda(prev => ({ ...prev, telefones: novos }));
  };

  const removeTelefone = (index) => {
    const novos = [...revenda.telefones];
    novos.splice(index, 1);
    setRevenda(prev => ({ ...prev, telefones: novos }));
  };

  const addContato = () => {
    var principal = revenda.contatos.length === 0;

    setRevenda(prev => ({
      ...prev,
      contatos: [...prev.contatos, {
        nome: "",
        principal: principal,
      }]
    }));
  };

  const updateContato = (index, field, value) => {
    setRevenda((prev) => {
      const novosContatos = prev.contatos.map((contato, i) => {
        if (field === "principal") {
          return {
            ...contato,
            principal: i === index ? value : false, // Só um pode ser true
          };
        }

        if (i === index) {
          return {
            ...contato,
            [field]: value,
          };
        }

        return contato;
      });

      return {
        ...prev,
        contatos: novosContatos,
      };
    });
  };

  const removeContato = (index) => {
    const novos = [...revenda.contatos];
    novos.splice(index, 1);
    setRevenda(prev => ({ ...prev, contatos: novos }));
  };

  const addEndereco = () => {
    setRevenda(prev => ({
      ...prev,
      enderecosEntrega: [...prev.enderecosEntrega, {
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cep: "",
        cidade: "",
        estado: "",
        pais: "",
      }]
    }));
  };

  const updateEndereco = (index, field, value) => {
    const novos = [...revenda.enderecosEntrega];
    novos[index][field] = value;
    setRevenda(prev => ({ ...prev, enderecosEntrega: novos }));
  };

  const removeEndereco = (index) => {
    const novos = [...revenda.enderecosEntrega];
    novos.splice(index, 1);
    setRevenda(prev => ({ ...prev, enderecosEntrega: novos }));
  };

  const handleInputChange = event => {
    const { name, value } = event.target;
    setRevenda({ ...revenda, [name]: value });
    setCnpjErro(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.currentTarget;

    setValidated(true);

    if (revenda.contatos.length === 0) {
      addErrorMessage("Adicione ao menos um contato.");
      return;
    }
    const hasPrincipal = revenda.contatos.some(c => c.principal);
    if (!hasPrincipal) {
      addErrorMessage("Selecione um contato como principal.");
      return;
    }
    if (revenda.enderecosEntrega.length === 0) {
      addErrorMessage("Adicione ao menos um endereço.");
      return;
    }

    if (form.checkValidity() === true) {
      if (id)
        atualizarRevenda();
      else
        criarRevenda();
    }
  };

  const atualizarRevenda = () => {
    RevendaDataService.atualizar(id, revenda)
      .then(response => {
        addSuccessMessage("Revenda atualizada com sucesso!");
        navigate("/revenda/listar");
      })
      .catch(e => {
        addErrorMessage("Erro ao atualizar a revenda!");
      });
  };

  const criarRevenda = () => {
    RevendaDataService.criar(revenda)
      .then(response => {
        addSuccessMessage("Revenda criada com sucesso!");
        navigate("/revenda/listar");
      })
      .catch(e => {
        addErrorMessage("Erro ao criar a revenda!");
      });
  };

  const cancelar = () => {
    navigate("/revenda/listar");
  };

  useEffect(() => {
    if (id)
      getRevenda(id);
  }, [id]);

  function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, '');
    if (cnpj.length !== 14) return false;
    if (/^(\d)\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;

    return true;
  }
  const handleCnpjBlur = (event) => {
    if (!validarCNPJ(event.target.value)) {
      setCnpjErro(true);
    } else {
      setCnpjErro(false);
    }
  };

  return (
    <div>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row>
          <Col xs={12} sm={8}>
            <h4>Revenda</h4>
          </Col>
          <Col xs={12} sm={4} className="text-end">
            <Button type="button" variant="secondary" className="me-2" onClick={cancelar}>Cancelar</Button>
            <Button type="submit">Salvar</Button>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Group controlId="cnpj" as={Col} md="3">
            <Form.Label>CNPJ</Form.Label>
            <MaskedInput
              mask="00.000.000/0000-00"
              name="cnpj"
              value={revenda.cnpj ?? ''}
              placeholder="00.000.000/0000-00"
              onChange={handleInputChange}
              required
              onBlur={handleCnpjBlur}
              className={`form-control ${cnpjErro ? 'is-invalid' : ''}`}
            />
            <Form.Control.Feedback type="invalid">
              Informe um CNPJ válido.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} md="6" controlId="razaoSocial">
            <Form.Label>Razão social</Form.Label>
            <Form.Control
              required
              type="text"
              maxLength={200}
              placeholder="Razão social da revenda"
              name="razaoSocial"
              value={revenda.razaoSocial ?? ''}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Informe a razão social da revenda.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md="6" controlId="nomeFantasia">
            <Form.Label>Nome fantasia</Form.Label>
            <Form.Control
              required
              type="text"
              maxLength={200}
              placeholder="Nome fantasia da revenda"
              name="nomeFantasia"
              value={revenda.nomeFantasia ?? ''}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Informe o nome fantasia da revenda.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md="6" controlId="email">
            <Form.Label>E-mail</Form.Label>
            <Form.Control
              required
              type="email"
              maxLength={200}
              placeholder="E-mail da revenda"
              name="email"
              value={revenda.email ?? ''}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              Informe um e-mail válido da revenda.
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        {/* Telefones e Contatos */}
        <Row className="mb-3">
          {/* Telefones */}
          <Col xs={12} sm={6}>
            <Card>
              <Card.Header>Telefones</Card.Header>
              <Card.Body>
                {revenda.telefones.map((tel, i) => (
                  <Row key={i} className="align-items-end mb-3">
                    <Col>
                      <Form.Group>
                        <MaskedInput
                          mask="(00) 00000-0000"
                          value={tel.numero}
                          placeholder="(00) 00000-0000"
                          required
                          onChange={e => updateTelefone(i, "numero", e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                          Informe um telefone válido da revenda.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col xs="auto">
                      <Button variant="danger" onClick={() => removeTelefone(i)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Button variant="secondary" onClick={addTelefone}>+ Adicionar Telefone</Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Contatos */}
          <Col xs={12} sm={6}>
            <Card>
              <Card.Header>Contatos</Card.Header>
              <Card.Body>
                {revenda.contatos.map((contato, i) => (
                  <Row key={i} className="align-items-end mb-2">
                    <Col md={5}>
                      <Form.Group controlId="nomeContato">
                        <Form.Control
                          required
                          type="text"
                          maxLength={150}
                          value={contato.nome}
                          onChange={e => updateContato(i, "nome", e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                          Informe o nome do contato.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group>
                        <Form.Check
                          type="checkbox"
                          label="Principal"
                          checked={contato.principal}
                          onChange={e => updateContato(i, "principal", e.target.checked)}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs="auto">
                      <Button variant="danger" onClick={() => removeContato(i)}>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Button variant="secondary" onClick={addContato}>+ Adicionar Contato</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Endereços de Entrega */}
        <Card>
          <Card.Header>Endereços de Entrega</Card.Header>
          <Card.Body>
            {revenda.enderecosEntrega.map((end, i) => (
              <div key={i} className="border rounded p-3 mb-3">
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="logradouro">
                      <Form.Label>Logradouro</Form.Label>
                      <Form.Control
                        required
                        value={end.logradouro}
                        maxLength={200}
                        onChange={e => updateEndereco(i, "logradouro", e.target.value)} />
                      <Form.Control.Feedback type="invalid">
                        Informe o logradouro da revenda.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Número</Form.Label>
                      <Form.Control
                        value={end.numero}
                        maxLength={50}
                        onChange={e => updateEndereco(i, "numero", e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Complemento</Form.Label>
                      <Form.Control
                        value={end.complemento}
                        maxLength={50}
                        onChange={e => updateEndereco(i, "complemento", e.target.value)} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group controlId="bairro">
                      <Form.Label>Bairro</Form.Label>
                      <Form.Control
                        required
                        value={end.bairro}
                        maxLength={50}
                        onChange={e => updateEndereco(i, "bairro", e.target.value)} />
                      <Form.Control.Feedback type="invalid">
                        Informe o bairro da revenda.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="cep">
                      <Form.Label>CEP</Form.Label>
                      <MaskedInput
                        mask="00000-000"
                        value={end.cep}
                        placeholder="00000-000"
                        required
                        onChange={e => updateEndereco(i, "cep", e.target.value)}
                      />
                      <Form.Control.Feedback type="invalid">
                        Informe o cep da revenda.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <Form.Group controlId="cidade">
                      <Form.Label>Cidade</Form.Label>
                      <Form.Control
                        required
                        value={end.cidade}
                        maxLength={100}
                        onChange={e => updateEndereco(i, "cidade", e.target.value)} />
                      <Form.Control.Feedback type="invalid">
                        Informe a cidade da revenda.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="estado">
                      <Form.Label>Estado</Form.Label>
                      <Form.Control
                        required
                        value={end.estado}
                        maxLength={100}
                        onChange={e => updateEndereco(i, "estado", e.target.value)} />
                      <Form.Control.Feedback type="invalid">
                        Informe o estado da revenda.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group controlId="pais">
                      <Form.Label>País</Form.Label>
                      <Form.Control
                        required
                        value={end.pais}
                        maxLength={100}
                        onChange={e => updateEndereco(i, "pais", e.target.value)} />
                      <Form.Control.Feedback type="invalid">
                        Informe o pais da revenda.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="mt-3">
                  <Button variant="danger" onClick={() => removeEndereco(i)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="secondary" onClick={addEndereco}>+ Adicionar Endereço de Entrega</Button>
          </Card.Body>
        </Card>

      </Form>
    </div >
  );
};

export default RevendaForm;