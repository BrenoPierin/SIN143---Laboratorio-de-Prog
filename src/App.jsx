import Login from './components/login';
import { useState } from 'react';
import Dashboard from './components/inicio';
import AdminDashboard from './components/AdminDashboard';
import { useAuth } from './hooks/useAuth';
import { Routes, Route } from 'react-router-dom';
import DetalheProduto from './components/DetalheProduto';
import Ofertas from './components/Ofertas';
import Carrinho from './components/Carrinho';

function App() {
  const { usuarioLogado, cliente, fazerLogin, fazerLogout, loadingAuth, erroLogin } = useAuth();
  
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
    alert(`${produto.nome_produto || produto.nome} foi adicionado ao carrinho!`);
  };

  if (!usuarioLogado) {
    return <Login aoLogar={fazerLogin} loading={loadingAuth} erro={erroLogin} />;
  }

  const isAdmin = cliente?.role === 'admin' || cliente?.role === 'estoque';

  

  return (
    <Routes>
      <Route path="/" element={<Dashboard aoSair={fazerLogout} qtdCarrinho={carrinho.length} cliente={cliente} />} />
      <Route path="/ofertas" element={<Ofertas />} />
      <Route path="/produto/:id" element={<DetalheProduto adicionarAoCarrinho={adicionarAoCarrinho} />} />
      {isAdmin && (
        <Route path="/admin" element={<AdminDashboard aoSair={fazerLogout} cliente={cliente} />} />
      )}
      <Route path="/carrinho" element={<Carrinho carrinho={carrinho} setCarrinho={setCarrinho} cliente={cliente} />} />
    </Routes>
  );

}

export default App;