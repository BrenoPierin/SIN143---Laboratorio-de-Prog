import React from 'react';
import { Link } from 'react-router-dom';

function Ofertas() {
  const produtosEmOferta = [
    { 
      id: 4, 
      nome: "Teclado Mecânico Wireless", 
      precoAntigo: "R$ 600,00",
      precoNovo: "R$ 450,00",
      desconto: "25%",
      imagem: "https://placehold.co/400x300/dc3545/FFFFFF?text=Teclado" 
    },
    { 
      id: 5, 
      nome: "Mouse Gamer 16000 DPI", 
      precoAntigo: "R$ 400,00",
      precoNovo: "R$ 280,00",
      desconto: "30%",
      imagem: "https://placehold.co/400x300/dc3545/FFFFFF?text=Mouse" 
    }
  ];

  return (
    <div className="bg-light min-vh-100 pb-5">
      
      {/* Navbar Simplificada com Botão de Voltar */}
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
          <p className="fs-5">As melhores oportunidades com tempo limitado!</p>
        </div>

        {/* Grid de Produtos em Oferta */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {produtosEmOferta.map((produto) => (
            <div className="col" key={produto.id}>
              <div className="card h-100 shadow border-danger">
                {/* Badge de Desconto posicionado sobre a imagem */}
                <div className="position-absolute top-0 end-0 p-2">
                  <span className="badge bg-danger fs-6">-{produto.desconto}</span>
                </div>
                
                <img src={produto.imagem} className="card-img-top" alt={produto.nome} />
                
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{produto.nome}</h5>
                  <div className="mb-3">
                    <span className="text-decoration-line-through text-muted me-2">{produto.precoAntigo}</span>
                    <span className="text-danger fs-4 fw-bold">{produto.precoNovo}</span>
                  </div>
                  
                  <Link to={`/produto/${produto.id}`} className="btn btn-danger mt-auto w-100 fw-bold">
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Ofertas;