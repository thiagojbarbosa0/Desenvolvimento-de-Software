import { useState } from 'react';
import './MinhaDieta.css';

function MinhaDieta() {
  const [abaAtiva, setAbaAtiva] = useState('Hoje');
  const [diaSelecionado, setDiaSelecionado] = useState(null);

  const [refeicoes] = useState([
    { id: 1, tipo: 'Cafe', imagemEstatica: 'Café da Manhã estático.png', titulo: 'Iogurte natural com frutas e aveia', descricao: ['350ml de iogurte natural', '2x morangos', '6x uvas', '15g de aveia'], calorias: '340 kcal' },
    { id: 2, tipo: 'Almoco', imagemEstatica: 'Almoço estático.png', titulo: 'Frango grelhado + arroz integral + brócolis', descricao: ['250g de frango grelhado', '300g de arroz integral', '120g de brócolis', 'sal a gosto'], calorias: '512 kcal' },
    { id: 3, tipo: 'Lanche', imagemEstatica: 'Lanche estático.png', titulo: 'Banana com aveia', descricao: ['2x bananas fatiadas', '10g de aveia'], calorias: '110 kcal' },
    { id: 4, tipo: 'Jantar', imagemEstatica: 'Jantar estático.png', titulo: 'Sopa leve de legumes', descricao: ['100g de chuchu', '100g de cenoura', '80g de brócolis', '60g de cebola'], calorias: '280 kcal' },
    { id: 5, tipo: 'Ceia', imagemEstatica: 'Ceia estático.png', titulo: 'Chá de hortelã', descricao: ['200 ml de água', '2 folhas de hortelã'], calorias: '12 kcal' }
  ]);

  return (
    <div className="dieta-container">
      <div className="dieta-abas-container">
        <button className={`dieta-aba ${abaAtiva === 'Refeições' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('Refeições')}>Refeições</button>
        <button className={`dieta-aba ${abaAtiva === 'Hoje' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('Hoje')}>Hoje</button>
        <button className={`dieta-aba ${abaAtiva === 'Esta semana' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('Esta semana')}>Esta semana</button>
      </div>
  
      {/* TELA HOJE */}
      {abaAtiva === 'Hoje' && (
        <div className="dieta-grid-refeicoes">
          {refeicoes.map((item) => {
            const ehDinamico = item.imagemEstatica.endsWith('dinâmico.png');
            return (
              <div key={item.id} className="dieta-card-misto">
                <img src={`/Images/${item.imagemEstatica}`} alt={item.titulo} className="dieta-card-bg" />
                {ehDinamico && (
                  <div className="dieta-card-overlay-conteudo">
                    <div className="dieta-dinamica-div">
                      {item.descricao.map((linha, index) => <p key={index}>{linha}</p>)}
                    </div>
                    <span className="dieta-dinamica-calorias">{item.calorias}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TELA REFEIÇÕES (Nova estrutura detalhada) */}
      {abaAtiva === 'Refeições' && (
        <div className="dieta-lista-refeicoes">
          {refeicoes.map((item) => (
            <div key={item.id} className="card-refeicao-detalhado">
              <img src={`/Images/${item.imagemEstatica}`} alt={item.titulo} />
              <div className="conteudo-card">
                <h3>{item.titulo}</h3>
                <div className="tags-nutri"><span>{item.calorias}</span></div>
                <h4>Ingredientes</h4>
                <p>{item.descricao.join(', ')}</p>
                <button className="btn-busca">BUSCAR RECEITA COMPLETA</button>
              </div>
            </div>
          ))}
        </div>
      )}
      

      {/* TELA ESTA SEMANA */}
      {abaAtiva === 'Esta semana' && (
        <div className="dieta-colunas-semanais">
          {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map(dia => (
            <div key={dia} className={`coluna-dia ${diaSelecionado && diaSelecionado !== dia ? 'opaco' : ''}`} onClick={() => setDiaSelecionado(dia === diaSelecionado ? null : dia)}>
              <h3>{dia}</h3>
              {refeicoes.map((refeicao, index) => {
                const tipoNormalizado = refeicao.tipo?.toLowerCase() || 'padrao';
                return (
                  <div key={index} className={`card-refeicao-semanal borda-${tipoNormalizado}`}>
                    <span className="card-refeicao-tipo">{refeicao.tipo.toUpperCase()}</span>
                    <p className="card-refeicao-titulo">{refeicao.titulo}</p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MinhaDieta;