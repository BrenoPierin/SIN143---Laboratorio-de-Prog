import React from 'react';
import BotaoVoltar from './BotaoVoltar';
import { Link, useNavigate } from 'react-router-dom';

function Carrinho({ carrinho, setCarrinho }) {
  const navigate = useNavigate();

  // Função reduce do JavaScript para somar o valor total (preço * quantidade)
  const valorTotal = carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);

  const handleFinalizarCompra = () => {
    if (carrinho.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
    // Mock da chamada da API de compra
    console.log("Enviando pedido para a API...", carrinho);
    alert("Compra realizada com sucesso! Número do pedido: #8492");
    
    // Limpa o carrinho e manda de volta pra loja
    setCarrinho([]); 
    navigate('/');
  };

  return (
    <div className="container mt-5 mb-5">
        <div className="d-flex align-items-center mb-4 gap-3">
            <BotaoVoltar />
            <h2 className="fw-bold mb-0">Seu Carrinho</h2>
        </div>
      

      {carrinho.length === 0 ? (
        <div className="text-center p-5 bg-light rounded">
          <h4 className="text-muted mb-3">Seu carrinho está vazio</h4>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-8">
            {/* Lista de Itens */}
            <ul className="list-group mb-3 shadow-sm">
              {carrinho.map((item, index) => (
                <li key={index} className="list-group-item d-flex justify-content-between lh-sm p-3">
                  <div className="d-flex align-items-center gap-3">
                    <img src={item.imagem} alt={item.nome} style={{ width: '50px', borderRadius: '5px' }} />
                    <div>
                      <h6 className="my-0 fw-bold">{item.nome}</h6>
                      <small className="text-muted">Quantidade: {item.quantidade}</small>
                    </div>
                  </div>
                  <span className="text-muted fw-bold">
                    {/* Formatando o número para R$ */}
                    {(item.preco * item.quantidade).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-md-4">
            {/* Resumo da Compra */}
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
              <button onClick={handleFinalizarCompra} className="btn btn-success btn-lg w-100 fw-bold">
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carrinho;