import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Carrinho from "./carrinho";
import Login from "./componentes/login/login";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/login" element={<Login />} />
        {/* se quiser adicionar mais rotas, pode colocar aqui */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
