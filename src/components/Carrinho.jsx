import React, { useState } from 'react';
import BotaoVoltar from './BotaoVoltar';
import { useNavigate } from 'react-router-dom';
import { criarPagamento, criarPedido } from '../hooks/API';

const METODOS_PAGAMENTO = [
  { valor: 'pix', label: 'PIX' },
  { valor: 'cartao_credito', label: 'Cartão de Crédito' },
  { valor: 'cartao_debito', label: 'Cartão de Débito' },
  { valor: 'boleto', label: 'Boleto' },
];

function Carrinho({ carrinho, setCarrinho, cliente }) {
  const navigate = useNavigate();
  const [metodoPagamento, setMetodoPagamento] = useState('pix');
  const [senhaPedido, setSenhaPedido] = useState('');
  const [finalizando, setFinalizando] = useState(false);
  const [erro, setErro] = useState('');

  const valorTotal = carrinho.reduce(
    (total, item) => total + parseFloat(item.preco || item.preco_unitario || 0) * item.quantidade,
    0
  );

  const handleFinalizarCompra = async () => {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    if (!cliente) {
      setErro('Não foi possível identificar o cliente. Faça login novamente.');
      return;
    }

    if (senhaPedido.length < 4) {
      setErro('A senha do pedido deve ter pelo menos 4 caracteres.');
      return;
    }

    setFinalizando(true);
    setErro('');

    try {
      // 1. Cria o pagamento
      const pagamento = await criarPagamento(metodoPagamento, valorTotal.toFixed(2));

      // 2. Cria o pedido com os itens do carrinho
      const itensPedido = carrinho.map((item) => ({
        produto: item.id,
        quantidade: item.quantidade,
        preco_unitario: parseFloat(item.preco || item.preco_unitario || 0).toFixed(2),
      }));

      const pedido = await criarPedido({
        cliente: cliente.id,
        pagamento: pagamento.id,
        senha: senhaPedido,
        itens: itensPedido,
      });

      alert(`✅ Pedido #${pedido.id} realizado com sucesso!`);
      setCarrinho([]);
      navigate('/');
    } catch (err) {
      const msg =
        typeof err === 'string'
          ? err
          : err?.detail || err?.non_field_errors?.[0] || JSON.stringify(err);
      setErro(msg || 'Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setFinalizando(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex align-items-center mb-4 gap-3">
        <BotaoVoltar />
        <h2 className="fw-bold mb-0">Seu Carrinho</h2>
      </div>

      {erro && <div className="alert alert-danger">{erro}</div>}

      {carrinho.length === 0 ? (
        <div className="text-center p-5 bg-light rounded">
          <h4 className="text-muted mb-3">Seu carrinho está vazio</h4>
        </div>
      ) : (
        <div className="row">
          {/* Lista de Itens */}
          <div className="col-md-8">
            <ul className="list-group mb-3 shadow-sm">
              {carrinho.map((item, index) => {
                const preco = parseFloat(item.preco || item.preco_unitario || 0);
                const imagemUrl = item.imagem_principal?.imagem_url || item.imagem;

                return (
                  <li key={index} className="list-group-item d-flex justify-content-between lh-sm p-3">
                    <div className="d-flex align-items-center gap-3">
                      {imagemUrl && (
                        <img
                          src={imagemUrl}
                          alt={item.nome_produto || item.nome}
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                        />
                      )}
                      <div>
                        <h6 className="my-0 fw-bold">{item.nome_produto || item.nome}</h6>
                        <small className="text-muted">Quantidade: {item.quantidade}</small>
                      </div>
                    </div>
                    <span className="text-muted fw-bold">
                      {(preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Resumo + Finalização */}
          <div className="col-md-4">
            <div className="card shadow-sm border-0 bg-light p-3">
              <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-primary">Resumo</span>
              </h4>

              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item d-flex justify-content-between bg-transparent px-0">
                  <span>Total (BRL)</span>
                  <strong className="fs-5">
                    {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </strong>
                </li>
              </ul>

              {/* Método de Pagamento */}
              <div className="mb-3">
                <label className="form-label fw-bold">Forma de pagamento</label>
                <select
                  className="form-select"
                  value={metodoPagamento}
                  onChange={(e) => setMetodoPagamento(e.target.value)}
                >
                  {METODOS_PAGAMENTO.map((m) => (
                    <option key={m.valor} value={m.valor}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Senha do Pedido */}
              <div className="mb-3">
                <label className="form-label fw-bold">Senha do pedido</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Mínimo 4 caracteres"
                  value={senhaPedido}
                  onChange={(e) => setSenhaPedido(e.target.value)}
                  minLength={4}
                />
                <div className="form-text">Usada para confirmar ações no pedido.</div>
              </div>

              <button
                onClick={handleFinalizarCompra}
                className="btn btn-success btn-lg w-100 fw-bold"
                disabled={finalizando}
              >
                {finalizando ? 'Processando...' : 'Finalizar Compra'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrinho;