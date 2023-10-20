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