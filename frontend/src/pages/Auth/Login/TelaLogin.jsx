import './TelaLogin.css';
import { useNavigate } from 'react-router-dom';
import MostrarLogo from '../../../assets/components.jsx';
import { useState } from 'react';

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
      const dadosMocados = {
        token: 'token_fake_nutriai_123456',
        user_id: '999',
        name: 'Usuário Teste CIn'
      };

      localStorage.setItem('token', dadosMocados.token);
      localStorage.setItem('user_id', dadosMocados.user_id);
      localStorage.setItem('user_name', dadosMocados.name);
      
      navigate('/tela-principal');
    } catch (err) {
      setErro('E-mail ou senha incorretos.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="container-login">
      <div className="topo-login">
        <MostrarLogo />
      </div>

      <div className="conteudo-login">
        <div className="card-login">
          <div className="header-card">
            <h1>Login</h1>
            <p className="subtitulo">Acesse sua conta para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="formulario-login-corpo">
            <div className="grupo-input">
              <label htmlFor="input-email">Email ou nome de usuário</label>
              <input
                id="input-email"
                type="text"
                placeholder="Digite seu login"
                className="input_padrao_texto"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grupo-input">
              <label htmlFor="input-senha">Senha</label>
              <input
                id="input-senha"
                type="password"
                placeholder="Digite sua senha"
                className="input_padrao_senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <p 
                className="link-esqueci-senha"
                onClick={() => navigate('/recupera-senha')}
              >
                Esqueci minha senha
              </p>
            </div>

            {erro && (
              <div className="mensagem-erro">
                {erro}
              </div>
            )}

            <div className="acoes-login">
              <button type="submit" className="btn-principal" disabled={carregando}>
                {carregando ? 'Entrando...' : 'Entrar'}
              </button>
              <button
                type="button"
                className="btn-secundario"
                onClick={() => navigate('/cadastro')}
              >
                Criar Conta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TelaLogin;