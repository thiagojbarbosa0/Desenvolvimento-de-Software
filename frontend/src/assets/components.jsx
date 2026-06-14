import LogoIcon from './icons/Logo.svg'
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


export default MostrarLogo;