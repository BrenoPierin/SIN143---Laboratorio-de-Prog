import { useState } from 'react';

function Login({ aoLogar }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleEntrar = (evento) => {
    evento.preventDefault();
    aoLogar(email, senha); 
  };

  return (
    // Usando o sistema de grid do Bootstrap para centralizar a tela
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          
          {/* Componente Card do Bootstrap para a caixa de login */}
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">Acesse sua conta</h2>
              
              <form onSubmit={handleEntrar}>
                {/* Campo de Email */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email"
                    placeholder="Digite seu email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                  />
                </div>

                {/* Campo de Senha */}
                <div className="mb-3">
                  <label htmlFor="senha" className="form-label">Senha</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="senha"
                    placeholder="Digite sua senha" 
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)} 
                    required
                  />
                </div>

                {/* Botão com 100% de largura */}
                <button type="submit" className="btn btn-primary w-100">
                  Entrar
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;