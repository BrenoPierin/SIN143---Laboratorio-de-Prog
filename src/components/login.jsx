import { useState } from 'react';

function Login({ aoLogar, loading, erro }) {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');

  const handleEntrar = (evento) => {
    evento.preventDefault();
    aoLogar(username, senha);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="text-center mb-4">Acesse sua conta</h2>

              {erro && (
                <div className="alert alert-danger py-2" role="alert">
                  {erro}
                </div>
              )}

              <form onSubmit={handleEntrar}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Usuário</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="Digite seu usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

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

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
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