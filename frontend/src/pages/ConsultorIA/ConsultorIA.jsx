import { useState } from 'react';
import { api } from '../../services/api.js';

function ConsultorIA() {
  const [mensagemAtual, setMensagemAtual] = useState(""); 
  const [historico, setHistorico] = useState([
    { autor: "bot", texto: "Olá, sou o seu consultor IA. Como posso ajudá-lo?" }
  ]);

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

  return (
    <main className="area-do-chat">
      <div className="historico-mensagens">
        {historico.map((msg, index) => (
          <div 
            key={index} 
            className={msg.autor === "bot" ? "mensagem-bot" : "mensagem-usuario"}
          >
            {msg.autor === "bot" && (
              <div className="avatar-bot">🤖</div>
            )}
            <div className={msg.autor === "bot" ? "balao-bot" : "balao-usuario"}>
              {msg.texto}
            </div>
          </div>
        ))}
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