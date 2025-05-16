import http from "../http-common";

const listarTodos = () => {
  return http.get("/pedido");
};

const listarNaoEmitidos = () => {
  return http.get("/pedido/naoemitidos");
};

const obterPorId = id => {
  return http.get(`/pedido/${id}`);
};

const criar = data => {
  return http.post("/pedido", data);
};

const atualizar = (id, data) => {
  return http.put(`/pedido/${id}`, data);
};

const remover = id => {
  return http.delete(`/pedido/${id}`);
};

const PedidoService = {
  listarTodos,
  listarNaoEmitidos,
  obterPorId,
  criar,
  atualizar,
  remover
};

export default PedidoService;
