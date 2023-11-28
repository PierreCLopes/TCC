import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { Environment } from '../environment';

type ClassPermissions = {
  Editar: boolean;
  Visualizar: boolean;
  Excluir: boolean;
  Processar: boolean;
};

type ClassType = 'Pessoa' | 'Cultura' | 'Usuario' | 'Imovel' | 'Filial' | 'Documentacao' | 'Proposta';

const useUserPermissions = (classe: ClassType) => {
  const [permissions, setPermissions] = useState<ClassPermissions | null>(null);

  useEffect(() => {
    const getJWTFromStorage = () => {
      return localStorage.getItem(Environment.LOCAL_STORAGE_KEY__ACCESS_TOKEN); // Altere isso para corresponder ao local onde você armazena o JWT
    };

    const jwtToken = getJWTFromStorage();

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
          
          case 'Filial':
            classPermissions = {
              Editar: decodedToken.Filial && decodedToken.Filial.includes('Editar'),
              Visualizar: decodedToken.Filial && decodedToken.Filial.includes('Visualizar'),
              Excluir: decodedToken.Filial && decodedToken.Filial.includes('Excluir'),
              Processar: decodedToken.Filial && decodedToken.Filial.includes('Processar'),
            };
            break;
          
          case 'Documentacao':
            classPermissions = {
              Editar: decodedToken.Documentacao && decodedToken.Documentacao.includes('Editar'),
              Visualizar: decodedToken.Documentacao && decodedToken.Documentacao.includes('Visualizar'),
              Excluir: decodedToken.Documentacao && decodedToken.Documentacao.includes('Excluir'),
              Processar: decodedToken.Documentacao && decodedToken.Documentacao.includes('Processar'),
            };
            break;

          case 'Proposta':
            classPermissions = {
              Editar: decodedToken.Proposta && decodedToken.Proposta.includes('Editar'),
              Visualizar: decodedToken.Proposta && decodedToken.Proposta.includes('Visualizar'),
              Excluir: decodedToken.Proposta && decodedToken.Proposta.includes('Excluir'),
              Processar: decodedToken.Proposta && decodedToken.Proposta.includes('Processar'),
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
