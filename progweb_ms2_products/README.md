# 🛒 E-commerce Product Microservice

Este é o microsserviço de Gestão de Produtos de um sistema de E-commerce. Desenvolvido com foco em escalabilidade, segurança e manutenibilidade, ele adota uma arquitetura em camadas (Controller, Service, Repository) e utiliza padrões rigorosos de desenvolvimento com JavaScript.

## 🚀 Tecnologias e Arquitetura

* **Runtime:** Node.js
* **Framework:** Express.js
* **Linguagem:** JavaScript (ES6+)
* **ORM:** Prisma
* **Banco de Dados:** MariaDB / MySQL
* **Autenticação:** JWT (JSON Web Tokens)
* **Documentação:** Swagger (OpenAPI 3.0)

### Padrões Arquiteturais Adotados

* **Repository Pattern:** Isolamento completo das regras de banco de dados (`product.repository.js`).

* **Service Layer:** Centralização das regras de negócio e validações de segurança.

* **Fail-Fast:** Tratamento e interceptação global de erros customizados.

* **RBAC (Role-Based Access Control):** Middlewares rigorosos para controle de permissões de rotas restritas.

---

## ⚙️ Variáveis de Ambiente (.env)

Crie um arquivo `.env` na raiz do projeto contendo estritamente as variáveis abaixo para que a aplicação funcione adequadamente:

```env
PORT=
DATABASE_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
```

---

## 🛠️ Instalação e Execução

### Pré-requisitos

* Node.js (v18+ recomendado)

* Instância rodando do MariaDB ou MySQL

### Passo a Passo

1. **Clone o repositório e instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure o Banco de Dados:**
   Preencha a variável `DATABASE_URL` no seu `.env` com a string de conexão do seu banco MariaDB/MySQL.

3. **Gere as tipagens do Prisma Client:**
   Após configurar o banco e o `schema.prisma`, execute:
   ```bash
   npx prisma generate
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

O servidor será iniciado e exibirá no terminal que o banco foi conectado com sucesso.

---

## 📚 Documentação da API (Swagger)

A API possui uma documentação interativa completa. Com o servidor rodando, acesse no seu navegador:

👉 **`http://localhost:<SUA_PORTA>/api-docs`**

Através dessa interface, você pode:

* Visualizar todos os endpoints disponíveis (`/products`, `/categories`).

* Entender o formato de entrada (Body) e saída (Responses).

* Testar requisições diretamente pelo navegador utilizando o botão **Authorize** para injetar o seu token JWT.

---

## 📁 Estrutura do Projeto

```text
src/
├── @types/              # Mesclagem de tipos do TypeScript (ex: tipagem do Express req.user)
├── config/              # Inicialização de dependências externas (Prisma Client)
├── controllers/         # Recepção das requisições e envio de respostas HTTP
├── middlewares/         # Interceptadores (Autenticação, RBAC)
├── repositories/        # Camada de abstração do Banco de Dados
├── routes/              # Definição e roteamento dos endpoints da API
├── services/            # Cérebro da aplicação (Regras de negócio)
├── app.js               # Configuração do Express, middlewares globais e rotas base
├── server.js            # Entrypoint da aplicação e conexão com o banco
└── swagger.yaml         # Especificação OpenAPI da documentação
```