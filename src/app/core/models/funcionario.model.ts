export interface FuncionarioOcorrencia {
  id?: string;
  funcionarioId?: string;
  tipo: string;
  data?: string;
  descricao?: string;
  anexo?: string;
}

export interface Funcionario {
  id?: string;
  fullName: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  phone?: string;
  email?: string;
  address?: string;
  position?: string;
  department?: string;
  hireDate?: string;
  terminationDate?: string;
  salary?: number;
  workRegime?: string;
  bankAccount?: string;
  notes?: string;

  // Encargos e benefícios mensais
  inssEmployer?: number;
  fgts?: number;
  irrf?: number;
  transportAllowance?: number;
  mealAllowance?: number;
  healthInsurance?: number;
  otherBenefits?: number;

  // Provisões trabalhistas mensais
  thirteenthSalaryProvision?: number;
  vacationProvision?: number;
  vacationThirdProvision?: number;
  severanceFineProvision?: number;

  ocorrencias?: FuncionarioOcorrencia[];
}
