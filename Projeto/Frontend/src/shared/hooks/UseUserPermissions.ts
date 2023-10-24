import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { Environment } from '../environment';

type ClassPermissions = {
  Editar: boolean;
  Visualizar: boolean;
  Excluir: boolean;
  Processar: boolean;
};

type ClassType = 'Pessoa' | 'Cultura' | 'Usuario' | 'Imovel';

const useUserPermissions = (classe: ClassType) => {
  const [permissions, setPermissions] = useState<ClassPermissions | null>(null);

  useEffect(() => {
    const getJWTFromStorage = () => {
      return localStorage.getItem(Environment.LOCAL_STORAGE_KEY__ACCESS_TOKEN); // Altere isso para corresponder ao local onde você armazena o JWT
    };

    const jwtToken = getJWTFromStorage();

    console.log(jwtToken);
    if (jwtToken) {
      try {
        const decodedToken: Record<string, any> = jwtDecode(jwtToken);

        // Verifique as permissões com base na classe fornecida
        let classPermissions: ClassPermissions = {
          Editar: false,
          Visualizar: false,
          Excluir: false,
          Processar: false
        };

        switch (classe) {
          case 'Pessoa':
            classPermissions = {
              Editar: decodedToken.Pessoa && decodedToken.Pessoa.includes('Editar'),
              Visualizar: decodedToken.Pessoa && decodedToken.Pessoa.includes('Visualizar'),
              Excluir: decodedToken.Pessoa && decodedToken.Pessoa.includes('Excluir'),
              Processar: decodedToken.Pessoa && decodedToken.Pessoa.includes('Processar'),
            };
            break;

          case 'Cultura':
            classPermissions = {
              Editar: decodedToken.Cultura && decodedToken.Cultura.includes('Editar'),
              Visualizar: decodedToken.Cultura && decodedToken.Cultura.includes('Visualizar'),
              Excluir: decodedToken.Cultura && decodedToken.Cultura.includes('Excluir'),
              Processar: decodedToken.Cultura && decodedToken.Cultura.includes('Processar'),
            };
            break;

          case 'Usuario':
            classPermissions = {
              Editar: decodedToken.Usuario && decodedToken.Usuario.includes('Editar'),
              Visualizar: decodedToken.Usuario && decodedToken.Usuario.includes('Visualizar'),
              Excluir: decodedToken.Usuario && decodedToken.Usuario.includes('Excluir'),
              Processar: decodedToken.Usuario && decodedToken.Usuario.includes('Processar'),
            };
            break;

          case 'Imovel':
            classPermissions = {
              Editar: decodedToken.Imovel && decodedToken.Imovel.includes('Editar'),
              Visualizar: decodedToken.Imovel && decodedToken.Imovel.includes('Visualizar'),
              Excluir: decodedToken.Imovel && decodedToken.Imovel.includes('Excluir'),
              Processar: decodedToken.Imovel && decodedToken.Imovel.includes('Processar'),
            };
            break;
          // Adicione outros casos para outras classes
          default:
            break;
        }

        setPermissions(classPermissions);
      } catch (error) {
        console.error('Erro ao decodificar o JWT:', error);
      }
    } else {
      console.error('JWT não encontrado no armazenamento');
    }
  }, [classe]);

  return permissions;
};

export default useUserPermissions;
