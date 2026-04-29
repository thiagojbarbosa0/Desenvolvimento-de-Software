import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import TelaInicial from './pages/TelaInicial.jsx';
import TelaLogin from './pages/TelaLogin.jsx';
import TelaPrincipal from './pages/TelaPrincipal.jsx';

function App() {
return(
<BrowserRouter>
  <Routes>
    <Route path='/' element={<TelaInicial/>}/>
    <Route path='/TelaLogin' element={<TelaLogin/>}/>
    <Route path='TelaPrincipal' element={<TelaPrincipal/>}></Route>
  </Routes>
</BrowserRouter>
);
}

export default App;
