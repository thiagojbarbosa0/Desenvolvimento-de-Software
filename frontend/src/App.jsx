import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TelaInicial from './pages/Home/TelaInicial.jsx';
import TelaLogin from './pages/Auth/Login/TelaLogin.jsx';
import TelaCadastro from './pages/Auth/Cadastro/TelaCadastro.jsx';
import TelaPrincipal from './pages/Main/TelaPrincipal.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import ConsultorIA from './pages/ConsultorIA/ConsultorIA.jsx';
import MinhaDieta from './pages/MinhaDieta/MinhaDieta.jsx';
import MeuPerfil from './pages/MeuPerfil/MeuPerfil.jsx';
import Comunidade from './pages/Comunidade/Comunidade.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<TelaInicial />} />
        <Route path='/tela-login' element={<TelaLogin />} />
        <Route path='/cadastro' element={<TelaCadastro />} />
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