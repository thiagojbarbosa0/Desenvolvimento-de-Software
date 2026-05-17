import { useEffect } from 'react';
import '../TelaPrincipal.css';
import MostrarLogo from '../assets/components.jsx';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

function TelaPrincipal() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/TelaLogin');
    }
  }, [navigate]);

  // Rotas
  const menus = [
    { nome: "Meu perfil", icone: "👤", rota: "/TelaPrincipal/perfil" },
    { nome: "Dashboard", icone: "🏠", rota: "/TelaPrincipal/Dashboard" },
    { nome: "Comunidade", icone: "💬", rota: "/TelaPrincipal/comunidade" },
    { nome: "Minha dieta", icone: "🍲", rota: "/TelaPrincipal/dieta" },
    { nome: "Consultor IA", icone: "🤖", rota: "/TelaPrincipal" }, // Rota raiz do painel
  ];

  // Descobre dinamicamente o nome da página ativa baseado na URL atual
  const obterPaginaAtiva = () => {
    if (location.pathname.includes('Dashboard')) return "Dashboard";
    if (location.pathname.includes('perfil')) return "Meu perfil";
    if (location.pathname.includes('comunidade')) return "Comunidade";
    if (location.pathname.includes('dieta')) return "Minha dieta";
    return "Consultor IA"; // Padrão
  };

  const paginaAtiva = obterPaginaAtiva();

  return (
    <div className='limitador_tags'>
      
      <header className="topo-logo">
        <MostrarLogo/>
        <div className='caixa_cabecalho'>
          {/* O título do cabeçalho agora muda dinamicamente de acordo com a tela! */}
          <h1>{paginaAtiva} - Sistema NutriAI</h1>
        </div>   
      </header>
      
      <div className='corpo-layout'>
        <aside className="barra_lateral">
          <nav>
            <ul>
              {menus.map((item) => (
                <li 
                  key={item.nome} 
                  className={item.nome === paginaAtiva ? "ativo" : ""}
                  onClick={() => navigate(item.rota)}
                >
                  <span className="icone">{item.icone}</span>
                  <span className="texto">{item.nome}</span>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div style={{ flex: 1, display: 'flex' }}>
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default TelaPrincipal;