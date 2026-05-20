import '../TelaInicial.css';
import MostrarLogo from '../assets/components.jsx';
import { useNavigate } from 'react-router-dom'; 
 
function TelaInicial(){
    const navigate = useNavigate();
    return (
  <div id='TelaInicial'>

    <MostrarLogo />
    
    <div id='saudacao'>
        <h1 id='texto_saudacao'>Bem vindo ao NutriAI</h1>
    </div>

    <div id='descricao'>
      <p id='texto_descricao'>Por meio da coleta de dados relacionados à saúde e à preferência dos usuários, o NutriAI oferece ferramentas de inteligência artificial para ajudá-lo a montar uma dieta adequada às suas necessidades.</p>
    </div>

    <div id='botoes_TelaInicial'>
      <div id='botao_continuar'>
        <button onClick={() => navigate('/tela-login')}>Continuar</button>
        <p>Caso já possua uma conta</p>
      </div>
      <div id='Criar_conta'>
        <button onClick={() => navigate('/cadastro')}>Criar conta</button>
        <p>Caso não possua uma conta</p>
      </div> 
    </div> 
  </div>
    )
}
export default TelaInicial;