import React, {useState, useMemo} from "react";
import './styles.css';
import {FiFilePlus, FiCornerDownLeft} from 'react-icons/fi';
import {Link, useNavigate} from 'react-router-dom';
import api from '../../services/api';

export default function NovoUsuario(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const token =  localStorage.getItem('token');
  const authorization = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`
    }
  }), [token]);

  async function postUsuario(event){

    console.log("Entrou");

    const data = {
      email,
      password,
      confirmPassword
    }

    try{
      await api.post('Auth/registrar', data, authorization);
    }catch(error){
      alert('Erro ao registrar usuário ' + error);
    }

    navigate('/usuarios');
  }

  return(
    <div  className="novo-usuario-container">
      <div className="content">
        <section className="form">
          <FiFilePlus size={105} color="#17202a" />
          <h1>Novo estado</h1>
          <Link className="back-link" to="/usuarios">
            <FiCornerDownLeft size={105} color="#17202a" />
          </Link>
        </section>
        <form onSubmit={postUsuario}>
          <input placeholder="Email" onChange={e => setEmail(e.target.value)}/>
          <input placeholder="Password" onChange={e => setPassword(e.target.value)}/>
          <input placeholder="Confirm password" onChange={e => setConfirmPassword(e.target.value)}/>
          <button className="button" type="submit">Salvar</button>
        </form>
      </div>
    </div>
  );
}