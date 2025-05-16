import logo from './logo.svg';
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

import { ToastProvider } from './components/Alertas/AppToastsManager';

import RevendaList from "./components/Revenda/RevendaList";
import RevendaForm from "./components/Revenda/RevendaForm";
import PedidoList from "./components/Pedido/PedidoList";
import PedidoForm from "./components/Pedido/PedidoForm";
import EmissaoList from "./components/Emissao/EmissaoList";
import EmissaoForm from "./components/Emissao/EmissaoForm";

function App() {
  return (
    <ToastProvider>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <a href="/tutorials" className="navbar-brand">
            Pedido Bebidas
          </a>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/revenda/listar"} className="nav-link">
                Revendas
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/pedido/listar"} className="nav-link">
                Pedidos
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/emissao/listar"} className="nav-link">
                Emissão
              </Link>
            </li>
          </div>
        </nav>

        <div className="container mt-3">
          <Routes>
            <Route path="/revenda/listar" element={<RevendaList />} />
            <Route path="/revenda/criar" element={<RevendaForm />} />
            <Route path="/revenda/editar/:id" element={<RevendaForm />} />
            <Route path="/pedido/listar" element={<PedidoList />} />
            <Route path="/pedido/criar" element={<PedidoForm />} />
            <Route path="/pedido/editar/:id" element={<PedidoForm />} />
            <Route path="/emissao/listar" element={<EmissaoList />} />
            <Route path="/emissao/criar" element={<EmissaoForm />} />
            <Route path="/emissao/editar/:id" element={<EmissaoForm />} />
          </Routes>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;
