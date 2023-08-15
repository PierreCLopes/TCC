import React, {useState, useEffect, useMemo} from "react";
import {Link} from 'react-router-dom';
import './styles.css';
import logoEstado from '../../assets/estado.png';
import {FiXCircle, FiEdit, FiTrash} from 'react-icons/fi'
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Usuarios(){
  const [valorPesquisa, setValorPesquisa] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  const login =  localStorage.getItem('login');
  const token =  localStorage.getItem('token');

  const authorization = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`
    }
  }), [token]);

  useEffect(() => {
    if(usuarios.length <= 0){
      api.get('Auth/usuarios', authorization)
      .then(
        response => {setUsuarios(response.data);
        },token)
    }
  })

  async function logout(){
    try{
      localStorage.clear();
      localStorage.setItem('token','');
      authorization.headers = '';
      navigate('/');
    }catch(error){
      alert('Não foi possível efetuar logout' + error);
    }
  }

  async function pesquisa(){
    try{
      if(valorPesquisa.length >= 1){

        api.get('Estado/Pesquisa?valor='+valorPesquisa, authorization)
        .then(
          response => {setUsuarios(response.data);
          },token)
      }else{
        api.get('Estado', authorization)
        .then(
          response => {setUsuarios(response.data);
          },token)
      }
    }catch(error){
      alert('Não foi possível efetuar a pesquisa' + error);
    }
  }

  return(
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
        <input type="text" name="valorPesquisa" placeholder="Informe" onChange={e => setValorPesquisa(e.target.value)}/>
        <button type="button" class="button" onClick={pesquisa}>
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

          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.email}</td>
              <td className="tdOpcoes">
                <Link to={`alterar/${usuario.id}`}>
                  <button type="button">
                    <FiEdit size="25" color="#17202a" />
                  </button>
                </Link> {" "}
                <Link to={`excluir/${usuario.id}`}>
                  <button type="button">
                    <FiTrash size="25" color="#17202a" />
                  </button>
                </Link>
              </td>
            </tr>
          ))}  
        </thead>
      </table>

      
    </div>
  )
}