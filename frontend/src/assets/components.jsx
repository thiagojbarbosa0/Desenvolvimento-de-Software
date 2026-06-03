import LogoIcon from './icons/Logo.svg'
function MostrarLogo() {
    return(
    <div id='logo'>
      <div id='caixa_logo'>
      <img src={LogoIcon} width={84} height={84} alt="Logo" />
        <h1 id='logo_texto'>NutriAI</h1>
      </div>
    </div>
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

export default MostrarLogo;