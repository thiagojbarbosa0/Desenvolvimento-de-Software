import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MostrarLogo, { CardAjudaShell } from '../../../assets/components.jsx';
import './RecuperaSenha.css';
// import { api } from '../../../services/api.js'; // TODO: descomentar quando o back estiver pronto

function RecuperaSenha() {
  // ===================================================================
  // TODO (BACK): O link enviado por email deve apontar para
  // /recupera-senha?token=XYZ — esse token é gerado pelo back na
  // rota de "solicitar recuperação" e validado na rota de "redefinir senha".
  //
  // Se a URL tiver ?token=..., assumimos que o usuário clicou no link
  // do email e pulamos direto pra Etapa 3 (definir nova senha).
  // Se não tiver token, começa na Etapa 1 (pedir email).
  // ===================================================================
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [etapa, setEtapa] = useState(token ? 3 : 1);

  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');

  // Regex: mínimo 6 dígitos, somente números
  const regexSenhaNumerica = /^\d{6,}$/;

  // ===================================================================
  // ETAPA 1 -> 2: Usuário pede recuperação digitando o email
  // ===================================================================
  const handleEnviarEmail = async () => {
    setErro('');

    // TODO (BACK): criar rota POST /auth/recuperar-senha
    // - Recebe: { email }
    // - O back deve:
    //   1. Verificar se existe usuário com esse email
    //      (se não existir, recomenda-se responder sucesso genérico
    //       mesmo assim, por segurança - evita "enumeração de emails")
    //   2. Gerar um token único (ex: JWT ou string aleatória) com
    //      tempo de expiração (ex: 1 hora)
    //   3. Salvar esse token associado ao usuário (ex: coluna no banco
    //      ou tabela separada "password_reset_tokens")
    //   4. Enviar um email para o usuário com um link no formato:
    //      https://seusite.com/recupera-senha?token=TOKEN_GERADO
    //
    // try {
    //   await api.post('/auth/recuperar-senha', { email });
    // } catch (err) {
    //   setErro('Não foi possível enviar o email. Tente novamente.');
    //   return;
    // }

    setEtapa(2);
  };

  // ===================================================================
  // ETAPA 3: Usuário já clicou no link do email (tem token na URL)
  // e está definindo a nova senha
  // ===================================================================
  const handleAlterarSenha = async () => {
    setErro('');

    // ===================================================================
    // VALIDAÇÃO DE SENHA: mínimo 6 dígitos, somente números
    // TODO (BACK): validar também no backend que novaSenha
    // segue o padrão /^\d{6,}$/ (mínimo 6 dígitos numéricos),
    // rejeitando a requisição com erro 400 caso não siga.
    // ===================================================================
    if (!regexSenhaNumerica.test(novaSenha)) {
      setErro('A senha deve ter no mínimo 6 dígitos numéricos (somente números).');
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    if (!token) {
      // TODO (BACK opcional / FRONT): tratar caso o usuário chegue na
      // etapa 3 sem token (ex: acessou /recupera-senha?token= vazio,
      // ou o token expirou e foi removido da URL manualmente).
      // Sugestão: mostrar mensagem e botão para voltar à Etapa 1.
      setErro('Link inválido. Solicite a recuperação novamente.');
      return;
    }

    // TODO (BACK): criar rota POST /auth/redefinir-senha
    // - Recebe: { token, novaSenha }
    // - O back deve:
    //   1. Buscar o token salvo (mesmo da etapa anterior)
    //   2. Verificar se o token existe, é válido e não expirou
    //      - Se inválido/expirado: retornar erro (ex: 400/401)
    //      - Se válido: identificar a qual usuário pertence
    //   3. Atualizar a senha do usuário (com hash, ex: bcrypt)
    //   4. Invalidar/apagar o token usado (não pode ser reutilizado)
    //
    // try {
    //   await api.post('/auth/redefinir-senha', { token, novaSenha });
    //   setErro('');
    //   navigate('/tela-login', { state: { mensagem: 'Senha alterada com sucesso! Faça login novamente.' } });
    // } catch (err) {
    //   setErro('Link inválido ou expirado. Solicite a recuperação novamente.');
    // }

    // --- Simulação temporária (REMOVER quando back estiver pronto) ---
    navigate('/tela-login', { state: { mensagem: 'Senha alterada com sucesso! Faça login novamente.' } });
  };

  // ===================================================================
  // Filtra a digitação para aceitar apenas números nos campos de senha
  // ===================================================================
  const handleSenhaChange = (setter) => (e) => {
    const apenasNumeros = e.target.value.replace(/\D/g, '');
    setter(apenasNumeros);
  };

  return (
    <>
      <MostrarLogo />
      <CardAjudaShell titulo="Ajuda">

        {/* ===================== ETAPA 1: PEDIR EMAIL ===================== */}
        {etapa === 1 && (
          <>
            <p>Digite seu email para receber uma mensagem de recuperação de conta</p>
            <input
              type="email"
              className="card-ajuda-input"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {erro && <p className="card-ajuda-erro">{erro}</p>}
            <button className="card-ajuda-botao" onClick={handleEnviarEmail}>
              Enviar
            </button>
          </>
        )}

        {/* ===================== ETAPA 2: AGUARDANDO CONFIRMAÇÃO ===================== */}
        {etapa === 2 && (
          <div className="card-ajuda-mensagem-central">
            <p>Email enviado</p>
            <p>Aguardando confirmação</p>

            {/*
              TODO (UX opcional): essa tela fica "parada" aqui até o
              usuário sair e clicar no link do email (que abre uma
              NOVA aba já na Etapa 3, via ?token=...).
              Pode ser interessante adicionar aqui:
              - Um botão "Reenviar email" (chama handleEnviarEmail de novo)
              - Um link "Já cliquei, mas não fui redirecionado" -> volta pra Etapa 1
            */}
          </div>
        )}

        {/* ===================== ETAPA 3: NOVA SENHA ===================== */}
        {etapa === 3 && (
          <>
            {erro && <p className="card-ajuda-erro">{erro}</p>}

            <div className="card-ajuda-campo">
              <label>Crie uma nova senha</label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                className="card-ajuda-input"
                value={novaSenha}
                onChange={handleSenhaChange(setNovaSenha)}
              />
            </div>

            <div className="card-ajuda-campo">
              <label>Confirme sua senha</label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                className="card-ajuda-input"
                value={confirmarSenha}
                onChange={handleSenhaChange(setConfirmarSenha)}
              />
            </div>

            <button className="card-ajuda-botao" onClick={handleAlterarSenha}>
              Alterar
            </button>
          </>
        )}

      </CardAjudaShell>
    </>
  );
}

export default RecuperaSenha;