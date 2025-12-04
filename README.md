# Projeto Integrador: Gestão de Alunos (API REST)

Este é o protótipo inicial para o projeto da disciplina de Projeto Integrador, focado na construção de uma arquitetura de sistemas integrada via serviços REST.

O projeto consiste em um back-end (API) feito em **Node.js/Express** que se conecta a um banco **MySQL**, e um front-end (Cliente Web) feito em **HTML/CSS/JS** que consome essa API.


## 🛠️ Tecnologias Utilizadas

- **Back-end:** Node.js, Express.js
- **Banco de Dados:** MySQL
- **Ambiente:** `dotenv` para variáveis de ambiente
- **Front-end:** HTML5, CSS (TailwindCSS) e JavaScript (Fetch API)

## 🚀 Como Rodar o Projeto

Você vai precisar do **Node.js** (v18 ou superior) e do **MySQL** (pode ser o do XAMPP) instalados em sua máquina.

### 1. Clonar o Repositório

```bash
git clone https://github.com/NicolasCasser/Projeto-Integrador-IV-B.git
```

### 2. Instalar as Dependências 📦

1. Abra um terminal na raiz do projeto.
2. Instale todas as dependências do Node.js

```bash
npm install
```

### 3. Configurar o Banco de Dados 🏦

1. Inicie seu servidor MySQL.
2. Acesse seu cliente de banco de dados.
3. Execute o script `schema.sql` (localizado na raiz do projeto). Isso criará o banco `alunos_db`, a tabela `Alunos` e inserirá dados de exemplo.

### 4. Configurar o Ambiente (Back-end) ⚙️

1. Na raiz do projeto, crie uma cópia do arquivo `.env.example` e renomeie-a para `.env`.
2. Abra o arquivo `.env` e preencha com suas credenciais do MySQL

### 5. Rodar o Servidor 🚀

1. No mesmo terminal, inicie o servidor

```bash
npm start
```

1. O terminal deve exibir a mensagem: Servidor back-end rodando em http://localhost:3000

### 6. Acessar o Site 🖥️

1. Abra seu navegador.
2. Acesse a URL: [**http://localhost:3000/**](http://localhost:3000/)
3. O site deve carregar, e a lista de alunos (vinda do banco) deve aparecer na tabela.
