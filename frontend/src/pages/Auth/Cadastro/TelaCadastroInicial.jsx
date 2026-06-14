import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MostrarLogo from '../../../assets/components.jsx';
import './TelaCadastroInicial.css';
// import { api } from '../../../services/api.js'; // TODO: descomentar quando o back estiver pronto

function TelaCadastroInicial() {
  const navigate = useNavigate();

  // Nome do usuário vem do cadastro/login (salvo no localStorage)
  const nomeUsuario = localStorage.getItem('user_name') || 'Usuário';

  // Faixas de valores válidos
  const LIMITES = {
    idade: { min: 1, max: 120 },
    peso: { min: 1, max: 300 },
    altura: { min: 50, max: 250 },
  };

  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [sexo, setSexo] = useState('');
  const [altura, setAltura] = useState('');
  const [nivelAtividade, setNivelAtividade] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // ===================================================================
  // Filtra digitação: aceita apenas números, e limita ao valor máximo
  // permitido em tempo real (impede digitar, ex: "9999")
  // ===================================================================
  const criarHandlerNumerico = (setter, max) => (e) => {
    const apenasNumeros = e.target.value.replace(/\D/g, '');

    if (apenasNumeros === '') {
      setter('');
      return;
    }

    const numero = Number(apenasNumeros);
    if (numero > max) {
      setter(String(max));
    } else {
      setter(apenasNumeros);
    }
  };

  const calcularIMC = () => {
    const alturaNum = Number(altura);
    const pesoNum = Number(peso);

    if (
      !alturaNum || !pesoNum ||
      pesoNum < LIMITES.peso.min || pesoNum > LIMITES.peso.max ||
      alturaNum < LIMITES.altura.min || alturaNum > LIMITES.altura.max
    ) {
      return null;
    }

    const alturaMetros = alturaNum / 100;
    return (pesoNum / (alturaMetros * alturaMetros)).toFixed(2);
  };

  const classificarIMC = (imc) => {
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidade';
  };

  const imc = calcularIMC();

  const handleContinuar = async () => {
    setErro('');

    if (!idade || !peso || !sexo || !altura || !nivelAtividade) {
      setErro('Preencha todas as informações para continuar.');
      return;
    }

    const idadeNum = Number(idade);
    const pesoNum = Number(peso);
    const alturaNum = Number(altura);

    // ===================================================================
    // VALIDAÇÃO DE FAIXAS NUMÉRICAS
    // TODO (BACK): validar também no backend essas mesmas faixas
    // (idade 1-120, peso 1-300kg, altura 50-250cm), rejeitando
    // a requisição com erro 400 caso algum valor esteja fora.
    // ===================================================================
    if (!Number.isFinite(idadeNum) || idadeNum < LIMITES.idade.min || idadeNum > LIMITES.idade.max) {
      setErro(`Idade deve estar entre ${LIMITES.idade.min} e ${LIMITES.idade.max} anos.`);
      return;
    }

    if (!Number.isFinite(pesoNum) || pesoNum < LIMITES.peso.min || pesoNum > LIMITES.peso.max) {
      setErro(`Peso deve estar entre ${LIMITES.peso.min} e ${LIMITES.peso.max} kg.`);
      return;
    }

    if (!Number.isFinite(alturaNum) || alturaNum < LIMITES.altura.min || alturaNum > LIMITES.altura.max) {
      setErro(`Altura deve estar entre ${LIMITES.altura.min} e ${LIMITES.altura.max} cm.`);
      return;
    }

    setCarregando(true);

    // TODO (BACK): criar rota POST /usuario/informacoes-iniciais (ou similar)
    // - Recebe: { idade, peso, sexo, altura, nivelAtividade }
    // - O back deve salvar esses dados associados ao usuário logado
    //   (identificado via token/user_id armazenado no localStorage)
    // - O back deve validar as mesmas faixas (idade 1-120, peso 1-300, altura 50-250)
    //
    // try {
    //   await api.post('/usuario/informacoes-iniciais', {
    //     idade: idadeNum,
    //     peso: pesoNum,
    //     sexo,
    //     altura: alturaNum,
    //     nivelAtividade,
    //   });
    //   navigate('/tela-principal');
    // } catch (err) {
    //   setErro('Erro ao salvar informações. Tente novamente.');
    // } finally {
    //   setCarregando(false);
    // }

    // --- Simulação temporária (REMOVER quando back estiver pronto) ---
    navigate('/tela-principal');
    setCarregando(false);
  };

  return (
    <>
      <MostrarLogo />
      <div className="cadastro-inicial-container">
        <div className="cadastro-inicial-titulo">
          <h1>Bem vindo, {nomeUsuario}!</h1>
          <p>Comece preenchendo algumas informações básicas atuais:</p>
        </div>

        <div className="cadastro-inicial-card">
          <div className="cadastro-inicial-linha">
            <div className="cadastro-inicial-campo">
              <label>Idade (anos):</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={idade}
                onChange={criarHandlerNumerico(setIdade, LIMITES.idade.max)}
              />
            </div>
            <div className="cadastro-inicial-campo">
              <label>Peso (kg):</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={peso}
                onChange={criarHandlerNumerico(setPeso, LIMITES.peso.max)}
              />
            </div>
          </div>

          <div className="cadastro-inicial-linha">
            <div className="cadastro-inicial-campo">
              <label>Sexo:</label>
              <select
                value={sexo}
                onChange={(e) => setSexo(e.target.value)}
              >
                <option value="" disabled hidden></option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>
            </div>
            <div className="cadastro-inicial-campo">
              <label>Altura (cm):</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={altura}
                onChange={criarHandlerNumerico(setAltura, LIMITES.altura.max)}
              />
            </div>
          </div>

          <div className="cadastro-inicial-campo">
            <label>Nível de atividade:</label>
            <select
              value={nivelAtividade}
              onChange={(e) => setNivelAtividade(e.target.value)}
            >
              <option value="" disabled hidden></option>
              <option value="Sedentário">Sedentário</option>
              <option value="Leve">Leve</option>
              <option value="Moderado">Moderado</option>
              <option value="Intenso">Intenso</option>
            </select>
          </div>

          <div className="cadastro-inicial-card-imc">
            <span className="cadastro-inicial-imc-titulo">Índice de Massa Corporal (IMC)</span>
            {imc && (
              <>
                <span className="cadastro-inicial-imc-valor">{imc}</span>
                <span className="cadastro-inicial-imc-legenda">{classificarIMC(imc)}</span>
              </>
            )}
          </div>
        </div>

        {erro && <p className="cadastro-inicial-erro">{erro}</p>}

        <button
          className="cadastro-inicial-botao-continuar"
          onClick={handleContinuar}
          disabled={carregando}
        >
          {carregando ? 'Salvando...' : 'Continuar'}
        </button>
      </div>
    </>
  );
}

export default TelaCadastroInicial;