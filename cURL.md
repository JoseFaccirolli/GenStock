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
    "userPassword": "password123",
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

### 5. Autenticar Usuário (`loginUser`)
```http
POST /user/login
```

cURL
```sh
curl --location 'http://localhost:5000/user/login' \
--header 'Content-Type: application/json' \
--data-raw '{
    "userEmail": "test.mail@test.com",
    "userPassword": "password123" 
}'
```

---

## *Componentes*
Endpoints para o gerenciamento de componentes do estoque.

### 1. Criar Componente (`createComponent`)
Cadastra um novo componente no estoque.
```http
POST /component
```

cURL
```sh
curl --location 'http://localhost:5000/component' \
--header 'Content-Type: application/json' \
--data '{
    "componentName": "Hammer",
    "quantity": 50,
    "description": "Tool used to hammering",
    "fkUserCpf": "12345678901"
}'
```

### 2. Listar Componentes (`readAllComponents`)
Retorna uma lista de todos os componentes do estoque.
```http
GET /component
```

cURL
```sh
curl --location 'http://localhost:5000/component'
```

### 3. Atualizar Componente (`updateComponent`)
Atualiza dados parciais de um Component específico via ID. <br>
_OBS: Só é possivível atualizar nome e descrição_
```http
PATCH /component/:componentId
```

cURL
```sh
curl --location --request PATCH 'http://localhost:5000/component/1' \
--header 'Content-Type: application/json' \
--data '{
    "componentName": "Name Changed",
    "description": "Description Changed"
}'
```

### 4. Deletar Componente (`deleteComponent`)
Remove um componente do sistema permanentemente.
```http
DELETE /component/:componentId
```

cURL
```sh
curl --location --request DELETE 'http://localhost:5000/component/1
```

---

# *Estoque*
Endpoints para o gerenciamento da entrada e saída de componentes do estoque.

### 1. Entrada de Componente (`entry`)
Atualiza a quantidade no estoque e faz Log da movimentação
```http
PATCH /stock/entry
```

cURL
```sh
curl --location --request PATCH 'http://localhost:5000/stock/entry' \
--header 'Content-Type: application/json' \
--data '{
    "componentId": 1,
    "quantity": "50",
    "userCpf": "12345678901"
}'
```

### 2. Saída de Componente (`exit`)
Atualiza a quantidade no estoque e faz Log da movimentação
```http
PATCH /stock/exit
```

cURL
```sh
curl --location --request PATCH 'http://localhost:5000/stock/exit' \
--header 'Content-Type: application/json' \
--data '{
    "componentId": 1,
    "quantity": "50",
    "userCpf": "12345678901"
}'
```
