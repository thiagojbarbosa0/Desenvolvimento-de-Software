import { useState } from 'react';
import './MinhaDieta.css';

function MinhaDieta() {
  const [abaAtiva, setAbaAtiva] = useState('Hoje');

  const [refeicoes, setRefeicoes] = useState([
    {
      id: 1,
      imagemEstatica: 'Café da Manhã dinâmico.png',
      titulo: 'Iogurte natural com frutas e aveia',
      descricao: ['350ml de iogurte natural', '2x morangos', '6x uvas', '15g de aveia'],
      calorias: '340 kcal'
    },
    {
      id: 2,
      imagemEstatica: 'Almoço estático.png',
      titulo: 'Frango grelhado + arroz integral + brócolis',
      descricao: ['250g de frango grelhado', '300g de arroz integral', '120g de brócolis', 'sal a gosto'],
      calorias: '512 kcal'
    },
    {
      id: 3,
      imagemEstatica: 'Jantar estático.png',
      titulo: 'Sopa leve de legumes',
      descricao: ['100g de chuchu', '100g de cenoura', '80g de brócolis', '60g de cebola'],
      calorias: '280 kcal'
    },
    {
      id: 4,
      imagemEstatica: 'Lanche estático.png',
      titulo: 'Banana com aveia',
      descricao: ['2x bananas fatiadas', '10g de aveia'],
      calorias: '110 kcal'
    },
    {
      id: 5,
      imagemEstatica: 'Ceia estático.png',
      titulo: 'Chá de hortelã',
      descricao: ['200 ml de água', '2 folhas de hortelã'],
      calorias: '12 kcal'
    }
  ]);

  return (
    <div className="dieta-container">
      <div className="dieta-abas-container">
        <button className={`dieta-aba ${abaAtiva === 'Refeições' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('Refeições')}>Refeições</button>
        <button className={`dieta-aba ${abaAtiva === 'Hoje' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('Hoje')}>Hoje</button>
        <button className={`dieta-aba ${abaAtiva === 'Esta semana' ? 'ativa' : ''}`} onClick={() => setAbaAtiva('Esta semana')}>Esta semana</button>
      </div>
  
      <div className="dieta-grid-refeicoes">
        {refeicoes.map((item) => {
          const ehDinamico = item.imagemEstatica.endsWith('dinâmico.png');

          return (
            <div key={item.id} className="dieta-card-misto">
              {/* Imagem que serve de plano de fundo do card */}
              <img src={`/Images/${item.imagemEstatica}`} alt={item.titulo} className="dieta-card-bg" />
              
              {ehDinamico && (
                <div className="dieta-card-overlay-conteudo">
                  <div className="dieta-dinamica-div">
                    {item.descricao.map((linha, index) => (
                      <p key={index}>{linha}</p>
                    ))}
                  </div>
                  <span className="dieta-dinamica-calorias">{item.calorias}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MinhaDieta;