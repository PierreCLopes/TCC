import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Estados from "./pages/Estados";
import NovoEstado from "./pages/NovoEstado";
import AlterarEstado from "./pages/AlterarEstado";
import ExcluirEstado from "./pages/ExcluirEstado";

export default function Rotas(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Login />} />
        <Route path="/estados" element={<Estados />} />
        <Route path="/estados/novo" element={<NovoEstado />} />
        <Route path="/estados/alterar/:sigla" element={<AlterarEstado />} />
        <Route path="/estados/excluir/:sigla" element={<ExcluirEstado />} />
      </Routes>
    </BrowserRouter>
  );
}