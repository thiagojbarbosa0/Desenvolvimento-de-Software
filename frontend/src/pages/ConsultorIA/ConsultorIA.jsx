import { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api.js';
import './ConsultorIA.css';

function ConsultorIA() {
  const [mensagemAtual, setMensagemAtual] = useState(""); 
  const [historico, setHistorico] = useState([
    { autor: "bot", texto: "Olá, sou o seu consultor IA. Como posso ajudá-lo?" }
  ]);
  
  const fimDoChatRef = useRef(null);

  useEffect(() => {
  if (historico.length > 1) {
    fimDoChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
}, [historico]);

  const enviarMensagem = async () => {
    const textoParaEnviar = mensagemAtual.trim();
    if (textoParaEnviar === "") return;

    const novaMensagemUser = { autor: "usuario", texto: textoParaEnviar };
    setHistorico(prev => [...prev, novaMensagemUser]);
    setMensagemAtual("");

    setHistorico(prev => [...prev, { autor: "bot", texto: "..." }]);

    try {
      const { data } = await api.post("/chat", {
        mensagem: textoParaEnviar,
        user_id: localStorage.getItem("user_id"),
      });
      
      setHistorico(prev => [
        ...prev.slice(0, -1),
        { autor: "bot", texto: data.resposta }
      ]);
    } catch (err) {
      setHistorico(prev => [
        ...prev.slice(0, -1),
        { autor: "bot", texto: "Erro ao conectar com o servidor. Tente novamente." }
      ]);
    }
  };

  // Interpretador nativo de Markdown corrigido e otimizado
  const renderizarMarkdown = (texto) => {
    if (texto === "...") {
      return (
        <div className="digitando">
          <span></span>
          <span></span>
          <span></span>
        </div>
      );
    }

    const linhas = texto.split('\n');
    return linhas.map((linha, index) => {
      const linhaLimpa = linha.trim();

      // 1. Títulos (Markdown: # , ## , ### )
      if (linhaLimpa.startsWith('### ')) {
        return <h4 key={index}>{processarEstilosInline(linhaLimpa.replace('### ', ''))}</h4>;
      }
      if (linhaLimpa.startsWith('## ')) {
        return <h3 key={index}>{processarEstilosInline(linhaLimpa.replace('## ', ''))}</h3>;
      }
      if (linhaLimpa.startsWith('# ')) {
        return <h2 key={index}>{processarEstilosInline(linhaLimpa.replace('# ', ''))}</h2>;
      }

      // 2. Elementos de Lista (Markdown: - ou *)
      if (linhaLimpa.startsWith('- ') || linhaLimpa.startsWith('* ')) {
        return <li key={index} className="markdown-li">{processarEstilosInline(linhaLimpa.substring(2))}</li>;
      }

      // 3. Linhas em branco vazias vindas da IA
      if (linhaLimpa === '') {
        return <div key={index} className="markdown-espaco" />;
      }

      // 4. Parágrafos comuns de texto
      return <p key={index}>{processarEstilosInline(linha)}</p>;
    });
  };

  // Renderiza negritos (**) e blocos de código (`) dentro de qualquer linha
  const processarEstilosInline = (textoLinha) => {
    const partes = textoLinha.split(/(\*\*.*?\*\*|`.*?`)/g);
    return partes.map((parte, idx) => {
      if (parte.startsWith('**') && parte.endsWith('**')) {
        return <strong key={idx}>{parte.slice(2, -2)}</strong>;
      }
      if (parte.startsWith('`') && parte.endsWith('`')) {
        return <code key={idx}>{parte.slice(1, -1)}</code>;
      }
      return parte;
    });
  };

  return (
    <main className="area-do-chat">
      <div className="historico-mensagens">
        {historico.map((msg, index) => (
          <div 
            key={index} 
            className={`mensagem-linha ${msg.autor === "bot" ? "bot" : "usuario"}`}
          >
            <div className="mensagem-conteudo">
              {msg.autor === "bot" && (
                <div className="avatar-bot">🤖</div>
              )}
              <div className={`balao-chat ${msg.autor === "bot" ? "balao-bot" : "balao-usuario"}`}>
                {renderizarMarkdown(msg.texto)}
              </div>
            </div>
          </div>
        ))}
        <div ref={fimDoChatRef} />
      </div>
      
      <div className="caixa-de-mensagem">
        <textarea 
          className="campo-digitacao" 
          placeholder="Digite sua mensagem..." 
          rows="1"
          value={mensagemAtual}
          onChange={(e) => setMensagemAtual(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              enviarMensagem();
            }
          }}
        />                                         
        <button className="botao-enviar" onClick={enviarMensagem}>Enviar</button>
      </div>
    </main>
  );
}

export default ConsultorIA;