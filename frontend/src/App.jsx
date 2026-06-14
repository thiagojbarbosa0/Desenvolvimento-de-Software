import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TelaInicial from './pages/Home/TelaInicial.jsx';
/*import TelaLogin from './pages/Auth/Login/TelaLogin.jsx';   lembrar de  modificar nas rotas também o caminho da tela de login original*/
import TelaCadastro from './pages/Auth/Cadastro/TelaCadastro.jsx';
import TelaPrincipal from './pages/Main/TelaPrincipal.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import ConsultorIA from './pages/ConsultorIA/ConsultorIA.jsx';
import MinhaDieta from './pages/MinhaDieta/MinhaDieta.jsx';
import MeuPerfil from './pages/MeuPerfil/MeuPerfil.jsx';
import Comunidade from './pages/Comunidade/Comunidade.jsx';
import RecuperaSenha from './pages/Auth/RecuperaSenha/RecuperaSenha.jsx';
import TelaLoginEstepe from './pages/Auth/Login/TelaLoginEstepe.jsx';
import TelaCadastroInicial from './pages/Auth/Cadastro/TelaCadastroInicial.jsx';
import TelaCadastroMetas from './pages/Auth/Cadastro/TelaCadastroMetas.jsx';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<TelaInicial />} />
        <Route path='/tela-login' element={<TelaLoginEstepe />} />
        <Route path='/cadastro' element={<TelaCadastro />} />
        <Route path='cadastro-inicial' element={<TelaCadastroInicial/>} />
        <Route path='/recupera-senha' element={<RecuperaSenha />} />
        <Route path='cadastro-metas' element={<TelaCadastroMetas/>} />
        <Route path='/tela-principal' element={<TelaPrincipal />} >
          <Route index element={<ConsultorIA />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='dieta' element={<MinhaDieta />} />
          <Route path='perfil' element={<MeuPerfil />} />
          <Route path='comunidade' element={<Comunidade />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;