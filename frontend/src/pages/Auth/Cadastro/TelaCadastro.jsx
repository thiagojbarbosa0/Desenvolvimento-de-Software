import MostrarLogo, { FormularioPadrao, InputPadraoTexto, InputPadraoSenha } from '../../../assets/components.jsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../../../services/api.js';
import './TelaCadastro.css';

function TelaCadastro() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [aceitaEmail, setAceitaEmail] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const regexSenhaNumerica = /^\d{6,}$/;

  const handleSenhaChange = (setter) => (e) => {
    const apenasNumeros = e.target.value.replace(/\D/g, '');
    setter(apenasNumeros);
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');

    if (!nome || !email || !senha || !confirmar) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }

    if (!regexSenhaNumerica.test(senha)) {
      setErro('A senha deve ter pelo menos 6 dígitos numéricos.');
      return;
    }

    if (senha !== confirmar) {
      setErro('As senhas digitadas não coincidem.');
      return;
    }

    if (!aceitaEmail) {
      setErro('É necessário aceitar receber o e-mail de confirmação.');
      return;
    }

    setCarregando(true);
    try {
      await api.post('/auth/cadastro', {
        name: nome,
        email,
        password: senha,
      });

      const { data } = await api.post('/auth/login', {
        email,
        password: senha,
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user_id', data.user_id);
      localStorage.setItem('user_name', data.name);

      navigate('/cadastro-inicial');
    } catch (err) {
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
    <div className="container-cadastro">
      <div className=".topo-cadastro"><MostrarLogo /></div>

      <main className="conteudo-cadastro">
        <div className="card-cadastro">
          <div className="header-card">
            <h1>Crie sua conta</h1>
            <p className="subtitulo">Preencha os dados abaixo para começar</p>
          </div>

          <FormularioPadrao onSubmit={handleCadastro}>
            <div className="grupo-input">
              <label>Nome do Usuário</label>
              <InputPadraoTexto
                placeholder="Ex: joaossilva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="grupo-input">
              <label>E-mail</label>
              <InputPadraoTexto
                type="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="grupo-input">
              <label>Crie uma senha <span className="dica-senha">(Apenas números, mínimo 6 dígitos)</span></label>
              <InputPadraoSenha
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="******"
                value={senha}
                onChange={handleSenhaChange(setSenha)}
              />
            </div>

            <div className="grupo-input">
              <label>Confirme sua senha</label>
              <InputPadraoSenha
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="******"
                value={confirmar}
                onChange={handleSenhaChange(setConfirmar)}
              />
            </div>

            <div className="cadastro-checkbox-container">
              <input
                type="checkbox"
                id="aceita_email"
                checked={aceitaEmail}
                onChange={(e) => setAceitaEmail(e.target.checked)}
              />
              <label htmlFor="aceita_email">
                Aceito receber um e-mail para a confirmação de dados
              </label>
            </div>

            {erro && <p className="mensagem-erro">{erro}</p>}

            <div className="acoes-cadastro">
              <button type="submit" className="btn-principal" disabled={carregando}>
                {carregando ? 'Criando conta...' : 'Criar conta'}
              </button>
              <button
                type="button"
                className="btn-secundario"
                onClick={() => navigate('/tela-login')}
              >
                Já tenho uma conta
              </button>
            </div>
          </FormularioPadrao>
        </div>
      </main>
    </div>
  );
}

export default TelaCadastro;