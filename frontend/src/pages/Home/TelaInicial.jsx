import './TelaInicial.css';
import MostrarLogo from '../../assets/components.jsx';
import { useNavigate } from 'react-router-dom'; 
 
function TelaInicial(){
    const navigate = useNavigate();

    return (
      <div className="container-boas-vindas">
        {/* Cabeçalho isolado para o Logo */}
        {/* <header className="topo-inicial">
          <MostrarLogo />
        </header> */}
        
        {/* Bloco de Conteúdo Principal */}
        <main className="conteudo-principal">
          <section className="bloco-saudacao">
            <h1 id='texto_saudacao'>Bem-vindo ao NutriAI</h1>
            <p id='texto_descricao'>
              Por meio da coleta de dados relacionados à saúde e à preferência dos usuários, 
              o NutriAI oferece ferramentas de inteligência artificial para ajudá-lo a montar 
              uma dieta adequada às suas necessidades.
            </p>
          </section>

          {/* Seção de Ações e Botões */}
          <section id='botoes_TelaInicial'>
            <div className="card-acao acao-entrar">
              <button onClick={() => navigate('/tela-login')}>Entrar</button>
              <p>Caso já possua uma conta</p>
            </div>
            
            <div className="card-acao acao-cadastrar">
              <button onClick={() => navigate('/cadastro')}>Criar conta</button>
              <p>Caso não possua uma conta</p>
            </div> 
          </section> 
        </main>
      </div>
    );
}

export default TelaInicial;