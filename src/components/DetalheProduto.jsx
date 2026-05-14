import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BotaoVoltar from './BotaoVoltar';
import { getProduto, getAvaliacoesProduto } from '../hooks/API';

function DetalheProduto({ adicionarAoCarrinho }) {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [imagemAtiva, setImagemAtiva] = useState(0);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const carregar = async () => {
      setLoading(true);
      setErro('');
      try {
        const [prod, avs] = await Promise.all([
          getProduto(id),
          getAvaliacoesProduto(id),
        ]);
        setProduto(prod);
        setAvaliacoes(avs);
      } catch (err) {
        setErro(err.message || 'Erro ao carregar produto.');
      } finally {
        setLoading(false);
      }
    };
    carregar();
  }, [id]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status" />
        <p className="mt-2 text-muted">Carregando produto...</p>
      </div>
    );
  }

  if (erro || !produto) {
    return (
      <div className="container mt-5">
        <BotaoVoltar />
        <div className="alert alert-danger mt-3">{erro || 'Produto não encontrado.'}</div>
      </div>
    );
  }

  const preco = parseFloat(produto.preco);
  const imagens = produto.imagens || [];
  const imagemPrincipal = imagens[imagemAtiva]?.imagem_url || null;

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        {/* Coluna da Imagem */}
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm">
            {imagemPrincipal ? (
              <img
                src={imagemPrincipal}
                alt={imagens[imagemAtiva]?.alt || produto.nome_produto}
                className="img-fluid rounded"
                style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
              />
            ) : (
              <div
                className="d-flex align-items-center justify-content-center bg-secondary text-white rounded"
                style={{ height: '300px' }}
              >
                Sem imagem
              </div>
            )}
          </div>

          {/* Miniaturas */}
          {imagens.length > 1 && (
            <div className="d-flex gap-2 mt-2 flex-wrap">
              {imagens.map((img, idx) => (
                <img
                  key={img.id}
                  src={img.imagem_url}
                  alt={img.alt}
                  onClick={() => setImagemAtiva(idx)}
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: idx === imagemAtiva ? '2px solid #0d6efd' : '2px solid transparent',
                    borderRadius: '4px',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Coluna de Informações */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <span className="text-muted mb-2">Categoria: {produto.categoria_nome}</span>
          <BotaoVoltar />
          <h1 className="fw-bold mb-3">{produto.nome_produto}</h1>

          <h2 className="text-success fw-bold display-6 mb-1">
            {preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </h2>

          {produto.media_avaliacoes > 0 && (
            <div className="mb-2 text-warning">
              {'★'.repeat(Math.round(produto.media_avaliacoes))}
              {'☆'.repeat(5 - Math.round(produto.media_avaliacoes))}
              <small className="text-muted ms-1">({produto.media_avaliacoes.toFixed(1)})</small>
            </div>
          )}

          <p className="text-muted mb-2">
            Estoque: {produto.em_estoque
              ? <span className="text-success fw-bold">{produto.estoque} disponíveis</span>
              : <span className="text-danger fw-bold">Fora de estoque</span>
            }
          </p>

          <div className="p-4 bg-light rounded-3 shadow-sm border">
            <button
              onClick={() => adicionarAoCarrinho(produto)}
              className="btn btn-primary btn-lg w-100 fw-bold text-uppercase mt-3"
              disabled={!produto.em_estoque}
            >
              🛒 Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>

      <hr className="my-5" />

      {/* Avaliações */}
      <div className="row">
        <div className="col-12">
          <h3 className="fw-bold mb-3">Avaliações ({avaliacoes.length})</h3>
          {avaliacoes.length === 0 ? (
            <p className="text-muted">Ainda não há avaliações para este produto.</p>
          ) : (
            <ul className="list-group list-group-flush">
              {avaliacoes.map((av) => (
                <li key={av.id} className="list-group-item px-0">
                  <div className="d-flex justify-content-between">
                    <strong>{av.cliente_nome}</strong>
                    <span className="text-warning">{'★'.repeat(Math.round(av.nota))}{'☆'.repeat(5 - Math.round(av.nota))}</span>
                  </div>
                  <p className="mb-0 text-muted">{av.comentario}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetalheProduto;