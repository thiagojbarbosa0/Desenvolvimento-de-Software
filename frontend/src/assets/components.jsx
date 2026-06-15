import LogoIcon from './icons/Logo.svg'
import { useState,useRef,useEffect } from 'react';
function MostrarLogo() {
    return(
    <>
      <div id='caixa_logo'>
      <img src={LogoIcon} width={84} height={84} alt="Logo" />
        <h1 id='logo_texto'>NutriAI</h1>
      </div>
    </>
    )
}
/******************************************************************************************************************************/
export function MostrarLogoEstendido() {
    return(
    <div id='logo_estendido'>
      <div id='caixa_logo_estendido'>
        <h1 id='logo_texto_estendido'>NutriAI</h1>
      </div>
    </div>
    )
}
/******************************************************************************************************************************/
export function InputPadraoTexto() {
    return(
      <input
        type='text'
        className='input_padrao_texto'
      />
    )
}

export function InputPadraoSenha() {
    return(
      <input
        type='text'
        className='input_padrao_senha'
      />
    )
}

export function FormularioPadrao() {
    return(
      <form className='formulario_padrao'>
      </form>
    )
}

export function HeaderPagina({ titulo }) {
  if (titulo == "Comunidade") {
        var titulo = "Comunidade - Leia e Compartilhe Experiencias";
        }
  return (
    <header className="topo-logo">
      <div className="caixa_cabecalho">
        <h1>{titulo} - Sistema NutriAI</h1>
      </div>
    </header>
  );
}

/* Casco do quadro de ajuda (aquele da tela de ajuda quando o usuário está recuperando a senha)*/
export function CardAjudaShell({ titulo = 'Ajuda', children }) {
  return (
    <div className="card-ajuda-overlay">
      <div className="card-ajuda">
        <div className="card-ajuda-header">
          <h2>{titulo}</h2>
        </div>
        <div className="card-ajuda-corpo">
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Componente reutilizável de seleção múltipla com busca e tags.
 *
 * Props:
 * - opcoes: string[] — lista de opções disponíveis
 * - valor: string[] — itens atualmente selecionados (controlado pelo pai)
 * - onChange: (novoValor: string[]) => void — chamado quando a seleção muda
 * - placeholder: string — texto exibido quando vazio (default: "Digitar...")
 * - permitirCriarNovo: boolean — se true, permite adicionar opções
 *   que não estão na lista (digita e aperta Enter)
 */
export function SeletorMultiplo({
  opcoes = [],
  valor = [],
  onChange,
  placeholder = 'Digitar...',
  permitirCriarNovo = false,
}) {
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState('');
  const containerRef = useRef(null);

  const opcoesFiltradas = opcoes.filter(
    (opcao) =>
      opcao.toLowerCase().includes(busca.toLowerCase()) &&
      !valor.includes(opcao)
  );

  const adicionar = (item) => {
    if (!valor.includes(item)) {
      onChange([...valor, item]);
    }
    setBusca('');
  };

  const remover = (item) => {
    onChange(valor.filter((v) => v !== item));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && permitirCriarNovo && busca.trim()) {
      e.preventDefault();
      adicionar(busca.trim());
    }
  };

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickFora = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setAberto(false);
      }
    };
    document.addEventListener('mousedown', handleClickFora);
    return () => document.removeEventListener('mousedown', handleClickFora);
  }, []);

  return (
    <div className="seletor-multiplo-container" ref={containerRef}>
      <div className="seletor-multiplo-campo" onClick={() => setAberto(true)}>
        <div className="seletor-multiplo-tags">
          {valor.map((item) => (
            <span key={item} className="seletor-multiplo-tag">
              {item}
              <button
                type="button"
                className="seletor-multiplo-tag-remover"
                onClick={(e) => {
                  e.stopPropagation();
                  remover(item);
                }}
              >
                ×
              </button>
            </span>
          ))}
          <input
            type="text"
            className="seletor-multiplo-input"
            placeholder={valor.length === 0 ? placeholder : ''}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onFocus={() => setAberto(true)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <span className={`seletor-multiplo-seta ${aberto ? 'aberta' : ''}`}>⌄</span>
      </div>

      {aberto && opcoesFiltradas.length > 0 && (
        <ul className="seletor-multiplo-dropdown">
          {opcoesFiltradas.map((opcao) => (
            <li
              key={opcao}
              className="seletor-multiplo-opcao"
              onClick={() => adicionar(opcao)}
            >
              {opcao}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MostrarLogo;