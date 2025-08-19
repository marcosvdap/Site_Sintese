import Home from "./pages/home";
import Catalogo from "./pages/Catalogo";
import Admin from "./pages/admin";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function AppRoutes() {
  return (
    <BrowserRouter>   
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/catalogo" element={<Catalogo />}></Route>
        <Route path="/admin" element={<Admin />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;