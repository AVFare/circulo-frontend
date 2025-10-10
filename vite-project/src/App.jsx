import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import MainLayout from './layouts/MainLayout.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* rutas q cualkq persona tiene acceso */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        
        <Route element={<MainLayout />}>
          <Route path="/inicio" element={<HomePage />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}