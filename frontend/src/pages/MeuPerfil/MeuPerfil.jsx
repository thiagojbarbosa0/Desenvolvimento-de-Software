import './MeuPerfil.css';
import { useState, useEffect } from 'react';
import { api } from '../../services/api'; // Certifique-se de que o caminho do seu api.js está correto aqui

function MeuPerfil() {
  const [dados, setDados] = useState({
    nome: 'Carregando...',
    idade: 25,
    peso: 70,
    altura: 170,
    sexo: 'Masculino',
    nivelAtividade: 'Moderado'
  });
  
  const [mensagem, setMensagem] = useState('');

  // Busca o ID do usuário que foi salvo no localStorage na hora do login
  const userId = localStorage.getItem('user_id'); 
  const userToken = localStorage.getItem('token'); 
  // Caso seu login salve o nome direto no localStorage, use se necessário:
  const userNameSaved = localStorage.getItem('name');

  useEffect(() => {
    async function carregarDadosPerfil() {
      if (!userId) {
        setDados(prev => ({ ...prev, nome: userNameSaved || 'Usuário Não Logado' }));
        return;
      }
      try {
        const response = await api.get(`/api/v1/profile/${userId}`);
        setDados(response.data);
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
        setDados(prev => ({ ...prev, nome: userNameSaved || 'Ana Souza' }));
      }
    }
    carregarDadosPerfil();
  }, [userId, userNameSaved]);

  const handleSalvar = async () => {
    if (!userId) {
      setMensagem('Erro: Usuário não identificado para salvar.');
      return;
    }
    try {
      setMensagem('Salvando...');
      await api.post(`/api/v1/profile/${userId}`, dados);
      setMensagem('Perfil atualizado com sucesso no banco de dados!');
      setTimeout(() => setMensagem(''), 3000);
    } catch (error) {
      console.error("Erro ao salvar dados do perfil:", error);
      setMensagem('Erro ao conectar com o servidor para salvar.');
    }
  };

  const calcularIMC = () => {
    if (!dados.altura) return 0;
    const alturaMetros = dados.altura / 100;
    return (dados.peso / (alturaMetros * alturaMetros)).toFixed(2);
  };

  const classificarIMC = (imc) => {
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidade';
  };

  const calcularTDEE = () => {
    const fatorAtividade = {
      'Sedentário': 1.2,
      'Leve': 1.375,
      'Moderado': 1.55,
      'Intenso': 1.725,
    };

    let tmb;
    if (dados.sexo === 'Masculino') {
      tmb = 88.36 + (13.4 * dados.peso) + (4.8 * dados.altura) - (5.7 * dados.idade);
    } else {
      tmb = 447.6 + (9.2 * dados.peso) + (3.1 * dados.altura) - (4.3 * dados.idade);
    }

    return Math.round(tmb * (fatorAtividade[dados.nivelAtividade] || 1.55));
  };

  const handleChange = (campo, valor) => {
    setDados(prev => ({ ...prev, [campo]: valor }));
  };

  const imc = calcularIMC();

  return (
    <div className="perfil-container">
      <div className="perfil-card-usuario">
        <div className="perfil-avatar">
          {dados.nome ? dados.nome.charAt(0).toUpperCase() : 'A'}
        </div>
        <div className="perfil-info-nome">
          <h2>{dados.nome}</h2>
          <span>{dados.idade} anos</span>
        </div>
      </div>

      {mensagem && <div style={{ padding: '10px', color: '#2e7d32', backgroundColor: '#e8f5e9', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>{mensagem}</div>}

      <div className="perfil-corpo">
        <div className="perfil-form">
          <div className="perfil-form-linha">
            <div className="perfil-campo">
              <label>Idade (anos):</label>
              <input
                type="number"
                value={dados.idade}
                onChange={(e) => handleChange('idade', Number(e.target.value))}
              />
            </div>
            <div className="perfil-campo">
              <label>Peso (kg):</label>
              <input
                type="number"
                value={dados.peso}
                onChange={(e) => handleChange('peso', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="perfil-form-linha">
            <div className="perfil-campo">
              <label>Sexo:</label>
              <select
                value={dados.sexo}
                onChange={(e) => handleChange('sexo', e.target.value)}
              >
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>
            </div>
            <div className="perfil-campo">
              <label>Altura (cm):</label>
              <input
                type="number"
                value={dados.altura}
                onChange={(e) => handleChange('altura', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="perfil-campo">
            <label>Nível de atividade:</label>
            <select
              value={dados.nivelAtividade}
              onChange={(e) => handleChange('nivelAtividade', e.target.value)}
            >
              <option value="Sedentário">Sedentário</option>
              <option value="Leve">Leve</option>
              <option value="Moderado">Moderado</option>
              <option value="Intenso">Intenso</option>
            </select>
          </div>
          
          <button className="perfil-botao-objetivos" onClick={handleSalvar} style={{ marginTop: '15px', backgroundColor: '#4caf50', color: 'white' }}>
            Salvar Dados no Banco
          </button>
        </div>

        <div className="perfil-metricas">
          <div className="perfil-card-metrica">
            <span className="perfil-metrica-titulo">Índice de Massa Corporal (IMC)</span>
            <span className="perfil-metrica-valor">{imc}</span>
            <span className="perfil-metrica-legenda">{classificarIMC(imc)}</span>
          </div>

          <div className="perfil-card-metrica">
            <span className="perfil-metrica-titulo">Gasto energético diário (TDEE)</span>
            <span className="perfil-metrica-valor">{calcularTDEE()}</span>
            <span className="perfil-metrica-legenda">Kcal por dia</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MeuPerfil;