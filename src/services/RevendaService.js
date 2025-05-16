import http from "../http-common";

const listarTodos = () => {
  return http.get("/revenda");
};

const obterPorId = id => {
  return http.get(`/revenda/${id}`);
};

const criar = data => {
  return http.post("/revenda", data);
};

const atualizar = (id, data) => {
  return http.put(`/revenda/${id}`, data);
};

const remover = id => {
  return http.delete(`/revenda/${id}`);
};

const RevendaService = {
  listarTodos,
  obterPorId,
  criar,
  atualizar,
  remover,
};

export default RevendaService;
