import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProdutos } from '../hooks/API';

function Dashboard({ aoSair, qtdCarrinho, cliente }) {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');

  const carregarProdutos = async (search = '') => {
    setLoading(true);
    setErro('');
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const data = await getProdutos(params);
      setProdutos(data);
    } catch (err) {
      setErro(err.message || 'Erro ao carregar produtos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const handleBusca = (e) => {
    e.preventDefault();
    carregarProdutos(busca);
  };

  return (


    <div className="bg-light min-vh-100 pb-5">
      {/* Barra de Navegação Superior */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">TechStore</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarLoja">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarLoja">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><Link className="nav-link active" to="/">Início</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/ofertas">Ofertas</Link></li>
            </ul>
            <div className="d-flex align-items-center gap-3">
              {cliente && (
                <span className="text-white-50 small d-none d-lg-inline">
                  Olá, {cliente.nome}
                </span>
              )}

              {(cliente?.role === 'admin' || cliente?.role === 'estoque') && (
                <Link to="/admin" className="btn btn-warning btn-sm fw-bold">
                  ⚙️ Admin
                </Link>
              )}
              <Link to="/carrinho" className="text-white text-decoration-none fw-bold">
                🛒 Carrinho <span className="badge bg-danger rounded-pill">{qtdCarrinho}</span>
              </Link>
              <button className="btn btn-outline-danger btn-sm" onClick={aoSair}>Sair</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container">
        {/* Banner de Destaque */}
        <div className="p-5 mb-4 bg-primary text-white rounded-3 shadow-sm">
          <div className="container-fluid py-2">
            <h1 className="display-5 fw-bold">Semana da Tecnologia</h1>
            <p className="col-md-8 fs-5">Aproveite as melhores ofertas em notebooks, smartphones e periféricos. Descontos de até 30% em toda a loja!</p>
            <Link to="/ofertas" className="btn btn-light btn-lg fw-bold" type="button">Ver Ofertas</Link>
          </div>
        </div>

        {/* Barra de busca */}
        <form onSubmit={handleBusca} className="d-flex gap-2 mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por produto ou categoria..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button type="submit" className="btn btn-outline-secondary px-4">Buscar</button>
          {busca && (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => { setBusca(''); carregarProdutos(); }}
            >✕</button>
          )}
        </form>

        <h3 className="mb-4 fw-bold text-secondary">
          {busca ? `Resultados para "${busca}"` : 'Lançamentos'}
        </h3>

        {/* Estados */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-2 text-muted">Carregando produtos...</p>
          </div>
        )}

        {erro && (
          <div className="alert alert-danger">{erro}</div>
        )}

        {!loading && !erro && produtos.length === 0 && (
          <div className="text-center py-5 text-muted">
            <p>Nenhum produto encontrado.</p>
          </div>
        )}

        {/* Grid de Produtos */}
        {!loading && !erro && (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {produtos.map((produto) => {
              const imagemUrl = produto.imagem_principal?.imagem_url;
              const preco = parseFloat(produto.preco);

              return (
                <div className="col" key={produto.id}>
                  <div className="card h-100 shadow-sm border-0">
                    {imagemUrl ? (
                      <img
                        src={imagemUrl}
                        className="card-img-top"
                        alt={produto.imagem_principal?.alt || produto.nome_produto}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        className="card-img-top d-flex align-items-center justify-content-center bg-secondary text-white"
                        style={{ height: '200px' }}
                      >
                        <span>Sem imagem</span>
                      </div>
                    )}

                    <div className="card-body d-flex flex-column">
                      <span className="badge bg-secondary mb-1 align-self-start">{produto.categoria_nome}</span>
                      <h5 className="card-title fw-bold">{produto.nome_produto}</h5>

                      {produto.media_avaliacoes > 0 && (
                        <small className="text-warning mb-1">
                          {'★'.repeat(Math.round(produto.media_avaliacoes))}
                          {'☆'.repeat(5 - Math.round(produto.media_avaliacoes))}
                          {' '}({produto.media_avaliacoes.toFixed(1)})
                        </small>
                      )}

                      <p className="card-text text-success fs-4 fw-bold mb-1">
                        {preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>

                      {!produto.em_estoque && (
                        <span className="badge bg-danger mb-2">Fora de estoque</span>
                      )}

                      <Link
                        to={`/produto/${produto.id}`}
                        className="btn btn-primary mt-auto w-100 fw-bold"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;