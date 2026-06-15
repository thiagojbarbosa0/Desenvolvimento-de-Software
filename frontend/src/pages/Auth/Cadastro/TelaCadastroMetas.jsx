import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MostrarLogo from '../../../assets/components.jsx';
import { SeletorMultiplo } from '../../../assets/components.jsx';
import './TelaCadastroMetas.css';
// import { api } from '../../../services/api.js'; // TODO: descomentar quando o back estiver pronto

function TelaCadastroMetas() {
  const navigate = useNavigate();
  
  const [metasSelecionadas, setMetasSelecionadas] = useState([]);
  const [motivacoesSelecionadas, setMotivacoesSelecionadas] = useState([]);
  const [objetivosSelecionados, setObjetivosSelecionados] = useState([]);
  const [opcoesDCNTSelecionadas, setopcoesDCNT] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const opcoesMetas = ['Perder peso', 'Ganhar massa muscular', 'Manter o peso atual', 'Melhorar desempenho físico'];
  const opcoesMotivacoes = ['Ter mais saúde e longevidade', 'Insatisfação com o corpo atual', 'Recomendação médica', 'Disposição para a rotina diária', 'Melhorar a auto-estima', 'Prevenção de doenças históricas na família'];
  const opcoesObjetivos = ['Ter mais energia e disposição no dia a dia', 'Reduzir a compulsão por doces ou beliscos', 'Melhorar a qualidade do sono', 'Criar hábitos alimentares duradouros', 'Melhorar o funcionamento do intestino'];
  const opcoesDCNT = ['Hipertensão Arterial', 'Diabetes Mellitus', 'Colesterol Alto / Dislipidemia', 'Esteatose Hepática (Gordura no fígado)'];

  const handleContinuar = async () => {
    setErro('');

    if (metasSelecionadas.length === 0 || motivacoesSelecionadas.length === 0 || objetivosSelecionados.length === 0) {
      setErro('Por favor, selecione suas Metas, Motivações e Objetivos para continuar.');
      return;
    }

    setCarregando(true);
    navigate('/tela-principal');
    setCarregando(false);
  };

  return (
    <div className="container-cadastro-metas">
      <header className="topo-cadastro-metas">
        <MostrarLogo />
      </header>

      <main className="conteudo-cadastro-metas">
        <div className="card-cadastro-metas">
          <div className="header-card-metas">
            <h1>Personalize seus Objetivos</h1>
            <p className="subtitulo">Selecione as opções que melhor representam o seu momento atual</p>
          </div>

          <div className="formulario-metas-fluxo">
            <div className="grupo-seletor-meta">
              <label>Quais são suas principais metas?</label>
              <SeletorMultiplo opcoes={opcoesMetas} valor={metasSelecionadas} onChange={setMetasSelecionadas} placeholder="Selecione uma ou mais opções..." />
            </div>

            <div className="grupo-seletor-meta">
              <label>Quais são suas motivações para mudar hábitos alimentares?</label>
              <SeletorMultiplo opcoes={opcoesMotivacoes} valor={motivacoesSelecionadas} onChange={setMotivacoesSelecionadas} placeholder="Selecione uma ou mais opções..." />
            </div>

            <div className="grupo-seletor-meta">
              <label>Quais objetivos você espera atingir?</label>
              <SeletorMultiplo opcoes={opcoesObjetivos} valor={objetivosSelecionados} onChange={setObjetivosSelecionados} placeholder="Selecione uma ou mais opções..." />
            </div>

            <div className="grupo-seletor-meta bloco-dcnt">
              <label>Você possui alguma doença crônica não-transmissível (DCNT)?</label>
              <p className="metas-subtitulo-opcional">Campo opcional para gerar um planejamento especializado.</p>
              <SeletorMultiplo opcoes={opcoesDCNT} valor={opcoesDCNTSelecionadas} onChange={setopcoesDCNT} placeholder="Selecione se aplicável..." />
              
              <span 
                className="metas-link-explicacao"
                onClick={() => setMostrarModal(true)} 
              >
                O que são DCNT's?
              </span>
            </div>

            {erro && <p className="mensagem-erro-metas">{erro}</p>}

            <div className="acoes-metas">
              <button className="btn-metas-continuar" onClick={handleContinuar} disabled={carregando}>
                {carregando ? 'Salvando...' : 'Finalizar Cadastro'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {mostrarModal && (
        <div className="metas-modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="metas-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>O que são DCNT's?</h2>
            <p>
              As <strong>Doenças Crônicas Não Transmissíveis (DCNT)</strong> são condições médicas de longa duração que não são transmitidas diretamente de uma pessoa para outra.
            </p>
            <p>
              Os exemplos mais comuns incluem <strong>Hipertensão (pressão alta), Diabetes, Colesterol Alto e Gordura no Fígado (Esteatose)</strong>.
            </p>
            <p>
              Informar essas condições permite que a nossa Inteligência Artificial configure restrições ou adições nutricionais de forma totalmente segura para a sua saúde.
            </p>
            <button className="metas-modal-fechar" onClick={() => setMostrarModal(false)}>
              Entendi, obrigado!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TelaCadastroMetas;