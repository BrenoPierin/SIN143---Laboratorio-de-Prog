import { useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getAccessToken, getClienteMe } from './API';


// Decodifica o payload do JWT sem biblioteca externa
function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch {
    return null;
  }
}

function clienteDoToken(token) {
  if (!token) return null;
  const payload = decodeJwt(token);
  if (!payload) return null;
  return {
    id: payload.cliente_id,
    nome: payload.nome || payload.username,
    email: payload.email,
    role: payload.role,
    username: payload.username,
  };
}

export function useAuth() {
  const token = getAccessToken();
  const [usuarioLogado, setUsuarioLogado] = useState(!!token);
  const [cliente, setCliente] = useState(clienteDoToken(token));
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [erroLogin, setErroLogin] = useState('');

  const fazerLogin = async (username, senha) => {
    setErroLogin('');
    setLoadingAuth(true);
    try {
      const data = await apiLogin(username, senha);
      const perfil = clienteDoToken(data.access);
      setCliente(perfil);
      setUsuarioLogado(true);
    } catch (err) {
      setErroLogin(err.message || 'Credenciais inválidas.');
    } finally {
      setLoadingAuth(false);
    }
  };

  const fazerLogout = async () => {
    await apiLogout();
    setCliente(null);
    setUsuarioLogado(false);
  };

  return { usuarioLogado, cliente, fazerLogin, fazerLogout, loadingAuth, erroLogin };
}