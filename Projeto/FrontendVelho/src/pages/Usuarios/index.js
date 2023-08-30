import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';
import logoEstado from '../../assets/estado.png';
import { FiXCircle, FiEdit, FiTrash } from 'react-icons/fi'
import api from '../../services/api';
import GestaoPermissao from "../../tecnologia/GestaoPermissao";

export default function Usuarios() {
  const [valorPesquisa, setValorPesquisa] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  const login = localStorage.getItem('email');
  const token = localStorage.getItem('token');

  const authorization = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []); // Executa apenas uma vez ao montar o componente

  async function carregarUsuarios() {
    try {
      let url = 'Auth/usuarios';
      if (valorPesquisa.length >= 1) {
        url = `Estado/Pesquisa?valor=${valorPesquisa}`;
      }

      const response = await api.get(url, authorization);
      setUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  }

  async function logout() {
    try {
      console.log('entrou');
      localStorage.clear();
      localStorage.setItem('token', '');
      authorization.headers = '';
      navigate('/');
    } catch (error) {
      console.error('Não foi possível efetuar logout:', error);
    }
  }

  async function pesquisa() {
    try {
      carregarUsuarios();
    } catch (error) {
      console.error('Erro ao efetuar a pesquisa:', error);
    }
  }

  return (
    <div className="usuario-container">
      <header>
        <img src={logoEstado} alt="Cadastro" />
        <span>Bem-Vindo, <strong>{login}</strong></span>
        <Link className="button" to="novo">Novo Estado</Link>
        <button onClick={logout} type="button">
          <FiXCircle size={35} color="#17202a" />
        </button>
      </header>
      <form>
        <input
          type="text"
          name="valorPesquisa"
          placeholder="Informe"
          onChange={e => setValorPesquisa(e.target.value)}
        />
        <button
          type="button"
          className="button"
          onClick={pesquisa}
        >
          Pesquisar
        </button>
      </form>
      <h1>Relação de Usuários</h1>

      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Sigla</th>
            <th>Nome</th>
            <th className="thOpcoes">Opções</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.email}</td>
              <td className="tdOpcoes">
                <Link to={`alterar/${usuario.id}`}>
                  <button type="button">
                    <FiEdit size="25" color="#17202a" />
                  </button>
                </Link>{" "}
                <GestaoPermissao permissoes={['Excluir']} modulo={'Usuario'}>
                  <Link to={`excluir/${usuario.id}`}>
                    <button type="button">
                      <FiTrash size="25" color="#17202a" />
                    </button>
                  </Link>
                </GestaoPermissao>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}