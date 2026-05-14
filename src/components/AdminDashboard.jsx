import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  getProdutos,
  deletarProduto,
  getCategorias,
} from '../hooks/API';
import FormProduto from './formProduto';

function AdminDashboard({ aoSair, cliente }) {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);

  const carregar = async (search = '') => {
    setLoading(true);
    setErro('');
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const [prods, cats] = await Promise.all([getProdutos(params), getCategorias()]);
      setProdutos(prods);
      setCategorias(cats);
    } catch (err) {
      setErro(err.message || 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleBusca = (e) => {
    e.preventDefault();
    carregar(busca);
  };

  const handleDeletar = async (produto) => {
    if (!window.confirm(`Deletar "${produto.nome_produto}"?`)) return;
    try {
      await deletarProduto(produto.id);
      carregar(busca);
    } catch {
      alert('Erro ao deletar produto.');
    }
  };

  const abrirNovo = () => { setProdutoEditando(null); setModalAberto(true); };
  const abrirEditar = (produto) => { setProdutoEditando(produto); setModalAberto(true); };
  const fecharModal = () => { setModalAberto(false); setProdutoEditando(null); };
  const aoSalvar = () => { fecharModal(); carregar(busca); };

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
        <div className="container">
          <span className="navbar-brand fw-bold">
            TechStore <span className="badge bg-danger ms-1">Admin</span>
          </span>
          <div className="d-flex align-items-center gap-3">
            <span className="text-white-50 small d-none d-lg-inline">
              {cliente?.nome}
            </span>
            <button className="btn btn-outline-danger btn-sm" onClick={aoSair}>Sair</button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
          <h3 className="fw-bold mb-0">Gerenciar Produtos</h3>
          <button className="btn btn-primary fw-bold" onClick={abrirNovo}>
            + Novo Produto
          </button>
        </div>

        {/* Busca */}
        <form onSubmit={handleBusca} className="d-flex gap-2 mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar produto ou categoria..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button type="submit" className="btn btn-outline-secondary px-4">Buscar</button>
          {busca && (
            <button type="button" className="btn btn-outline-danger"
              onClick={() => { setBusca(''); carregar(); }}>✕</button>
          )}
        </form>

        {/* Estados */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-2 text-muted">Carregando produtos...</p>
          </div>
        )}
        {erro && <div className="alert alert-danger">{erro}</div>}

        {/* Tabela */}
        {!loading && !erro && (
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-dark">
                  <tr>
                    <th>ID</th>
                    <th>Imagem</th>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th>Preço</th>
                    <th>Estoque</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {produtos.length === 0 ? (
                    <tr><td colSpan="7" className="text-center text-muted py-4">Nenhum produto encontrado.</td></tr>
                  ) : produtos.map((p) => (
                    <tr key={p.id}>
                      <td className="text-muted small">#{p.id}</td>
                      <td>
                        {p.imagem_principal?.imagem_url ? (
                          <img src={p.imagem_principal.imagem_url} alt={p.nome_produto}
                            style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                        ) : (
                          <div style={{ width: 48, height: 48, background: '#dee2e6', borderRadius: 6 }} />
                        )}
                      </td>
                      <td className="fw-bold">{p.nome_produto}</td>
                      <td><span className="badge bg-secondary">{p.categoria_nome}</span></td>
                      <td className="text-success fw-bold">
                        {parseFloat(p.preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </td>
                      <td>
                        <span className={`badge ${p.em_estoque ? 'bg-success' : 'bg-danger'}`}>
                          {p.estoque} un.
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => abrirEditar(p)}>
                            ✏️ Editar
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeletar(p)}>
                            🗑️ Deletar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal de cadastro/edição */}
      {modalAberto && (
        <FormProduto
          produto={produtoEditando}
          categorias={categorias}
          aoSalvar={aoSalvar}
          aoFechar={fecharModal}
        />
      )}
    </div>
  );
}

export default AdminDashboard;