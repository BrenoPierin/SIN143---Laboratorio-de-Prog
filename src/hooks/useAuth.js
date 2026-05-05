import { useState } from 'react';

export function useAuth() {
  const [usuarioLogado, setUsuarioLogado] = useState(false);

  // Função para entrar
  const fazerLogin = (email, senha) => {
    if (email !== '' && senha !== '') {
      console.log(`Usuário ${email} fez login!`);
      setUsuarioLogado(true);
    }
  };

  const fazerLogout = () => {
    setUsuarioLogado(false);
  };

  return { usuarioLogado, fazerLogin, fazerLogout };
}