import jwt_decode from "jwt-decode";

const GestaoPermissao = ({ children, modulo, permissoes }) => {
  const token = localStorage.getItem("token");
  const decodedToken = jwt_decode(token);
  const permissoesUsuario = decodedToken[modulo].split(',') || [];

  if (
    permissoes.some(permissao => {
      return permissoesUsuario.includes(permissao);
    })
  ) {
    return children;
  }

  return null;
};

export default GestaoPermissao;
