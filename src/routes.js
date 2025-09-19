import Home from "./pages/home";
import Catalogo from "./pages/Catalogo";
import Admin from "./pages/admin";
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />

          {/* Rota protegida */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default AppRoutes;