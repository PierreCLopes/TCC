import React, {useState} from "react";
import './styles.css';
import loginImage from '../../assets/login.png';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  async function logar(event){
    event.preventDefault();
    const usuarioLogin = {
      email, password
    };

    try{
      const response = await api.post('Auth/login',usuarioLogin);

      localStorage.setItem('email', email);
      localStorage.setItem('token', response.data.token);
      //localStorage.setItem('expiration',response.data.expiration);

      navigate('/usuarios');

    }catch(error){
      alert("Dados inválidos " + error);
    }

  }

  return(
    <div className="login-container">
      <section className="form">
        <img src={loginImage} alt="Login" id="img1" />
        <form onSubmit={logar}>
          <h1>Controle Financeiro</h1>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}/>
          <input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)}/>
          <button className="button" type="submit">Entrar</button>
        </form>
      </section>
    </div>
  )
}