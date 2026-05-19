import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TelaInicial from './pages/TelaInicial.jsx';
import TelaLogin from './pages/TelaLogin.jsx';
import TelaCadastro from './pages/TelaCadastro.jsx';
import TelaPrincipal from './pages/TelaPrincipal.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ConsultorIA from './pages/ConsultorIA.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<TelaInicial />} />
        <Route path='/TelaLogin' element={<TelaLogin />} />
        <Route path='/cadastro' element={<TelaCadastro />} />
        <Route path='/TelaPrincipal' element={<TelaPrincipal />} >
          <Route index element={<ConsultorIA />} />
          <Route path='Dashboard' element={<Dashboard />} />  
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;