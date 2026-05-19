import { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import '../Dashboard.css';

function Dashboard() {
  // Estados para gerenciar os dados vindos do SQLite via FastAPI
  const [fraseMotivacional, setFraseMotivacional] = useState("Carregando sua dose diária de motivação...");
  const [diasSeguindo, setDiasSeguindo] = useState(0);
  const [metaKcal, setMetaKcal] = useState(0);
  const [metaTreino, setMetaTreino] = useState("");

  // Carrega os dados do banco assim que a tela abre
  useEffect(() => {
    async function buscarDadosDashboard() {
      try {
        const userId = localStorage.getItem("user_id");
        const { data } = await api.get(`/dashboard/${userId}`);
        
        setFraseMotivacional(data.frase);
        setDiasSeguindo(data.dias_consecutivos);
        setMetaKcal(data.meta_kcal);
        setMetaTreino(data.meta_treino);
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard", err);
        // Valores padrão caso a API falhe temporariamente (fallback)
        setFraseMotivacional("O sucesso é a soma de pequenos esforços repetidos dia após dia!");
        setMetaKcal(2000);
        setMetaTreino("levantamento de garfo, 20 minutos");
      }
    }

    buscarDadosDashboard();
  }, []);

  // Funções dos botões do layout
  const reiniciarContagem = async () => {
    if (window.confirm("Deseja mesmo reiniciar sua contagem de dias?")) {
      try {
        const userId = localStorage.getItem("user_id");
        await api.post(`/dashboard/${userId}/reiniciar`);
        setDiasSeguindo(0);
      } catch (err) {
        alert("Erro ao reiniciar.");
      }
    }
  };

  const redefinirMetas = () => {
    const novaKcal = prompt("Qual a nova meta de kcal?", metaKcal);
    if (novaKcal) setMetaKcal(Number(novaKcal));
    // Aqui você dispararia um api.put para salvar no SQLite
  };

  const acionarBotaoDesistir = async () => {
    const mensagemDesespero = "Estou pensando em desistir.";
    
    // Aqui você pode redirecionar o usuário diretamente para a aba do Consultor IA 
    // passando um comando pré-definido para o Gemini dar um gás na motivação dele!
    alert("Calma! Vou te conectar agora com o Consultor IA para te dar uma força.");
    // Lógica para mudar de aba pode ser passada via propriedade (prop) se necessário
  };

  return (
    <div className="dashboard-container">
      
      {/* 1. Banner da Frase Motivacional */}
      <div className="banner-motivacional">
        <p>"{fraseMotivacional}"</p>
      </div>

      {/* 2. Grid de Cards */}
      <div className="cards-dashboard-grid">
        
        {/* Card Contagem de Dias */}
        <div className="card-dashboard">
          <h3>Contagem de dias seguindo o plano nutricional:</h3>
          <span className="numero-destaque">{diasSeguindo}</span>
          <button className="btn-card-reiniciar" onClick={reiniciarContagem}>Reiniciar</button>
        </div>

        {/* Card Meta do Dia */}
        <div className="card-dashboard">
          <h3>Meta do dia:</h3>
          <div className="texto-meta">
            <p>Comer <strong>{metaKcal} kcal</strong></p>
            <p>{metaTreino}</p>
          </div>
          <button className="btn-card-redefinir" onClick={redefinirMetas}>Redefinir</button>
        </div>

      </div>

      {/* 3. Botão de Emergência (Inferior Direito) */}
      <button className="btn-desistir" onClick={acionarBotaoDesistir}>
        Estou pensando em desistir
      </button>

    </div>
  );
}

export default Dashboard;

