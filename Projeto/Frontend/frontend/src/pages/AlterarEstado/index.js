import React, {useState, useEffect, useCallback, useMemo} from "react";
import './styles.css';
import {FiFileText, FiCornerDownLeft} from 'react-icons/fi'
import {Link, useParams, useNavigate} from 'react-router-dom';
import api from '../../services/api';

export default function AlterarEstado(){
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

  async function putEstado(event){
    const data = {
      sigla,
      nome
    }

    try{
      await api.put('Estado/'+sigla,data,authorization)
    }catch(error){
      alert('Erro ao salvar estado ' +error);
    }

    navigate('/estados');

  }

  return(
    <div  className="novo-estado-container">
      <div className="content">
        <section className="form">
          <FiFileText size={105} color="#17202a" />
          <h1>Alterar estado</h1>
          <Link className="back-link" to="/estados">
            <FiCornerDownLeft size={105} color="#17202a" />
          </Link>
        </section>
        <form onSubmit={putEstado}>
          <input placeholder="Sigla" value={sigla} readOnly/>
          <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)}/>
          <button className="button" type="submit">Salvar</button>
        </form>
      </div>
    </div>
  );
}