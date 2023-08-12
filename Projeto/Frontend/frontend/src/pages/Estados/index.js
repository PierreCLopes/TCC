import React, {useState, useEffect, useMemo} from "react";
import {Link} from 'react-router-dom';
import './styles.css';
import logoEstado from '../../assets/estado.png';
import {FiXCircle, FiEdit, FiTrash} from 'react-icons/fi'
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Estados(){
  const [valorPesquisa, setValorPesquisa] = useState('');
  const [estados, setEstados] = useState([]);
  const navigate = useNavigate();

  const login =  localStorage.getItem('login');
  const token =  localStorage.getItem('token');

  const authorization = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`
    }
  }), [token]);

  useEffect(() => {
    if(estados.length <= 0){
      api.get('Estado', authorization)
      .then(
        response => {setEstados(response.data);
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
          response => {setEstados(response.data);
          },token)
      }else{
        api.get('Estado', authorization)
        .then(
          response => {setEstados(response.data);
          },token)
      }
    }catch(error){
      alert('Não foi possível efetuar a pesquisa' + error);
    }
  }

  return(
    <div className="estado-container">
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
      <h1>Relação de Estados</h1>

      <table className='table table-bordered'>
        <thead>
          <tr>
            <th>Sigla</th>
            <th>Nome</th>
            <th className="thOpcoes">Opções</th>
          </tr>

          {estados.map(estado => (
            <tr key={estado.sigla}>
              <td>{estado.sigla}</td>
              <td>{estado.nome}</td>
              <td className="tdOpcoes">
                <Link to={`alterar/${estado.sigla}`}>
                  <button type="button">
                    <FiEdit size="25" color="#17202a" />
                  </button>
                </Link> {" "}
                <Link to={`excluir/${estado.sigla}`}>
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