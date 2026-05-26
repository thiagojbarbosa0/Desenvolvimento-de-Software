import '../TelaLogin.css';
import { MostrarLogoEstendido } from '../../../assets/components.jsx';
import { useNavigate } from 'react-router-dom';
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
      <MostrarLogoEstendido />
      <div id='TelaLogin'>
        <div id='formulario_login'>
          <form onSubmit={handleLogin}>
            <div><h2>Login</h2></div>

            <p id="entrada_email">Email ou nome de usuário</p>
            <input
              type='text'
              className='input_padrao input_login'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <p id='entrada_senha'>Digite sua senha</p>
              <input
                type='password'
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