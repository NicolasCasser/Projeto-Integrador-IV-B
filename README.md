# Projeto Integrador: Gestão de Alunos (API REST)

Este repositório contém a entrega do Projeto Integrador IV-B. O sistema apresenta uma arquitetura baseada em serviços REST para o gerenciamento de alunos.

A solução é composta por um Back-end em **Node.js/Express** utilizando **TypeORM** para a persistência de dados no **MySQL**, e um Front-end que consome a API para realizar operações de leitura e escrita (CRUD).

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

- **Back-end:** Node.js, Express.js e TypeORM 
- **Banco de Dados:** MySQL
- **Front-end:** HTML5, TailwindCSS e JavaScript 

## 🚀 Pré-requisitos

Para executar a aplicação, você precisará apenas de:
* **Node.js** (Versão 18 ou superior)
* **MySQL** (Rodando localmente ou via XAMPP/Docker)

---

## 📝 Guia de Instalação e Execução

A aplicação foi desenvolvida para configurar o banco de dados automaticamente.

### 1. Clonar o Repositório 

```bash
git clone https://github.com/NicolasCasser/Projeto-Integrador-IV-B.git
```

### 2. Instalar Dependências 📦

```bash
npm install
```

### 3. Configurar as variáveis de ambiente ⚙️
- Na raiz do projeto, localize o arquivo ```.env.example```.

- Duplique este arquivo e renomeie a cópia para ```.env```.

- Preencha o arquivo ```.env``` com as credenciais do seu MySQL (usuário e senha).
    - Nota: Não é necessário criar o banco manualmente. A aplicação fará isso.

### 4. Iniciar a Aplicação 🚀

Execute o comando para subir o servidor:

```bash
npm start
```

#### O que acontece agora:

- O sistema verificará se o banco de dados existe. Se não existir, ele será criado automaticamente.

- O TypeORM criará todas as tabelas necessárias.

- O terminal exibirá: Servidor back-end rodando em http://localhost:3001

### 5. Acessar o Sistema 🖥️

1. Abra seu navegador.
2. Acesse: http://localhost:3001/
3. A aplicação estará pronta para uso.
