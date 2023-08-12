import React, {useState, useEffect, useCallback, useMemo} from "react";
import './styles.css';
import {FiFileMinus, FiCornerDownLeft} from 'react-icons/fi'
import {Link, useParams, useNavigate} from 'react-router-dom';
import api from '../../services/api';

export default function ExcluirEstado(){
  const {sigla} = useParams();
  const [nome, setNome] = useState('');
  const navigate = useNavigate();
  const [load,setLoad] = useState(false)

  const token =  localStorage.getItem('token');
  const authorization = useMemo(() => ({
    headers: {
      Authorization: `Bearer ${token}`
    }
  }), [token]);

  const loadEstado = useCallback(async () => {
    try {
      const response = await api.get('Estado/'+sigla, authorization);
      setNome(response.data.nome);
    } catch(error) {
      alert('Erro ao buscar estado ' + error);
      navigate('/estados');
    }
  }, [sigla, authorization, setNome, navigate]);

  useEffect(() => {
    if(!load){
      loadEstado();
      setLoad(true);
    }
  },[setLoad,load,loadEstado])

  async function deleteEstado(){
    
    try{
      await api.delete('Estado/'+sigla,authorization)
    }catch(error){
      alert('Erro ao excluir estado ' +error);
    }

    navigate('/estados');

  }

  return(
    <div  className="novo-estado-container">
      <div className="content">
        <section className="form">
          <FiFileMinus size={105} color="#17202a" />
          <h1>Excluir estado</h1>
          <Link className="back-link" to="/estados">
            <FiCornerDownLeft size={105} color="#17202a" />
          </Link>
        </section>
        <div className="formExibir">
          <h1>{sigla} - {nome}</h1>
          <button className="button" onClick={deleteEstado}>Excluir</button>
        </div>
      </div>
    </div>
  );
}