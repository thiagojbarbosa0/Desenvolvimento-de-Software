import { useState, useEffect } from 'react';
import { api } from '../../services/api.js';

function ConsultorIA() {
  const [mensagemAtual, setMensagemAtual] = useState(""); 
  
  // Define uma chave única para este usuário
  const userId = localStorage.getItem("user_id");
  const CHAVE_STORAGE = userId ? `chat_historico_${userId}` : "chat_historico_visitante";

  // Inicializa o estado buscando no localStorage
  const [historico, setHistorico] = useState(() => {
    const salvo = localStorage.getItem(CHAVE_STORAGE);
    return salvo ? JSON.parse(salvo) : [
      { autor: "bot", texto: "Olá, sou o seu consultor IA. Como posso ajudá-lo?" }
    ];
  });

  // Salva no localStorage sempre que o histórico mudar
  useEffect(() => {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(historico));
  }, [historico, CHAVE_STORAGE]);

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
        user_id: userId,
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