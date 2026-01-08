# Referência para testes
> **Dica:** Se você usa o Postman, pode importar estes comandos clicando em **Import** e colar o cURL.

---

## *Usuário*
Endpoints para o gerenciamento de usuários.

### 1. Criar Usuário (`createUser`)
Cadastra um novo usuário no sistema.
```http
POST /user
```

cURL
```sh
curl --location 'http://localhost:5000/user' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userCpf": "12345678901",
    "userEmail": "test.mail@test.com",
    "userPassword": "sTrpassword123",
    "userName": "Tester of Api"
}'
```

### 2. Listar Usuários (`readAllUsers`)
Retorna uma lista de todos os usuários cadastrados.
```http
GET /user
```

cURL
```sh
curl --location 'http://localhost:5000/user'
```

### 3. Atualizar Usuário (`updateUser`)
Atualiza dados parciais de um usuário específico via CPF.
```http
PATCH /user/:userCpf
```

cURL
```sh
curl --location --request PATCH 'http://localhost:5000/user/12345678901' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userEmail": "test.updated@teste.chage.com"
}'
```

### 4. Deletar Usuário (`deleteUser`)
Remove um usuário do sistema permanentemente.
```http
DELETE /user/:userCpf
```

cURL
```sh
curl --location --request DELETE 'http://localhost:5000/user/12345678901'
```
