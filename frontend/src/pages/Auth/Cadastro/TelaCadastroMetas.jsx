import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MostrarLogo from '../../../assets/components.jsx';
import { SeletorMultiplo } from '../../../assets/components.jsx';
import './TelaCadastroMetas.css';
// import { api } from '../../../services/api.js'; // TODO: descomentar quando o back estiver pronto

function TelaCadastroMetas() {
  const navigate = useNavigate();
  
  // Estados existentes
  const [metasSelecionadas, setMetasSelecionadas] = useState([]);
  const [motivacoesSelecionadas, setMotivacoesSelecionadas] = useState([]);
  const [objetivosSelecionados, setObjetivosSelecionados] = useState([]);
  const [opcoesDCNTSelecionadas, setopcoesDCNT] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // 1. NOVO ESTADO: Controla se o pop-up está aberto ou fechado
  const [mostrarModal, setMostrarModal] = useState(false);

  // Opções dos seletores
  const opcoesMetas = ['Perder peso', 'Ganhar massa muscular', 'Manter o peso atual', 'Melhorar desempenho físico'];
  const opcoesMotivacoes = ['Ter mais saúde e longevidade', 'Insatisfação com o corpo atual', 'Recomendação médica', 'Disposição para a rotina diária', 'Melhorar a auto-estima', 'Prevenção de doenças históricas na família'];
  const opcoesObjetivos = ['Ter mais energia e disposição no dia a dia', 'Reduzir a compulsão por doces ou beliscos', 'Melhorar a qualidade do sono', 'Criar hábitos alimentares duradouros', 'Melhorar o funcionamento do intestino'];
  const opcoesDCNT = ['Hipertensão Arterial', 'Diabetes Mellitus', 'Colesterol Alto / Dislipidemia', 'Esteatose Hepática (Gordura no fígado)'];

  const handleContinuar = async () => {
    setErro('');

    if (metasSelecionadas.length === 0 || motivacoesSelecionadas.length === 0 || objetivosSelecionados.length === 0) {
      setErro('Por favor, preencha suas Metas, Motivações e Objetivos para continuar.');
      return;
    }

    setCarregando(true);
    navigate('/tela-principal');
    setCarregando(false);
  };

  return (
    <>
      <MostrarLogo />
      <div className="metas-container">
        <h1>Quais são suas principais metas?</h1>
        <SeletorMultiplo opcoes={opcoesMetas} valor={metasSelecionadas} onChange={setMetasSelecionadas} placeholder="Digitar..." />

        <h1>Quais são suas principais motivações para mudar seus hábitos alimentares?</h1>
        <SeletorMultiplo opcoes={opcoesMotivacoes} valor={motivacoesSelecionadas} onChange={setMotivacoesSelecionadas} placeholder="Digitar..." />

        <h1>Quais objetivos você espera atingir caso consiga mudar seus hábitos alimentares?</h1>
        <SeletorMultiplo opcoes={opcoesObjetivos} valor={objetivosSelecionados} onChange={setObjetivosSelecionados} placeholder="Digitar..." />

        <h1>Você possui alguma doença crônica não-transmissível (DCNT)?</h1>
        <p className="metas-subtitulo-opcional">Se sim, preencha este campo para receber um planejamento especializado (opcional):</p>
        
        <SeletorMultiplo opcoes={opcoesDCNT} valor={opcoesDCNTSelecionadas} onChange={setopcoesDCNT} placeholder="Digitar..." />
        
        {/* 2. ALTERADO: Agora apenas abre o modal mudando o estado para true */}
        <p 
          className="metas-link-explicacao"
          onClick={() => setMostrarModal(true)} 
        >
          O que são DCNT's?
        </p>

        {erro && <p className="metas-erro">{erro}</p>}

        <button className="metas-botao-continuar" onClick={handleContinuar} disabled={carregando}>
          {carregando ? 'Salvando...' : 'Continuar'}
        </button>
      </div>

      {/* 3. HTML DO POP-UP (Só renderiza se mostrarModal for true) */}
      {mostrarModal && (
        <div className="metas-modal-overlay" onClick={() => setMostrarModal(false)}>
          <div className="metas-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>O que são DCNT's?</h2>
            <p>
              As <strong>Doenças Crônicas Não Transmissíveis (DCNT)</strong> são condições médicas de longa duração que não são transmitidas de pessoa para pessoa. 
            </p>
            <p>
              Os exemplos mais comuns incluem <strong>Hipertensão (pressão alta), Diabetes, Colesterol Alto e Gordura no Fígado</strong>.
            </p>
            <p>
              Informar isso nos ajuda a ajustar a Inteligência Artificial para gerar um cardápio seguro e focado na melhora da sua saúde!
            </p>
            <button className="metas-modal-fechar" onClick={() => setMostrarModal(false)}>
              Entendi
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default TelaCadastroMetas;