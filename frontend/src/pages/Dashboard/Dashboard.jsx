import { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useNavigate } from 'react-router-dom';
import '../Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [fraseMotivacional, setFraseMotivacional] = useState("Carregando sua dose diária de motivação...");
  const [diasSeguindo, setDiasSeguindo] = useState(0);
  const [metaKcal, setMetaKcal] = useState(0);
  const [metaTreino, setMetaTreino] = useState("");

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
        setFraseMotivacional("O sucesso é a soma de pequenos esforços repetidos dia após dia!");
        setMetaKcal(2000);
        setMetaTreino("levantamento de garfo, 20 minutos");
      }
    }

    buscarDadosDashboard();
  }, []);

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
  };

  const acionarBotaoDesistir = () => {
    alert("Calma! Vou te conectar agora com o Consultor IA para te dar uma força.");
    navigate('/tela-principal');
  };

  return (
    <div className="dashboard-container">
      
      <div className="banner-motivacional">
        <p>"{fraseMotivacional}"</p>
      </div>

      <div className="cards-dashboard-grid">
        
        <div className="card-dashboard">
          <h3>Contagem de dias seguindo o plano nutricional:</h3>
          <span className="numero-destaque">{diasSeguindo}</span>
          <button className="btn-card-reiniciar" onClick={reiniciarContagem}>Reiniciar</button>
        </div>

        <div className="card-dashboard">
          <h3>Meta do dia:</h3>
          <div className="texto-meta">
            <p>Comer <strong>{metaKcal} kcal</strong></p>
            <p>{metaTreino}</p>
          </div>
          <button className="btn-card-redefinir" onClick={redefinirMetas}>Redefinir</button>
        </div>

      </div>

      <button className="btn-desistir" onClick={acionarBotaoDesistir}>
        Estou pensando em desistir
      </button>

    </div>
  );
}

export default Dashboard;