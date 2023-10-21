export const formatCNPJCPF = (input: string) => {
  // Remove qualquer caractere não numérico
  const numericInput = input.replace(/\D/g, '');

  if (numericInput.length <= 11) {
    // Aplica a máscara de CPF
    if (numericInput.length <= 3) {
      return numericInput;
    } else if (numericInput.length <= 6) {
      return `${numericInput.slice(0, 3)}.${numericInput.slice(3)}`;
    } else if (numericInput.length <= 9) {
      return `${numericInput.slice(0, 3)}.${numericInput.slice(3, 6)}.${numericInput.slice(6)}`;
    } else {
      return `${numericInput.slice(0, 3)}.${numericInput.slice(3, 6)}.${numericInput.slice(6, 9)}-${numericInput.slice(9, 11)}`;
    }
  } else {
    // Aplica a máscara de CNPJ
    return `${numericInput.slice(0, 2)}.${numericInput.slice(2, 5)}.${numericInput.slice(5, 8)}/${numericInput.slice(8, 12)}-${numericInput.slice(12, 14)}`;
  }
};

export const formatCPF = (input: string) => {
  // Remove qualquer caractere não numérico
  const numericInput = input.replace(/\D/g, '');

  if (numericInput.length <= 3) {
    return numericInput;
  } else if (numericInput.length <= 6) {
    return `${numericInput.slice(0, 3)}.${numericInput.slice(3)}`;
  } else if (numericInput.length <= 9) {
    return `${numericInput.slice(0, 3)}.${numericInput.slice(3, 6)}.${numericInput.slice(6)}`;
  } else {
    return `${numericInput.slice(0, 3)}.${numericInput.slice(3, 6)}.${numericInput.slice(6, 9)}-${numericInput.slice(9, 11)}`;
  }
};

export const formatRG = (input: string) => {
  // Remove qualquer caractere não numérico
  const numericRG = input.replace(/\D/g, '');

  // Aplica a máscara de RG: XXX.XXX.XXX
  if (numericRG.length <= 3) {
    return numericRG;
  } else if (numericRG.length <= 6) {
    return `${numericRG.slice(0, 3)}.${numericRG.slice(3)}`;
  } else {
    return `${numericRG.slice(0, 3)}.${numericRG.slice(3, 6)}.${numericRG.slice(6, 9)}`;
  }
};

export const formatCEP = (input: string) => {
  // Remove qualquer caractere não numérico
  const numericInput = input.replace(/\D/g, '');

  // Verifica se a string resultante tem pelo menos 8 dígitos
  if (numericInput.length >= 8) {
    // Formata o CEP no formato "xxxxx-xxx"
    return numericInput.slice(0, 5) + '-' + numericInput.slice(5, 8);
  } else {
    // Se não tiver 8 dígitos, retorna a string numérica sem formatação
    return numericInput;
  }
}
