import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Usuarios from "./pages/Usuarios";
import NovoUsuario from "./pages/NovoUsuario";
import AlterarUsuario from "./pages/AlterarUsuario";
import ExcluirUsuario from "./pages/ExcluirUsuario";

export default function Rotas(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Login />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/usuarios/novo" element={<NovoUsuario />} />
        <Route path="/usuarios/alterar/:id" element={<AlterarUsuario />} />
        <Route path="/usuarios/excluir/:id" element={<ExcluirUsuario />} />
      </Routes>
    </BrowserRouter>
  );
}