import http from "../http-common";

const listarTodos = () => {
  return http.get("/emissao");
};

const obterPorId = id => {
  return http.get(`/emissao/${id}`);
};

const criar = data => {
  return http.post("/emissao", data);
};

const atualizar = (id, data) => {
  return http.put(`/emissao/${id}`, data);
};

const remover = id => {
  return http.delete(`/emissao/${id}`);
};

const enviar = id => {
  return http.post(`/emissao/${id}/enviar`, {});
};

const EmissaoService = {
  listarTodos,
  obterPorId,
  criar,
  atualizar,
  remover,
  enviar
};

export default EmissaoService;
