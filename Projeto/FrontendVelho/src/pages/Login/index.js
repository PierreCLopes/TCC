import React, {useState} from "react";
import './styles.css';
import loginImage from '../../assets/login.png';
import api from '../../services/api';
import { Box, Button, Card, CardActions, CardContent, CircularProgress, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  async function logar(event){
    setIsLoading(true);

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

      setIsLoading(false);

    }catch(error){
      setIsLoading(false);
      alert("Dados inválidos " + error);
    }

  }

  return(
    <Box width='100vw' height='100vh' display='flex' alignItems='center' justifyContent='center'>

      <Card>
        <CardContent>
          <Box display='flex' flexDirection='column' gap={2} width={250}>
            <Typography variant='h6' align='center'>Identifique-se</Typography>

            <TextField
              fullWidth
              type='email'
              label='Email'
              value={email}
              disabled={isLoading}
              onChange={e => setEmail(e.target.value)}
            />

            <TextField
              fullWidth
              label='Senha'
              type='password'
              value={password}
              disabled={isLoading}
              onChange={e => setPassword(e.target.value)}
            />
          </Box>
        </CardContent>
        <CardActions>
          <Box width='100%' display='flex' justifyContent='center'>

            <Button
              variant='contained'
              disabled={isLoading}
              onClick={logar}
              endIcon={isLoading ? <CircularProgress variant='indeterminate' color='inherit' size={20} /> : undefined}
            >
              Entrar
            </Button>

          </Box>
        </CardActions>
      </Card>
    </Box>
  )
}