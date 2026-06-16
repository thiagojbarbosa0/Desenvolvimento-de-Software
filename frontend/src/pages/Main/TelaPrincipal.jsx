import { useEffect } from 'react';
import './TelaPrincipal.css';
import MostrarLogo, { HeaderPagina } from '../../assets/components.jsx';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

function TelaPrincipal() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/tela-login');
    }
  }, [navigate]);

  const menus = [
    { nome: "Meu perfil", icone: "person", rota: "/tela-principal/perfil" },
    { nome: "Dashboard", icone: "check", rota: "/tela-principal/dashboard" },
    { nome: "Comunidade", icone: "groups", rota: "/tela-principal/comunidade" },
    { nome: "Minha dieta", icone: "favorite", rota: "/tela-principal/dieta" },
    { nome: "Consultor IA", icone: "comment", rota: "/tela-principal" },
  ];

  const handleLogout = () => {
    // 1. Limpa o histórico específico do usuário antes de deslogar
    const userId = localStorage.getItem('user_id');
    if (userId) {
      localStorage.removeItem(`chat_historico_${userId}`);
    }
    
    // 2. Remove tokens e redireciona
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    navigate('/tela-login');
  };

  const obterPaginaAtiva = () => {
    if (location.pathname.includes('dashboard')) return "Dashboard";
    if (location.pathname.includes('perfil')) return "Meu perfil";
    if (location.pathname.includes('comunidade')) return "Comunidade";
    if (location.pathname.includes('dieta')) return "Minha dieta";
    return "Consultor IA";
  };

  const paginaAtiva = obterPaginaAtiva();

  return (
    <>
      {location.pathname.includes('/dieta') ? (
        <div className="logo-flutuante">
          <MostrarLogo />
        </div>
      ) : (
        <div className="topo">
          <MostrarLogo />
          <HeaderPagina titulo={paginaAtiva} />
        </div>
      )}

      <div className="limitador_tags">
        <div className="corpo-layout">
          <aside className={`barra_lateral ${location.pathname.includes('/dieta') ? 'barra_lateral-com-logo' : ''}`}>
            <nav className="nav-menu">
              <ul>
                {menus.map((item) => (
                  <li
                    key={item.nome}
                    className={item.nome === paginaAtiva ? 'ativo' : ''}
                    onClick={() => navigate(item.rota)}
                  >
                    <span className="icone material-symbols-outlined">{item.icone}</span>
                    <span className="texto">{item.nome}</span>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="container-sair">
              <button onClick={handleLogout} className="botao-sair">
                <span className="icone material-symbols-outlined">logout</span>
                <span className="texto">Sair</span>
              </button>
            </div>
          </aside>

          <div className="area-conteudo">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}

export default TelaPrincipal;