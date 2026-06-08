import './TelaLogin.css';
import { useNavigate } from 'react-router-dom';
import MostrarLogo from '../../../assets/components.jsx';
import { useState } from 'react';
import { api } from '../../../services/api.js';

function TelaLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
const handleLogin = async (e) => {
  e.preventDefault();
  setErro('');

  if (!email || !senha) {
    setErro('Preencha e-mail e senha.');
    return;
  }

  setCarregando(true);
  try {
    // 🚨 TRAVA DO BACKEND REMOVIDA: Comentamos a chamada real da API
    /* const { data } = await api.post('/auth/login', {
      email,
      password: senha,
    });
    */

    // 🎯 MOCK: Simulando que o backend respondeu com sucesso total
    const dadosMocados = {
      token: 'token_fake_nutriai_123456',
      user_id: '999',
      name: 'Usuário Teste CIn'
    };

    // Grava os dados fakes no localStorage para o restante do app não quebrar
    localStorage.setItem('token', dadosMocados.token);
    localStorage.setItem('user_id', dadosMocados.user_id);
    localStorage.setItem('user_name', dadosMocados.name);
    
    // Redireciona direto para o painel principal!
    navigate('/tela-principal');

  } catch (err) {
    // Deixe o catch aqui para não quebrar a estrutura, 
    // mas ele nunca será atingido enquanto o mock estiver ativo
    setErro('E-mail ou senha incorretos.');
  } finally {
    setCarregando(false);
  }
};
return (
  <>
    <MostrarLogo />
    <div id='TelaLogin'>
      <div id='formulario_login'>
        <div id='titulo_login'>
            <h2>Login</h2>
        </div>
        <form onSubmit={handleLogin}>
          <p id="entrada_email">Email ou nome de usuário</p>
          <input
            type='text'
            placeholder='digite seu login'
            className='input_padrao input_login'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div>
            <p id='entrada_senha'>Senha</p>
            <input
              type='password'
              placeholder='digite sua senha'
              className='input_padrao input_login'
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <p id='esqueci_senha'>Esqueci minha senha</p>
          </div>

          {erro && (
            <p style={{ color: 'red', fontSize: '14px', margin: '0' }}>
              {erro}
            </p>
          )}

          <div className='acoes'>
            <button type='submit' disabled={carregando}>
              {carregando ? 'Entrando...' : 'Entrar'}
            </button>
            <button
              type='button'
              onClick={() => navigate('/cadastro')}
            >Criar Conta
            </button>
          </div>
        </form>
      </div>
    </div>
  </>
);
}

export default TelaLogin;