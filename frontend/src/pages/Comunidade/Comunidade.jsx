import './Comunidade.css';
import { useState } from 'react';

function Comunidade() {
  const [abaAtiva, setAbaAtiva] = useState('Para você');

  const abas = ['Meus posts', 'Para você', 'Seguindo'];

  // Posts de exemplo - troque pelos dados reais da API depois
  const posts = [
    {
      id: 1,
      autor: 'Maria Silva',
      tempo: '2h',
      texto: 'Hoje completei minha primeira semana seguindo a dieta! Resultados já aparecendo 💪',
      curtidas: 12,
      comentarios: 3,
    },
    {
      id: 2,
      autor: 'John Wick',
      tempo: '5h',
      texto: 'Esta noite já consegui dormir melhor, acredito que a dieta tem influenciado muito principalmente a questão do jantar',
      curtidas: 8,
      comentarios: 5,
    },
  ];

  return (
    <div className="comunidade-container">
      <div className="comunidade-feed">
        {posts.map((post) => (
          <div key={post.id} className="comunidade-post">
            <div className="comunidade-post-header">
              <div className="comunidade-post-avatar">
                {post.autor.charAt(0).toUpperCase()}
              </div>
              <div className="comunidade-post-info">
                <span className="comunidade-post-autor">{post.autor}</span>
                <span className="comunidade-post-tempo">{post.tempo}</span>
              </div>
            </div>
            <p className="comunidade-post-texto">{post.texto}</p>
            <div className="comunidade-post-acoes">
              <span>❤️ {post.curtidas}</span>
              <span>💬 {post.comentarios}</span>
            </div>
          </div>
        ))}
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