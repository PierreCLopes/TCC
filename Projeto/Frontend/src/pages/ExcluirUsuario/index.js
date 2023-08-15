import React, {useState, useEffect, useCallback, useMemo} from "react";
import './styles.css';
import {FiFileMinus, FiCornerDownLeft} from 'react-icons/fi'
import {Link, useParams, useNavigate} from 'react-router-dom';
import api from '../../services/api';

export default function ExcluirUsuario(){
  const {id} = useParams();
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [load,setLoad] = useState(false)

  const token =  localStorage.getItem('token');
  const authorization = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`
    }
  }), [token]);

  const loadUsuario = useCallback(async () => {
    try {
      const response = await api.get('Auth/usuario/' + id, authorization);
      setEmail(response.data.Email);
    } catch(error) {
      alert('Erro ao buscar usuario ' + error);
      navigate('/usuarios');
    }
  }, [id, authorization, setEmail, navigate]);

  useEffect(() => {
    if(!load){
      loadUsuario();
      setLoad(true);
    }
  },[setLoad,load,loadUsuario])

  async function deleteUsuario(){
    
    try{
      await api.delete('Auth/usuario/' + id, authorization)
    }catch(error){
      alert('Erro ao excluir usuario ' +error);
    }

    navigate('/usuarios');

  }

  return(
    <div  className="novo-usuario-container">
      <div className="content">
        <section className="form">
          <FiFileMinus size={105} color="#17202a" />
          <h1>Excluir usuario</h1>
          <Link className="back-link" to="/usuarios">
            <FiCornerDownLeft size={105} color="#17202a" />
          </Link>
        </section>
        <div className="formExibir">
          <h1>{id} - {email}</h1>
          <button className="button" onClick={deleteUsuario}>Excluir</button>
        </div>
      </div>
    </div>
  );
}