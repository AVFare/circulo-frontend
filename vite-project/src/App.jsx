import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/auth/Login.jsx";
import Register from "./views/auth/Register.jsx";
import IndexPage from "./views/IndexPage.jsx";
import ProductDetail from "./views/ProductDetail.jsx";
import MainLayout from "./Layouts/MainLayout.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* rutas publicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* rutas privadas */}
        <Route element={<MainLayout />}>
          <Route path="/inicio" element={<IndexPage />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
