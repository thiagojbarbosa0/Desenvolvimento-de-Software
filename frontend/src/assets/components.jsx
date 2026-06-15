import LogoIcon from './icons/Logo.svg';
import LogoTipoIcon from './icons/Logotipo.svg';
import { useState, useRef, useEffect } from 'react';
import './components.css'; // Importação das melhorias de estilo isoladas

export function MostrarLogo() {
  return (
    <div id='caixa_logo'>
      {/* <img src={LogoIcon} width={42} height={42} alt="Logo" />
      <h1 id='logo_texto'>NutriAI</h1> */}
      <img src={LogoTipoIcon} width="100%" alt="Logotipo" />
    </div>
  );
}

/******************************************************************************************************************************/
export function MostrarLogoEstendido() {
  return (
    <div id='logo_estendido'>
      <div id='caixa_logo_estendido'>
        <h1 id='logo_texto_estendido'>NutriAI</h1>
      </div>
    </div>
  );
}

/******************************************************************************************************************************/
// Adicionado ...props para permitir passar placeholders, onChange, value, etc., dinamicamente do pai
export function InputPadraoTexto({ ...props }) {
  return (
    <input
      type='text'
      className='input_padrao_texto'
      {...props}
    />
  );
}

export function InputPadraoSenha({ ...props }) {
  return (
    <input
      type='password' /* Corrigido de text para password por segurança */
      className='input_padrao_senha'
      {...props}
    />
  );
}

export function FormularioPadrao({ children, ...props }) {
  return (
    <form className='formulario_padrao' {...props}>
      {children}
    </form>
  );
}

/* Casco do quadro de ajuda modernizado com animações suaves de entrada */
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
 * Componente reutilizável de seleção múltipla modernizado
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
    /* Adicionada a classe condicional 'focado' para aplicar bordas e sombras elegantes com CSS */
    <div className={`seletor-multiplo-container ${aberto ? 'focado' : ''}`} ref={containerRef}>
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
        <span className={`seletor-multiplo-seta ${aberto ? 'aberta' : ''}`}>▾</span>
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