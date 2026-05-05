import React from 'react';
import { useParams, Link } from 'react-router-dom';
import BotaoVoltar from './BotaoVoltar';


function DetalheProduto({ adicionarAoCarrinho }) {
    const { id } = useParams();
  const produto = {
    id: Number(id) || 1,
    nome: "Notebook Gamer RTX 4060",
    preco: 7500,
    parcelamento: "Em até 10x de R$ 750,00 sem juros",
    descricao: "Domine seus jogos com o novo notebook gamer equipado com placa de vídeo RTX de última geração, tela de 144Hz e resfriamento avançado.",
    imagem: "https://placehold.co/600x400/212529/FFFFFF?text=Notebook+Gamer",
    estoque: true
  };

  return (
    <div className="container mt-5 mb-5">
      {/* Sistema de Grid do Bootstrap: Divide a tela em 2 colunas no PC */}
      <div className="row">
        
        {/* Coluna da Esquerda: Galeria de Imagens */}
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm">
            <img src={produto.imagem} alt={produto.nome} className="img-fluid rounded" />
          </div>
          {/* Aqui você poderia adicionar miniaturas (thumbnails) no futuro */}
        </div>

        {/* Coluna da Direita: Informações e Compra */}
        <div className="col-md-6 d-flex flex-column justify-content-center">
          <span className="text-muted mb-2">Categoria: Informática &gt; Notebooks</span>
          <BotaoVoltar />
          <h1 className="fw-bold mb-3">{produto.nome}</h1>
          
          {/* Formatando o preço na hora de exibir */}
          <h2 className="text-success fw-bold display-6 mb-1">
            {produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </h2>
          <p className="text-muted mb-4">{produto.parcelamento}</p>

          <div className="p-4 bg-light rounded-3 shadow-sm border">
            {/* 3. Coloque o onClick no botão chamando a função */}
            <button 
              onClick={() => adicionarAoCarrinho(produto)} 
              className="btn btn-primary btn-lg w-100 fw-bold text-uppercase mt-3"
            >
              🛒 Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>

      {/* Linha Divisória */}
      <hr className="my-5" />

      {/* Área de Especificações Técnicas (Abaixo da dobra) */}
      <div className="row">
        <div className="col-12">
          <h3 className="fw-bold mb-3">Especificações Técnicas</h3>
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><strong>Processador:</strong> Intel Core i7 13ª Geração</li>
            <li className="list-group-item"><strong>Memória RAM:</strong> 16GB DDR5 4800MHz</li>
            <li className="list-group-item"><strong>Armazenamento:</strong> 1TB SSD NVMe M.2</li>
            <li className="list-group-item"><strong>Placa de Vídeo:</strong> NVIDIA GeForce RTX 4060 8GB</li>
          </ul>
        </div>
      </div>

    </div>
  );
}

export default DetalheProduto;