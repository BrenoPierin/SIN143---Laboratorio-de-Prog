import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard({ aoSair, qtdCarrinho }) {
  const produtos = [
    { 
      id: 1, 
      nome: "Notebook Gamer RTX 4060", 
      preco: "R$ 7.500,00", 
      imagem: "https://placehold.co/400x300/212529/FFFFFF?text=Notebook" 
    },
    { 
      id: 2, 
      nome: "Smartphone Galaxy Ultra", 
      preco: "R$ 5.200,00", 
      imagem: "https://placehold.co/400x300/212529/FFFFFF?text=Smartphone" 
    },
    { 
      id: 3, 
      nome: "Monitor Ultrawide 34\"", 
      preco: "R$ 2.300,00", 
      imagem: "https://placehold.co/400x300/212529/FFFFFF?text=Monitor" 
    },
    { 
      id: 4, 
      nome: "Teclado Mecânico Wireless", 
      preco: "R$ 450,00", 
      imagem: "https://placehold.co/400x300/212529/FFFFFF?text=Teclado" 
    },
    { 
      id: 5, 
      nome: "Mouse Gamer 16000 DPI", 
      preco: "R$ 280,00", 
      imagem: "https://placehold.co/400x300/212529/FFFFFF?text=Mouse" 
    },
    { 
      id: 6, 
      nome: "Headset Bluetooth com ANC", 
      preco: "R$ 600,00", 
      imagem: "https://placehold.co/400x300/212529/FFFFFF?text=Headset" 
    }
  ];

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
              
              <li className="nav-item"><a className="nav-link" href="#">Categorias</a></li>
            </ul>
            <div className="d-flex align-items-center gap-3">
              <Link to="/carrinho" className="text-white text-decoration-none fw-bold">
                🛒 Carrinho <span className="badge bg-danger rounded-pill">{qtdCarrinho}</span>
              </Link>
              <button className="btn btn-outline-danger btn-sm" onClick={aoSair}>Sair</button>
            </div>
          </div>
        </div>
      </nav>

      {/* Área Principal - Vitrine de Produtos */}
      <div className="container">
        {/* Banner de Destaque */}
        <div className="p-5 mb-4 bg-primary text-white rounded-3 shadow-sm">
          <div className="container-fluid py-2">
            <h1 className="display-5 fw-bold">Semana da Tecnologia</h1>
            <p className="col-md-8 fs-5">Aproveite as melhores ofertas em notebooks, smartphones e periféricos. Descontos de até 30% em toda a loja!</p>
            <Link to="/ofertas" className="btn btn-light btn-lg fw-bold" type="button">Ver Ofertas</Link>
          </div>
        </div>

        <h3 className="mb-4 fw-bold text-secondary">Lançamentos</h3>

        {/* Grid de Produtos gerado dinamicamente com o map() */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {produtos.map((produto) => (
            <div className="col" key={produto.id}>
              <div className="card h-100 shadow-sm border-0">
                {/* Imagem Placeholder */}
                <img src={produto.imagem} className="card-img-top" alt={produto.nome} />
                
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold">{produto.nome}</h5>
                  <p className="card-text text-success fs-4 fw-bold mb-3">{produto.preco}</p>
                  
                  <Link to={`/produto/${produto.id}`} className="btn btn-primary mt-auto w-100 fw-bold">
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

export default Dashboard;