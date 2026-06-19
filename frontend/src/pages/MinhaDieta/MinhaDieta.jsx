import { useState } from 'react';
import './MinhaDieta.css';

function MinhaDieta() {
  const [abaAtiva, setAbaAtiva] = useState('Hoje');
  const [diaSelecionado, setDiaSelecionado] = useState(null);

  const [refeicoes] = useState([
    { id: 1, tipo: 'Cafe', imagemEstatica: 'Café da Manhã estático.png', titulo: 'Iogurte natural com frutas e aveia', descricao: ['350ml de iogurte natural', '2x morangos', '6x uvas', '15g de aveia'], calorias: '340 kcal' },
    { id: 2, tipo: 'Almoco', imagemEstatica: 'Almoço estático.png', titulo: 'Frango grelhado + arroz integral + brócolis', descricao: ['250g de frango grelhado', '300g de arroz integral', '120g de brócolis', 'sal a gosto'], calorias: '512 kcal' },
    { id: 3, tipo: 'Lanche', imagemEstatica: 'Lanche estático.png', titulo: 'Banana com aveia', descricao: ['2x bananas fatiadas', '10g de aveia'], calorias: '110 kcal' },
    { id: 4, tipo: 'Jantar', imagemEstatica: 'Jantar estático.png', titulo: 'Sopa leve de legumes', descricao: ['100g de chuchu', '100g de cenoura', '80g de brócolis', '60g de cebola'], calorias: '280 kcal' },
    { id: 5, tipo: 'Ceia', imagemEstatica: 'Ceia estático.png', titulo: 'Chá de hortelã', descricao: ['200 ml de água', '2 folhas de hortelã'], calorias: '12 kcal' }
  ]);

  // 🌟 States para controlar a resposta, o loading e o modal
  const [receitaCompleta, setReceitaCompleta] = useState('');
  const [carregandoReceita, setCarregandoReceita] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const [tituloModal, setTituloModal] = useState('');

  // 🌟 States para o agendamento da refeição (controlados por card)
  const [agendamentos, setAgendamentos] = useState({});

  // 🌟 Função para atualizar as escolhas de dia/tipo de cada card
  const handleMudarAgendamento = (id, campo, valor) => {
    setAgendamentos(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor
      }
    }));
  };

  // 🌟 Nova função para tratar a batata quente do agendamento
  const handleAdicionarASemana = async (item) => {
    const escolha = agendamentos[item.id];
    const dia = escolha?.dia || 'Segunda';
    const tipo = escolha?.tipo || item.tipo;

    alert(`Batata quente pro Back-end:\nAdicionar "${item.titulo}" na tabela da semana!\nDia: ${dia}\nRefeição: ${tipo.toUpperCase()}`);
    
    // Futuramente aqui você fará o fetch enviando isso pro banco salvar:
    /*
    await fetch('http://localhost:3000/api/agenda-semana', {
       method: 'POST',
       body: JSON.stringify({ userId: 1, receitaId: item.id, dia, tipo })
    });
    */
  };

  // A função que passa a bola para o Back-end (Gemini)
  const handleBuscarReceita = async (idRefeicao, tituloPrato) => {
    setCarregandoReceita(true);
    setReceitaCompleta(''); 
    setTituloModal(tituloPrato);

    try {
      const response = await fetch('http://0.0.0.0:3000/api/receita-inteligente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1, 
          refeicaoId: idRefeicao,
          titulo: tituloPrato
        })
      });

      const dados = await response.json();

      if (dados.sucesso) {
        setReceitaCompleta(dados.receita); 
        setModalAberto(true); 
      } else {
        alert('Erro do servidor: ' + dados.erro);
      }

    } catch (error) {
      console.error("Erro ao conectar com o back-end:", error);
      alert("Não foi possível conectar ao servidor.");
    } finally {
      setCarregandoReceita(false); 
    }
  };

  return (
    <div className="dieta-container">
      <div className="dieta-abas-container">
        <button className={`dieta-aba ${abaAtiva === 'Refeições' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('Refeições')}>Refeições</button>
        <button className={`dieta-aba ${abaAtiva === 'Hoje' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('Hoje')}>Hoje</button>
        <button className={`dieta-aba ${abaAtiva === 'Esta semana' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('Esta semana')}>Esta semana</button>
      </div>
  
      {/* TELA HOJE */}
      {abaAtiva === 'Hoje' && (
        <div className="dieta-grid-refeicoes">
          {refeicoes.map((item) => {
            const ehDinamico = item.imagemEstatica.endsWith('dinâmico.png');
            return (
              <div key={item.id} className="dieta-card-misto">
                <img src={`/Images/${item.imagemEstatica}`} alt={item.titulo} className="dieta-card-bg" />
                {ehDinamico && (
                  <div className="dieta-card-overlay-conteudo">
                    <div className="dieta-dinamica-div">
                      {item.descricao.map((linha, index) => <p key={index}>{linha}</p>)}
                    </div>
                    <span className="dieta-dinamica-calorias">{item.calorias}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TELA REFEIÇÕES (Nova estrutura detalhada com Agendamento) */}
      {abaAtiva === 'Refeições' && (
        <div className="dieta-lista-refeicoes">
          {refeicoes.map((item) => {
            const escolhasAtuais = agendamentos[item.id] || { dia: 'Segunda', tipo: item.tipo };
            return (
              <div key={item.id} className="card-refeicao-detalhado">
                <img src={`/Images/${item.imagemEstatica}`} alt={item.titulo} />
                <div className="conteudo-card" style={{ flex: 1 }}>
                  <h3>{item.titulo}</h3>
                  <div className="tags-nutri"><span>{item.calorias}</span></div>
                  <h4>Ingredientes</h4>
                  <p>{item.descricao.join(', ')}</p>
                  
                  {/* 🌟 NOVO bloco de seletores para o agendamento */}
                  <div className="dieta-agendador-container" style={{ display: 'flex', gap: '10px', marginTop: '16px', alignItems: 'center' }}>
                    <select 
                      value={escolhasAtuais.dia} 
                      onChange={(e) => handleMudarAgendamento(item.id, 'dia', e.target.value)}
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e3e8e4', background: '#fff', fontSize: '13px', color: '#4a554e' }}
                    >
                      {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>

                    <select 
                      value={escolhasAtuais.tipo} 
                      onChange={(e) => handleMudarAgendamento(item.id, 'tipo', e.target.value)}
                      style={{ padding: '8px', borderRadius: '8px', border: '1px solid #e3e8e4', background: '#fff', fontSize: '13px', color: '#4a554e' }}
                    >
                      <option value="Cafe">Café</option>
                      <option value="Almoco">Almoço</option>
                      <option value="Lanche">Lanche</option>
                      <option value="Jantar">Jantar</option>
                      <option value="Ceia">Ceia</option>
                    </select>

                    <button 
                      className="btn-adicionar-semana"
                      onClick={() => handleAdicionarASemana(item)}
                      style={{ background: '#2c4232', color: 'white', border: 'none', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                    >
                      + ADICIONAR À SEMANA
                    </button>
                  </div>

                  <button 
                    className="btn-busca" 
                    disabled={carregandoReceita}
                    onClick={() => handleBuscarReceita(item.id, item.titulo)}
                    style={{ width: '100%' }}
                  >
                    {carregandoReceita && tituloModal === item.titulo ? 'Consultando NutriAI...' : 'BUSCAR RECEITA COMPLETA'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      

      {/* TELA ESTA SEMANA */}
      {abaAtiva === 'Esta semana' && (
        <div className="dieta-colunas-semanais">
          {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map(dia => (
            <div key={dia} className={`coluna-dia ${diaSelecionado && diaSelecionado !== dia ? 'opaco' : ''}`} onClick={() => setDiaSelecionado(dia === diaSelecionado ? null : dia)}>
              <h3>{dia}</h3>
              {refeicoes.map((refeicao, index) => {
                const tipoNormalizado = refeicao.tipo?.toLowerCase() || 'padrao';
                return (
                  <div key={index} className={`card-refeicao-semanal borda-${tipoNormalizado}`}>
                    <span className="card-refeicao-tipo">{refeicao.tipo.toUpperCase()}</span>
                    <p className="card-refeicao-titulo">{refeicao.titulo}</p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* MODAL DA RECEITA */}
      {modalAberto && (
        <div className="modal-receita-overlay" onClick={() => setModalAberto(false)}>
          <div className="modal-receita-conteudo" onClick={(e) => e.stopPropagation()}>
            <div className="modal-receita-header">
              <h2>{tituloModal}</h2>
              <button className="modal-receita-fechar" onClick={() => setModalAberto(false)}>&times;</button>
            </div>
            <div className="modal-receita-corpo">
              <h4>Modo de Preparo Inteligente (NutriAI)</h4>
              <p>{receitaCompleta}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MinhaDieta;