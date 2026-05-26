import '../TelaLogin.css';
import { MostrarLogoEstendido } from '../../../assets/components.jsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../../../services/api.js';

function TelaCadastro() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');

    if (!nome || !email || !senha || !confirmar) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (senha !== confirmar) {
      setErro('As senhas não coincidem.');
      return;
    }
    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setCarregando(true);
    try {
      await api.post('/auth/cadastro', {
        name: nome,
        email,
        password: senha,
      });
      navigate('/tela-login');
    } catch (err) {
      if (err.response?.status === 409) {
        setErro('Este e-mail já está cadastrado.');
      } else {
        setErro('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <MostrarLogoEstendido />
      <div id='TelaLogin'>
        <div id='formulario_login'>
          <form onSubmit={handleCadastro}>
            <div><h2>Criar conta</h2></div>

            <p>Nome completo</p>
            <input
              type='text'
              className='input_padrao input_login'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <p>E-mail</p>
            <input
              type='email'
              className='input_padrao input_login'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <p>Senha</p>
              <input
                type='password'
                className='input_padrao input_login'
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>

            <div>
              <p>Confirmar senha</p>
              <input
                type='password'
                className='input_padrao input_login'
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
              />
            </div>

            {erro && (
              <p style={{ color: 'red', fontSize: '14px', margin: '0' }}>
                {erro}
              </p>
            )}

            <div className='acoes'>
              <button type='submit' disabled={carregando}>
                {carregando ? 'Criando conta...' : 'Criar conta'}
              </button>
              <button
                type='button'
                onClick={() => navigate('/tela-login')}
              >
                Já tenho conta
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default TelaCadastro;