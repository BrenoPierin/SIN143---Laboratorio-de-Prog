import Login from './components/login';
import { useState } from 'react';
import Dashboard from './components/inicio';
import { useAuth } from './hooks/useAuth';
import { Routes, Route } from 'react-router-dom';
import DetalheProduto from './components/DetalheProduto';
import Ofertas from './components/Ofertas';
import Carrinho from './components/Carrinho';

function App() {
  const { usuarioLogado, fazerLogin, fazerLogout } = useAuth();
  
  const [carrinho, setCarrinho] = useState([]);

  const adicionarAoCarrinho = (produto) => {
    const itemExistente = carrinho.find((item) => item.id === produto.id);
    
    if (itemExistente) {
      setCarrinho(carrinho.map((item) => 
        item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
      ));
    } else {
      setCarrinho([...carrinho, { ...produto, quantidade: 1 }]);
    }
    alert(`${produto.nome} foi adicionado ao carrinho!`);
  };

  if (!usuarioLogado) {
    return <Login aoLogar={fazerLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard aoSair={fazerLogout} qtdCarrinho={carrinho.length} />} />
      <Route path="/ofertas" element={<Ofertas />} />
      <Route path="/produto/:id" element={<DetalheProduto adicionarAoCarrinho={adicionarAoCarrinho} />} />
      <Route path="/carrinho" element={<Carrinho carrinho={carrinho} setCarrinho={setCarrinho} />} />
    </Routes>
  );
}

export default App;