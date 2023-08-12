import React, {useState, useMemo} from "react";
import './styles.css';
import {FiFilePlus, FiCornerDownLeft} from 'react-icons/fi';
import {Link, useNavigate} from 'react-router-dom';
import api from '../../services/api';

export default function NovoEstado(){
  const [sigla, setSigla] = useState('');
  const [nome, setNome] = useState('');
  const navigate = useNavigate();

  const token =  localStorage.getItem('token');
  const authorization = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`
    }
  }), [token]);

  async function postEstado(event){

    console.log("Entrou");

    const data = {
      sigla,
      nome
    }

    try{
      await api.post('Estado',data,authorization);
    }catch(error){
      alert('Erro ao salvar estado ' +error);
    }

    navigate('/estados');
  }

  return(
    <div  className="novo-estado-container">
      <div className="content">
        <section className="form">
          <FiFilePlus size={105} color="#17202a" />
          <h1>Novo estado</h1>
          <Link className="back-link" to="/estados">
            <FiCornerDownLeft size={105} color="#17202a" />
          </Link>
        </section>
        <form onSubmit={postEstado}>
          <input placeholder="Sigla" onChange={e => setSigla(e.target.value)} maxLength={2}/>
          <input placeholder="Nome" onChange={e => setNome(e.target.value)}/>
          <button className="button" type="submit">Salvar</button>
        </form>
      </div>
    </div>
  );
}