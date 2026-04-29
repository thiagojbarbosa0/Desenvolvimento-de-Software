import { useState } from 'react';
import '../TelaPrincipal.css';
import MostrarLogo from '../assets/components.jsx';
import { useNavigate } from 'react-router-dom'; 

function TelaPrincipal(){
  const navigate = useNavigate();
  const paginaAtiva = "Consultor IA";

  const menus = [
    { nome: "Meu perfil", icone: "👤", rota: "/perfil" },
    { nome: "Dashboard", icone: "🏠", rota: "/dashboard" },
    { nome: "Comunidade", icone: "💬", rota: "/comunidade" },
    { nome: "Minha dieta", icone: "🍲", rota: "/dieta" },
    { nome: "Consultor IA", icone: "🤖", rota: "/ia" },
  ];

  // ==========================================
  // ESTADOS DO CHAT (A MÁGICA DA PARTE 1)
  // ==========================================
  
  // Guarda o que o usuário está digitando no momento
  const [mensagemAtual, setMensagemAtual] = useState(""); 
  
  // Guarda o histórico completo da conversa
  const [historico, setHistorico] = useState([
    { autor: "bot", texto: "Olá, sou o seu consultor IA. Como posso ajudá-lo?" }
  ]);

  // Função disparada ao clicar no botão Enviar
  const enviarMensagem = () => {
    // Evita enviar mensagem vazia ou só com espaços
    if (mensagemAtual.trim() === "") return; 

    // Cria o objeto da nova mensagem
    const novaMensagemUser = { autor: "usuario", texto: mensagemAtual };
    
    // Atualiza o histórico: pega tudo que já tinha (...historico) e adiciona a nova
    setHistorico([...historico, novaMensagemUser]);
    
    // Limpa o campo de digitação
    setMensagemAtual("");
  };

  return (
    <div className='limitador_tags'>
      
      <header className="topo-logo">
          <MostrarLogo/>
          <div className='caixa_cabecalho'>
            <h1>Consultor IA - Tire suas dúvidas sobre nutrição e saúde</h1>
          </div>   
      </header>
      
      <div className='corpo-layout'>
          <aside className="barra_lateral">
            <nav>
              <ul>
                {menus.map((item) => (
                  <li 
                    key={item.nome} 
                    className={item.nome === paginaAtiva ? "ativo" : ""}
                    onClick={() => navigate(item.rota)}>
                    <span className="icone">{item.icone}</span>
                    <span className="texto">{item.nome}</span>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

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
                  value={mensagemAtual} /* Conecta a caixa de texto ao estado */
                  onChange={(e) => setMensagemAtual(e.target.value)} /* Atualiza o estado ao digitar */
                  onKeyDown={(e) => {
                    // Permite enviar apertando o Enter também (opcional, mas legal!)
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        enviarMensagem();
                    }
                  }}
                />                                         
                <button className="botao-enviar" onClick={enviarMensagem}>Enviar</button>
              </div>

          </main>

      </div>
    </div>
  );
}

export default TelaPrincipal;