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
      const { data } = await api.post('/auth/login', {
        email,
        password: senha,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('user_name', data.name);
      navigate('/tela-principal');
    } catch (err) {
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