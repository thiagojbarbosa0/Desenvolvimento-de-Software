import { useState } from 'react';
import { api } from '../services/api.js';

function ConsultorIA() {
  // Guarda o que o usuário está digitando no momento
  const [mensagemAtual, setMensagemAtual] = useState(""); 
  
  // Guarda o histórico completo da conversa
  const [historico, setHistorico] = useState([
    { autor: "bot", texto: "Olá, sou o seu consultor IA. Como posso ajudá-lo?" }
  ]);

  // Função disparada ao clicar no botão Enviar ou apertar Enter
  const enviarMensagem = async () => {
    if (mensagemAtual.trim() === "") return;

    const novaMensagemUser = { autor: "usuario", texto: mensajeAtual };
    setHistorico(prev => [...prev, novaMensagemUser]);
    setMensagemAtual("");

    setHistorico(prev => [...prev, { autor: "bot", texto: "..." }]);

    try {
      const { data } = await api.post("/chat", {
        mensagem: mensagemAtual,
        user_id: localStorage.getItem("user_id"),
      });

      console.log("Resposta da API:", data);
      
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
        {/* FAZ UM LOOP NO HISTÓRICO PARA RENDERIZAR CADA BALÃO */}
        {historico.map((msg, index) => (
          <div 
            key={index} 
            className={msg.autor === "bot" ? "mensagem-bot" : "mensagem-usuario"}
          >
            {/* Se for bot, mostra o avatar */}
            {msg.autor === "bot" && (
              <div className="avatar-bot">🤖</div>
            )}
            
            {/* O balão de texto em si */}
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