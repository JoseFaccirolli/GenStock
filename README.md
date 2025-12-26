# GenStock
> Projeto de estudo para revisar e praticar o desenvolvimento de uma API com **Node.js** e **Express**.

---

## Sobre o projeto
Este projeto tem como objetivo criar uma **API simples** que realiza operações **CRUD** (Create, Read, Update, Delete) para controle de usuários e componentes.  
A aplicação simula um pequeno sistema de cadastro e login de usuários, com gerenciamento básico de estoque vinculado a cada um deles.

---

## Tecnologias utilizadas

![Node [JS]](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black)

---

## Como executar o projeto

### 1️⃣ Clonar o repositório
```bash
git clone https://github.com/seuusuario/EstudandoApi.git
cd EstudandoApi
```

### 2️⃣ Instalar as dependências
```bash
npm install
```

### 3️⃣ Configurar variáveis de ambiente
Crie um arquivo ```.env``` com as seguintes variáveis:
```bash
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=nome_do_banco
DB_CONNECTION_LIMIT=10
```
Dica: Utilize o banco de exemplo em src/db/example.sql

### 4️⃣ Iniciar o servidor
```bash
npm start
```
A API será iniciada na porta especificada (padrão: 5000).
Exemplo: http://localhost:5000

---

## Como testar o projeto
### Postman
Para visualizar os comandos de teste de cada rota, consulte a [Referência de cURLs](cURL.md).

## Documentação do projeto
[Notion - Documentação](https://www.notion.so/Documenta-o-EstudandoAPI-2cfdd60eaefc80d88f4bd0addd6b43e3?source=copy_link)
