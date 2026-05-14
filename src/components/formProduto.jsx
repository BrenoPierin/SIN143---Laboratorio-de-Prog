import React, { useState, useEffect } from 'react';
import { criarProduto, atualizarProduto, uploadImagemProduto } from '../hooks/API';

function FormProduto({ produto, categorias, aoSalvar, aoFechar }) {
  const editando = !!produto;

  const [form, setForm] = useState({
    nome_produto: produto?.nome_produto || '',
    preco: produto?.preco || '',
    estoque: produto?.estoque ?? '',
    categoria: produto?.categoria || '',
  });
  const [imagem, setImagem] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSalvando(true);

    try {
      let produtoSalvo;

      if (editando) {
        produtoSalvo = await atualizarProduto(produto.id, {
          ...form,
          preco: String(form.preco),
          estoque: Number(form.estoque),
          categoria: Number(form.categoria),
        });
      } else {
        produtoSalvo = await criarProduto({
          ...form,
          preco: String(form.preco),
          estoque: Number(form.estoque),
          categoria: Number(form.categoria),
        });
      }

      // Upload da imagem se selecionada
      if (imagem) {
        const formData = new FormData();
        formData.append('imagem', imagem);
        formData.append('principal', 'true');
        formData.append('alt', form.nome_produto);
        await uploadImagemProduto(produtoSalvo.id, formData);
      }

      aoSalvar();
    } catch (err) {
      const msg =
        typeof err === 'string'
          ? err
          : Object.entries(err)
              .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
              .join(' | ');
      setErro(msg || 'Erro ao salvar produto.');
    } finally {
      setSalvando(false);
    }
  };

  return (
    // Overlay escuro
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) aoFechar(); }}
    >
      <div className="card shadow-lg border-0" style={{ width: '100%', maxWidth: 520 }}>
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{editando ? '✏️ Editar Produto' : '➕ Novo Produto'}</h5>
          <button className="btn-close btn-close-white" onClick={aoFechar} />
        </div>

        <div className="card-body">
          {erro && <div className="alert alert-danger py-2 small">{erro}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">Nome do produto *</label>
              <input
                type="text"
                name="nome_produto"
                className="form-control"
                value={form.nome_produto}
                onChange={handleChange}
                maxLength={50}
                required
              />
            </div>

            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label fw-bold">Preço (R$) *</label>
                <input
                  type="number"
                  name="preco"
                  className="form-control"
                  value={form.preco}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="col-6">
                <label className="form-label fw-bold">Estoque *</label>
                <input
                  type="number"
                  name="estoque"
                  className="form-control"
                  value={form.estoque}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Categoria *</label>
              <select
                name="categoria"
                className="form-select"
                value={form.categoria}
                onChange={handleChange}
                required
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">
                Imagem do produto {editando ? '(deixe em branco para manter)' : ''}
              </label>
              <input
                type="file"
                className="form-control"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setImagem(e.target.files[0] || null)}
              />
              <div className="form-text">JPG, PNG ou WEBP — máx. 5 MB</div>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-outline-secondary" onClick={aoFechar}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary fw-bold" disabled={salvando}>
                {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Criar produto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormProduto;