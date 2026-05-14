const BASE_URL = 'https://dashier-brynn-electrotechnic.ngrok-free.dev/api';

// ─── Token helpers ──────────────────────────────────────────────────────────

export function getAccessToken() {
  return localStorage.getItem('access_token');
}

export function getRefreshToken() {
  return localStorage.getItem('refresh_token');
}

function saveTokens(access, refresh) {
  localStorage.setItem('access_token', access);
  if (refresh) localStorage.setItem('refresh_token', refresh);
}

export function clearTokens() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

// ─── Core fetch com refresh automático ──────────────────────────────────────

async function apiFetch(path, options = {}) {
  const token = getAccessToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  // Tenta renovar o token se expirou (401)
  if (response.status === 401) {
    const refresh = getRefreshToken();
    if (refresh) {
      const refreshResp = await fetch(`${BASE_URL}/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });

      if (refreshResp.ok) {
        const data = await refreshResp.json();
        saveTokens(data.access, null);
        headers.Authorization = `Bearer ${data.access}`;
        response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
      } else {
        clearTokens();
        throw new Error('Sessão expirada. Por favor, faça login novamente.');
      }
    }
  }

  return response;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function login(username, password) {
  const resp = await fetch(`${BASE_URL}/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.detail || 'Credenciais inválidas.');
  }

  const data = await resp.json();
  saveTokens(data.access, data.refresh);
  return data;
}

export async function logout() {
  const refresh = getRefreshToken();
  if (refresh) {
    await apiFetch('/auth/logout/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    }).catch(() => {});
  }
  clearTokens();
}

export async function registro(payload) {
  const resp = await fetch(`${BASE_URL}/auth/registro/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw err;
  }
  return resp.json();
}

// ─── Produtos ────────────────────────────────────────────────────────────────

export async function getProdutos(params = '') {
  const resp = await apiFetch(`/produtos/${params}`);
  if (!resp.ok) throw new Error('Erro ao buscar produtos.');
  const data = await resp.json();
  // A API pode retornar paginado { count, results } ou array direto
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function getProduto(id) {
  const resp = await apiFetch(`/produtos/${id}/`);
  if (!resp.ok) throw new Error('Produto não encontrado.');
  return resp.json();
}

// ─── Categorias ──────────────────────────────────────────────────────────────

export async function getCategorias() {
  const resp = await apiFetch('/categorias/');
  if (!resp.ok) throw new Error('Erro ao buscar categorias.');
  const data = await resp.json();
  return Array.isArray(data) ? data : (data.results ?? []);
}

export async function getProdutosPorCategoria(id) {
  const resp = await apiFetch(`/categorias/${id}/produtos/`);
  if (!resp.ok) throw new Error('Erro ao buscar produtos da categoria.');
  return resp.json();
}

// ─── Pedidos ─────────────────────────────────────────────────────────────────

export async function criarPedido(payload) {
  const resp = await apiFetch('/pedidos/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw err;
  }
  return resp.json();
}

export async function getPedidos() {
  const resp = await apiFetch('/pedidos/');
  if (!resp.ok) throw new Error('Erro ao buscar pedidos.');
  return resp.json();
}

// ─── Clientes ────────────────────────────────────────────────────────────────

export async function getClienteMe() {
  const resp = await apiFetch('/clientes/me/');
  if (!resp.ok) throw new Error('Erro ao buscar perfil.');
  return resp.json();
}

// ─── Pagamentos ──────────────────────────────────────────────────────────────

export async function criarPagamento(metodo, valor) {
  const resp = await apiFetch('/pagamentos/', {
    method: 'POST',
    body: JSON.stringify({ metodo, valor: String(valor) }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw err;
  }
  return resp.json();
}

// ─── Avaliações ──────────────────────────────────────────────────────────────

export async function getAvaliacoesProduto(produtoId) {
  const resp = await apiFetch(`/produtos/${produtoId}/avaliacoes/`);
  if (!resp.ok) throw new Error('Erro ao buscar avaliações.');
  return resp.json();
}

export async function criarAvaliacao(payload) {
  const resp = await apiFetch('/avaliacoes/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw err;
  }
  return resp.json();
}
