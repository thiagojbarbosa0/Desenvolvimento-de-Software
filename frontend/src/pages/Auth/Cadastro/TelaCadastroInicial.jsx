import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MostrarLogo from '../../../assets/components.jsx';
import './TelaCadastroInicial.css';
// import { api } from '../../../services/api.js'; // TODO: descomentar quando o back estiver pronto

function TelaCadastroInicial() {
  const navigate = useNavigate();

  const nomeUsuario = localStorage.getItem('user_name') || 'Usuário';

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
    // Simulação temporária até integração com backend
    navigate('/cadastro-metas');
    setCarregando(false);
  };

  return (
    <div className="container-cadastro-inicial">
      <header className="topo-cadastro-inicial">
        <MostrarLogo />
      </header>

      <main className="conteudo-cadastro-inicial">
        <div className="card-cadastro-inicial">
          <div className="header-card-inicial">
            <h1>Bem-vindo, {nomeUsuario}!</h1>
            <p className="subtitulo">Precisamos de alguns dados básicos para personalizar seu plano</p>
          </div>

          <div className="formulario-inicial-grid">
            <div className="linha-dupla">
              <div className="grupo-input-inicial">
                <label>Idade <span className="unidade">(anos)</span></label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Ex: 25"
                  value={idade}
                  onChange={criarHandlerNumerico(setIdade, LIMITES.idade.max)}
                />
              </div>
              <div className="grupo-input-inicial">
                <label>Peso <span className="unidade">(kg)</span></label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Ex: 75"
                  value={peso}
                  onChange={criarHandlerNumerico(setPeso, LIMITES.peso.max)}
                />
              </div>
            </div>

            <div className="linha-dupla">
              <div className="grupo-input-inicial">
                <label>Sexo</label>
                <div className="select-wrapper">
                  <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
                    <option value="" disabled hidden>Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                  </select>
                </div>
              </div>
              <div className="grupo-input-inicial">
                <label>Altura <span className="unidade">(cm)</span></label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Ex: 175"
                  value={altura}
                  onChange={criarHandlerNumerico(setAltura, LIMITES.altura.max)}
                />
              </div>
            </div>

            <div className="grupo-input-inicial">
              <label>Nível de Atividade</label>
              <div className="select-wrapper">
                <select value={nivelAtividade} onChange={(e) => setNivelAtividade(e.target.value)}>
                  <option value="" disabled hidden>Selecione sua rotina</option>
                  <option value="Sedentário">Sedentário (Pouco ou nenhum exercício)</option>
                  <option value="Leve">Leve (Exercício leve 1-3 dias/semana)</option>
                  <option value="Moderado">Moderado (Exercício moderado 3-5 dias/semana)</option>
                  <option value="Intenso">Intenso (Exercício pesado 6-7 dias/semana)</option>
                </select>
              </div>
            </div>

            <div className={`card-imc-dinamico ${imc ? 'ativo' : ''}`}>
              <div className="imc-info">
                <span className="imc-titulo">Seu IMC Atual</span>
                {imc ? (
                  <div className="imc-resultado">
                    <span className="imc-valor">{imc}</span>
                    <span className="imc-badge">{classificarIMC(imc)}</span>
                  </div>
                ) : (
                  <span className="imc-placeholder">Preencha peso e altura para calcular</span>
                )}
              </div>
            </div>

            {erro && <p className="mensagem-erro-inicial">{erro}</p>}

            <div className="acoes-inicial">
              <button 
                type="button" 
                className="btn-inicial-continuar" 
                onClick={handleContinuar}
                disabled={carregando}
              >
                {carregando ? 'Salvando...' : 'Continuar'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TelaCadastroInicial;