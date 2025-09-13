export const validateCPF = (cpf) => {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  // Validação do dígito verificador
  let sum = 0;
  let remainder;
  
  // Primeiro dígito verificador
  for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  
  remainder = sum % 11;
  let firstDigit = (remainder < 2) ? 0 : 11 - remainder;
  
  if (firstDigit !== parseInt(cpf.charAt(9))) return false;
  
  // Segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  
  remainder = sum % 11;
  let secondDigit = (remainder < 2) ? 0 : 11 - remainder;
  
  if (secondDigit !== parseInt(cpf.charAt(10))) return false;
  
  return true;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatCPF = (cpf) => {
  cpf = cpf.replace(/\D/g, '');
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

export const formatPhone = (phone) => {
  phone = phone.replace(/\D/g, '');
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};