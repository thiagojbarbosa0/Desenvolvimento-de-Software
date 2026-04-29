import '../TelaLogin.css';
import {MostrarLogoEstendido} from '../assets/components.jsx'; 
import { useNavigate } from 'react-router-dom';

function TelaLogin(){
    const navigate = useNavigate();
    return (
    <>  
        <MostrarLogoEstendido/>
        <div id='TelaLogin'>
            <div id='formulario_login'>
                <form action='#' method='post'>
                    <div>
                        <h2>Login</h2>
                    </div>
                        <p id="entrada_email">Email ou nome de usuário</p>
                        <input type='text' required class='input_padrao input_login'/>
                    <div>
                        <p id='entrada_senha'>Digite sua senha</p>
                        <input type='password' required class='input_padrao input_login'/>
                        <p id='esqueci_senha'>Esqueci minha senha</p>
                    </div>
                    <div class='acoes'>
                        <button onClick={()=>navigate('/TelaPrincipal')}>Entrar</button>
                        <button>Criar Conta</button>
                    </div>
                </form>
            </div>
        </div>
    </>
    )
}

export default TelaLogin;