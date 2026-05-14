import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProdutos } from '../hooks/API';

function Ofertas() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);
      setErro('');
      try {
        // Traz todos os produtos ordenados por preço para mostrar os mais baratos como "oferta"
        const data = await getProdutos('?ordering=preco');
        // Filtra apenas produtos em estoque
        setProdutos(data.filter((p) => p.em_estoque));
      } catch (err) {
        setErro(err.message || 'Erro ao carregar ofertas.');
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, []);

  return (
    <div className="bg-light min-vh-100 pb-5">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 shadow">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/">TechStore</Link>
          <div className="d-flex">
            <Link to="/" className="btn btn-outline-light btn-sm">← Voltar para a Loja</Link>
          </div>
        </div>
      </nav>

      <div className="container">
        {/* Banner de Ofertas */}
        <div className="p-4 mb-4 bg-danger text-white rounded-3 shadow-sm text-center">
          <h1 className="display-5 fw-bold">🔥 Queima de Estoque</h1>
          <p className="fs-5">As melhores oportunidades — produtos em estoque ordenados pelo melhor preço!</p>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-danger" role="status" />
            <p className="mt-2 text-muted">Carregando ofertas...</p>
          </div>
        )}

        {erro && <div className="alert alert-danger">{erro}</div>}

        {!loading && !erro && produtos.length === 0 && (
          <p className="text-center text-muted py-5">Nenhum produto em oferta no momento.</p>
        )}

        {!loading && !erro && (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {produtos.map((produto) => {
              const preco = parseFloat(produto.preco);
              const imagemUrl = produto.imagem_principal?.imagem_url;

              return (
                <div className="col" key={produto.id}>
                  <div className="card h-100 shadow border-danger">
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
                        Sem imagem
                      </div>
                    )}

                    <div className="card-body d-flex flex-column">
                      <span className="badge bg-secondary mb-1 align-self-start">{produto.categoria_nome}</span>
                      <h5 className="card-title fw-bold">{produto.nome_produto}</h5>
                      <span className="text-danger fs-4 fw-bold mb-3">
                        {preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </span>

                      <Link to={`/produto/${produto.id}`} className="btn btn-danger mt-auto w-100 fw-bold">
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

export default Ofertas;