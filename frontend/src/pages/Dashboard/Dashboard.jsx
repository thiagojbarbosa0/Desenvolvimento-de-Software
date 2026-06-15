import Imagem from '../../assets/Images/nature.jpg';
import { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const FRASES_MOTIVACIONAIS = [
  "Sua saúde não é um objetivo de curto prazo, é um estilo de vida duradouro.",
  "Cada escolha saudável de hoje é um agradecimento que o seu corpo fará amanhã.",
  "A constância supera a perfeição. Mantenha o foco no seu progresso diário!",
  "Nutrir o corpo com sabedoria é a maior expressão de respeito a si mesmo.",
  "Pequenas disciplinas diárias geram grandes transformações a longo prazo.",
  "O segredo do sucesso está escondido na sua rotina e nas suas escolhas diárias.",
  "Não se trata apenas de comer menos ou mais, trata-se de nutrir a sua melhor versão.",
  "Seu corpo é o seu único lar fixo. Cuide dele com o carinho que ele merece.",
  "Cada dia é uma nova oportunidade para blindar a sua saúde e renovar suas metas."
];

function Dashboard() {
  const navigate = useNavigate();
  const [fraseMotivacional, setFraseMotivacional] = useState("");
  const [diasSeguindo, setDiasSeguindo] = useState(0);
  const [metaKcal, setMetaKcal] = useState(0);
  const [metaTreino, setMetaTreino] = useState("");

  // Estado para controlar o Modal Customizado
  const [modalConfig, setModalConfig] = useState({
    visivel: false,
    titulo: "",
    mensagem: "",
    tipo: "", // 'aviso' (1 botão) ou 'confirmacao' (2 botões)
    acaoConfirmar: null
  });

  useEffect(() => {
    const fraseAleatoria = FRASES_MOTIVACIONAIS[Math.floor(Math.random() * FRASES_MOTIVACIONAIS.length)];
    
    async function buscarDadosDashboard() {
      try {
        const userId = localStorage.getItem("user_id");
        const { data } = await api.get(`/dashboard/${userId}`);
        
        setFraseMotivacional(data.frase || fraseAleatoria);
        setDiasSeguindo(data.dias_consecutivos);
        setMetaKcal(data.meta_kcal);
        setMetaTreino(data.meta_treino);
      } catch (err) {
        console.error("Erro ao buscar dados do dashboard", err);
        setFraseMotivacional(fraseAleatoria);
        setMetaKcal(2000);
        setMetaTreino("Caminhada ativa ou atividade leve, 20 minutos");
      }
    }

    buscarDadosDashboard();
  }, []);

  const fecharModal = () => {
    setModalConfig({ ...modalConfig, visivel: false });
  };

  const reiniciarContagem = () => {
    setModalConfig({
      visivel: true,
      titulo: "Reiniciar Progresso",
      mensagem: "Deseja mesmo reiniciar sua contagem de dias? Todo o progresso visual será zerado.",
      tipo: "confirmacao",
      acaoConfirmar: async () => {
        try {
          const userId = localStorage.getItem("user_id");
          await api.post(`/dashboard/${userId}/reiniciar`);
          setDiasSeguindo(0);
          fecharModal();
        } catch (err) {
          setModalConfig({
            visivel: true,
            titulo: "Erro",
            mensagem: "Não foi possível reiniciar. Tente novamente.",
            tipo: "aviso",
            acaoConfirmar: fecharModal
          });
        }
      }
    });
  };

  const redefinirMetas = () => {
    const novaKcal = prompt("Qual a nova meta de kcal?", metaKcal);
    if (novaKcal) setMetaKcal(Number(novaKcal));
  };

  const acionarBotaoDesistir = () => {
    setModalConfig({
      visivel: true,
      titulo: "Não desista agora!",
      mensagem: "Calma! Vou te conectar agora com o Consultor IA para te dar uma força.",
      tipo: "aviso",
      acaoConfirmar: () => {
        fecharModal();
        navigate('/tela-principal');
      }
    });
  };

  return (
    <>
      <main className="dashboard-container">
        
        {/* Banner Motivacional Superior */}
        <section className="banner-motivacional">
          <div className="banner-aspas">“</div>
          <p className="frase-texto">{fraseMotivacional}</p>
        </section>

        {/* Bloco Horizontal */}
        <div className="dashboard-conteudo-principal">
          
          <section className="cards-dashboard-grid">
            
            <div className="card-dashboard-item">
              <div className="card-dashboard-header">
                <h3>Foco Consecutivo</h3>
                <span className="badge-card">Status</span>
              </div>
              <div className="card-dashboard-corpo">
                <span className="numero-destaque">
                  {diasSeguindo} <span className="unidade-destaque">dias</span>
                </span>
                <p className="legenda-card">seguindo o plano nutricional rigidamente</p>
              </div>
              <div className="card-dashboard-acoes">
                <button className="btn-card-reiniciar" onClick={reiniciarContagem}>
                  Reiniciar Progresso
                </button>
              </div>
            </div>

            <div className="card-dashboard-item">
              <div className="card-dashboard-header">
                <h3>Metas de Hoje</h3>
                <span className="badge-card meta-badge">Diário</span>
              </div>
              <div className="card-dashboard-corpo">
                <div className="texto-meta-container">
                  <p className="meta-calorias">
                    Meta Calórica: <strong>{metaKcal} kcal</strong>
                  </p>
                  <p className="meta-exercicio">{metaTreino}</p>
                </div>
              </div>
              <div className="card-dashboard-acoes">
                <button className="btn-card-redefinir" onClick={redefinirMetas}>
                  Ajustar Calorias
                </button>
              </div>
            </div>

          </section>

          <section className="dashboard-ilustracao-container">
            <img 
              src={Imagem}
              alt="Alimentação saudável" 
              className="dashboard-imagem"
            />
          </section>

        </div>

        <section className="dashboard-suporte-footer">
          <button className="btn-desistir" onClick={acionarBotaoDesistir}>
            <span className="btn-icon">💡</span> Estou pensando em desistir
          </button>
        </section>

      </main>

      {/* MODAL CUSTOMIZADO (SUBSTITUTO DOS ALERTS) */}
      {modalConfig.visivel && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-titulo">{modalConfig.titulo}</h3>
            <p className="modal-mensagem">{modalConfig.mensagem}</p>
            
            <div className="modal-acoes">
              {modalConfig.tipo === "confirmacao" && (
                <button className="btn-modal-cancelar" onClick={fecharModal}>
                  Cancelar
                </button>
              )}
              <button className="btn-modal-confirmar" onClick={modalConfig.acaoConfirmar}>
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Dashboard;