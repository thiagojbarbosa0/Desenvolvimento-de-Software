import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MostrarLogo from '../../../assets/components.jsx';
import {SeletorMultiplo} from '../../../assets/components.jsx';
import './TelaCadastroMetas.css';
// import { api } from '../../../services/api.js'; // TODO: descomentar quando o back estiver pronto

function TelaCadastroMetas() {
  const navigate = useNavigate();
   // 1. ESTADOS PARA AS SELEÇÕES
  const [metasSelecionadas, setMetasSelecionadas] = useState([]);
  const [motivacoesSelecionadas, setMotivacoesSelecionadas] = useState([]);

  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // TODO (BACK): essa lista pode vir de uma rota GET /metas/opcoes
  // 2. OPÇÕES DOS SELETORES (Podem vir do Back-end depois)
  const opcoesMetas = [
    'Perder peso',
    'Ganhar massa muscular',
    'Manter o peso atual',
    'Melhorar alimentação',
    'Aumentar disposição',
    'Controlar diabetes',
    'Reduzir colesterol',
    'Melhorar desempenho físico',
  ];

  const opcoesMotivacoes = [
    'Ter mais saúde e longevidade',
    'Insatisfação com o corpo atual',
    'Recomendação médica',
    'Disposição para brincar com os filhos/trabalhar',
    'Melhorar a auto-estima',
    'Prevenção de doenças históricas na família',
  ];


const handleContinuar = async () => {
  setErro('');

  // ✅ Valida se ambos os campos foram preenchidos
  if (metasSelecionadas.length === 0 || motivacoesSelecionadas.length === 0) {
    setErro('Por favor, selecione pelo menos uma Meta e uma Motivação para continuar.');
    return;
  }

  setCarregando(true);
  
  // No futuro, seu back vai receber um objeto com os dois arrays:
  // { metas: metasSelecionadas, motivacoes: motivacoesSelecionadas }

  navigate('/tela-principal');
  setCarregando(false);
};

  return (
  <>
    <MostrarLogo />
    <div className="metas-container">
      <h1>Quais são suas principais metas?</h1>
      <SeletorMultiplo
        opcoes={opcoesMetas}
        valor={metasSelecionadas}
        onChange={setMetasSelecionadas}
        placeholder="Digitar..."
      />

      <h1>Quais são suas principais motivações para mudar seus hábitos alimentares?</h1>
      <SeletorMultiplo
        opcoes={opcoesMotivacoes}
        valor={motivacoesSelecionadas}
        onChange={setMotivacoesSelecionadas} 
        placeholder="Digitar..."
      />

      {erro && <p className="metas-erro">{erro}</p>}

      <button
        className="metas-botao-continuar"
        onClick={handleContinuar}
        disabled={carregando}
      >
        {carregando ? 'Salvando...' : 'Continuar'}
      </button>
    </div>
  </>
);
}

export default TelaCadastroMetas;