# mirante-da-lagoa-WEB

Frontend do sistema de gestão do condomínio Mirante da Lagoa - Saquarema/RJ.

## Tecnologias

- Angular 21 (NgModule, não standalone)
- TypeScript 5.9
- RxJS
- Font Awesome Free
- Vitest (testes unitários)

## Como executar

### 1. Instalar dependências

```bash
cd mirante-da-lagoa-WEB
npm install
```

### 2. Iniciar servidor de desenvolvimento

```bash
ng serve
```

Acesse `http://localhost:4200/`.

### 3. Build de produção

```bash
ng build --configuration=production
```

## Funcionalidades principais

- Login com JWT e controle de acesso por perfil (ADMIN, SÍNDICO, PORTARIA, FUNCIONÁRIO, MORADOR)
- Dashboard com acesso rápido aos módulos permitidos para cada perfil
- Módulos de moradores, funcionários, compromissos, eventos e obrigações trabalhistas
- Listagens responsivas em formato de cards
- Modal de detalhes reutilizável para visualização de registros
- **Gerenciamento de percentuais de encargos trabalhistas** (`/parametros`)
  - Tela exclusiva para ADMIN configurar percentuais da CLT
- **Cálculo automático de encargos no cadastro de funcionários**
  - Ao informar salário e regime CLT, os valores de INSS patronal, FGTS, IRRF, benefícios e provisões são preenchidos automaticamente

## Estrutura de pastas

```
src/app/
  auth/           # Login e autenticação
  core/           # Serviços, modelos, guards e interceptors
  dashboard/      # Dashboard e menu
  funcionarios/   # Cadastro e listagem de funcionários
  compromissos/   # Compromissos e agendamentos
  obrigacoes/     # Obrigações trabalhistas
  moradores/      # Cadastro de moradores
  eventos/        # Eventos do condomínio
  parametros/     # Administração de percentuais de encargos
  shared/         # Componentes e módulos compartilhados
```

## Comandos úteis

```bash
# Servidor de desenvolvimento
ng serve

# Build de desenvolvimento
ng build --configuration=development

# Build de produção
ng build --configuration=production

# Testes unitários
ng test

# Gerar novo componente
ng generate component nome-do-componente
```

## Integração com a API

O frontend consome a API do projeto `mirante-da-lagoa-API`. A URL base está configurada em `src/environments/environment.ts` (padrão: `http://localhost:8080`).
