import React, { useEffect, useState } from 'react';
import { listarFeedbacks, criarFeedback } from './feedbackService';
import './App.css';

function App() {
  const [lista, setLista] = useState([]);
  const [form, setForm] = useState({ titulo: '', descricao: '', nota: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const dados = await listarFeedbacks();
        setLista(dados);
      } catch (e) {
        setError('Não foi possível carregar feedbacks');
      }
    })();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const novo = await criarFeedback(
        { titulo: form.titulo, descricao: form.descricao, nota: Number(form.nota) },
        'admin@curso.com'
      );
      setLista(l => [...l, novo]);
      setForm({ titulo: '', descricao: '', nota: '' });
    } catch (e) {
      setError('Falha ao enviar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Feedbacks</h1>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Título"
          value={form.titulo}
          onChange={e => setForm({ ...form, titulo: e.target.value })}
          required
        />
        <input
          placeholder="Descrição"
          value={form.descricao}
          onChange={e => setForm({ ...form, descricao: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Nota 0–10"
          value={form.nota}
          onChange={e => setForm({ ...form, nota: e.target.value })}
          required
          min="0"
          max="10"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Enviando…' : 'Enviar'}
        </button>
      </form>

      <ul>
        {lista.map(f => (
          <li key={f.id}>
            <strong>{f.titulo}</strong> ({f.nota})<br/>
            {f.descricao}<br/>
            <small>
              Por {f.nomeUsuario} &lt;{f.emailUsuario}&gt;
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
