import './Comunidade.css';
import { useState, useEffect } from 'react';

function Comunidade() {
  const [abaAtiva, setAbaAtiva] = useState('Para você');
  const [posts, setPosts] = useState([]);
  const [novoPostTexto, setNovoPostTexto] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [postComentariosAberto, setPostComentariosAberto] = useState(null);
  const [novoComentarioTexto, setNovoComentarioTexto] = useState('');

  const abas = ['Meus posts', 'Para você', 'Seguindo'];
  const userIdLogado = localStorage.getItem('user_id') || "3dd494b3-b35b-47ce-9bfe-c359e3fc2650";

  // Função única e centralizada para carregar posts
  const carregarPosts = async () => {
    try {
      setCarregando(true);
      const url = `http://0.0.0.0:8000/api/v1/posts?filtro=${encodeURIComponent(abaAtiva)}&user_id=${userIdLogado}`;
      const response = await fetch(url);
      if (response.ok) {
        const dados = await response.json();
        setPosts(dados);
      }
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    } finally {
      setCarregando(false);
    }
  };

  // useEffect único monitorando a aba ativa
  useEffect(() => {
    carregarPosts();
  }, [abaAtiva]);

  const lidarComEnvioPost = async (e) => {
    e.preventDefault();
    if (!novoPostTexto.trim()) return;

    try {
      const response = await fetch('http://0.0.0.0:8000/api/v1/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userIdLogado, conteudo: novoPostTexto }),
      });
      if (response.ok) {
        setNovoPostTexto('');
        carregarPosts();
      }
    } catch (error) {
      console.error("Erro ao enviar post:", error);
    }
  };

  const lidarComLike = async (postId) => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;

    try {
      const response = await fetch(`http://0.0.0.0:8000/api/v1/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      if (response.ok) {
        const dados = await response.json();
        setPosts(posts.map(p => p.id === postId ? { ...p, likes: dados.likes } : p));
      }
    } catch (error) {
      console.error("Erro ao dar like:", error);
    }
  };

  const lidarComEnvioComentario = async (e, postId) => {
    e.preventDefault();
    if (!novoComentarioTexto.trim()) return;

    try {
      const response = await fetch(`http://0.0.0.0:8000/api/v1/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userIdLogado, comentario: novoComentarioTexto }),
      });

      if (response.ok) {
        const dados = await response.json();
        setPosts(posts.map(p => p.id === postId ? { ...p, comentarios: dados.comentarios } : p));
        setNovoComentarioTexto('');
      }
    } catch (error) {
      console.error("Erro ao comentar:", error);
    }
  };

  const alternarCaixaComentarios = (postId) => {
    setPostComentariosAberto(postComentariosAberto === postId ? null : postId);
    setNovoComentarioTexto('');
  };

  return (
    <div className="comunidade-container">
      <div className="comunidade-criar-post">
        <form onSubmit={lidarComEnvioPost}>
          <textarea
            placeholder="Compartilhe sua experiência de hoje com a dieta..."
            value={novoPostTexto}
            onChange={(e) => setNovoPostTexto(e.target.value)}
            rows="3"
            className="comunidade-input-texto"
          />
          <div className="comunidade-form-acoes">
            <button type="submit" className="comunidade-botao-postar">Publicar Post</button>
          </div>
        </form>
      </div>

      <div className="comunidade-feed">
        {carregando ? (
          <div className="comunidade-aviso">Carregando postagens...</div>
        ) : posts.length === 0 ? (
          <div className="comunidade-aviso">Nenhuma postagem encontrada.</div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="comunidade-post-wrapper">
              <div className="comunidade-post">
                <div className="comunidade-post-header">
                  <div className="comunidade-post-avatar">
                    {post.autor_name ? post.autor_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="comunidade-post-info">
                    <span className="comunidade-post-autor">{post.autor_name}</span>
                    <span className="comunidade-post-tag">{post.autor_tag}</span>
                  </div>
                </div>
                <p className="comunidade-post-texto">{post.conteudo}</p>
                <div className="comunidade-post-acoes">
                  <button onClick={() => lidarComLike(post.id)} className="comunidade-btn-acao acao-like">
                    ❤️ <span>{post.likes}</span>
                  </button>
                  <button onClick={() => alternarCaixaComentarios(post.id)} className="comunidade-btn-acao acao-comment">
                    💬 <span>{post.comentarios ? post.comentarios.length : 0}</span>
                  </button>
                </div>
              </div>

              {postComentariosAberto === post.id && (
                <div className="comunidade-secao-comentarios">
                  <div className="comunidade-lista-comentarios">
                    {post.comentarios && post.comentarios.map((comat) => (
                      <div key={comat.id} className="comunidade-item-comentario">
                        <span className="comunidade-comentario-autor">{comat.autor_name}:</span>
                        <span className="comunidade-comentario-texto">{comat.conteudo}</span>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={(e) => lidarComEnvioComentario(e, post.id)} className="comunidade-form-comentario">
                    <input
                      type="text"
                      placeholder="Escreva um comentário..."
                      value={novoComentarioTexto}
                      onChange={(e) => setNovoComentarioTexto(e.target.value)}
                      className="comunidade-input-comentario"
                    />
                    <button type="submit" className="comunidade-btn-enviar-comentario">Enviar</button>
                  </form>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <footer className="comunidade-footer">
        {abas.map((aba) => (
          <button
            key={aba}
            className={`comunidade-aba ${abaAtiva === aba ? 'ativa' : ''}`}
            onClick={() => setAbaAtiva(aba)}
          >
            {aba}
          </button>
        ))}
      </footer>
    </div>
  );
}

export default Comunidade;