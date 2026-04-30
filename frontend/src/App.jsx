import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TelaInicial from './pages/TelaInicial.jsx';
import TelaLogin from './pages/TelaLogin.jsx';
import TelaCadastro from './pages/TelaCadastro.jsx';
import TelaPrincipal from './pages/TelaPrincipal.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<TelaInicial />} />
        <Route path='/TelaLogin' element={<TelaLogin />} />
        <Route path='/cadastro' element={<TelaCadastro />} />
        <Route path='/TelaPrincipal' element={<TelaPrincipal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;