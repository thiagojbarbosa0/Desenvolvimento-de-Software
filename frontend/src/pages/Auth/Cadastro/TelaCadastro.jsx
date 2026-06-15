import '../Login/TelaLogin.css';
import './TelaCadastro.css';
import MostrarLogo from '../../../assets/components.jsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../../../services/api.js';

function TelaCadastro() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [aceitaEmail, setAceitaEmail] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Regex: mínimo 6 dígitos, somente números
  const regexSenhaNumerica = /^\d{6,}$/;

  // Filtra a digitação para aceitar apenas números nos campos de senha
  const handleSenhaChange = (setter) => (e) => {
    const apenasNumeros = e.target.value.replace(/\D/g, '');
    setter(apenasNumeros);
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');

    if (!nome || !email || !senha || !confirmar) {
      setErro('Preencha todos os campos.');
      return;
    }

    // ===================================================================
    // VALIDAÇÃO DE SENHA: mínimo 6 dígitos, somente números
    // TODO (BACK): validar também no backend que password
    // segue o padrão /^\d{6,}$/ (mínimo 6 dígitos numéricos),
    // rejeitando a requisição com erro 400 caso não siga.
    // ===================================================================
    if (!regexSenhaNumerica.test(senha)) {
      setErro('A senha deve ter pelo menos 6 dígitos numéricos (somente números).');
      return;
    }

    if (senha !== confirmar) {
      setErro('As senhas não coincidem.');
      return;
    }

    if (!aceitaEmail) {
      setErro('É necessário aceitar receber o email de confirmação.');
      return;
    }

    setCarregando(true);
    try {
      // 1. Cria a conta
      await api.post('/auth/cadastro', {
        name: nome,
        email,
        password: senha,
      });

      // 2. Loga automaticamente com as credenciais recém-criadas
      // TODO (BACK): idealmente, /auth/cadastro já poderia retornar
      // o token diretamente na resposta (evitando essa segunda chamada).
      // Se isso for implementado, substituir o bloco abaixo por:
      //
      //   const { data } = await api.post('/auth/cadastro', {...});
      //   localStorage.setItem('token', data.token);
      //   localStorage.setItem('user_id', data.user_id);
      //   localStorage.setItem('user_name', data.name);
      //   navigate('/cadastro-inicial');
      //
      const { data } = await api.post('/auth/login', {
        email,
        password: senha,
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('user_name', data.name);

      navigate('/cadastro-inicial');
    } catch (err) {
      // ===================================================================
      // TODO (BACK): no caso de conflito (status 409), o backend deve
      // retornar no corpo da resposta qual campo está duplicado, ex:
      //
      //   { "field": "email", "message": "Email já cadastrado" }
      //   ou
      //   { "field": "name", "message": "Nome de usuário já em uso" }
      //
      // Isso permite diferenciar a mensagem mostrada ao usuário
      // (ver tratamento abaixo, usando err.response?.data?.field)
      // ===================================================================
      if (err.response?.status === 409) {
        const campo = err.response?.data?.field;
        if (campo === 'email') {
          setErro('Este e-mail já está cadastrado.');
        } else if (campo === 'name') {
          setErro('Este nome de usuário já está em uso.');
        } else {
          setErro('Usuário já cadastrado.');
        }
      } else {
        setErro('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <MostrarLogo />
      <div id='TelaLogin'>
        <div id='formulario_login'>
          <h1>Informações do usuário</h1>
          <form onSubmit={handleCadastro}>
            <p>Nome do Usuário</p>
            <input
              type='text'
              className='input_padrao input_login'
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <p>Digite seu e-mail</p>
            <input
              type='email'
              className='input_padrao input_login'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <p>Crie uma senha</p>
              <input
                type='password'
                inputMode='numeric'
                pattern='[0-9]*'
                className='input_padrao input_login'
                value={senha}
                onChange={handleSenhaChange(setSenha)}
              />
            </div>

            <div>
              <p>Confirme sua senha</p>
              <input
                type='password'
                inputMode='numeric'
                pattern='[0-9]*'
                className='input_padrao input_login'
                value={confirmar}
                onChange={handleSenhaChange(setConfirmar)}
              />
            </div>

            <div className='cadastro-checkbox-container'>
              <input
                type='checkbox'
                id='aceita_email'
                checked={aceitaEmail}
                onChange={(e) => setAceitaEmail(e.target.checked)}
              />
              <label htmlFor='aceita_email'>
                Aceito receber um email para a confirmação de dados
              </label>
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