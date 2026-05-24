# projeto-auth

Frontend em Next.js 16 (App Router) que implementa autenticação via JWT consumindo dois microsserviços do monorepo.

## Como funciona

### Fluxo principal

1. O usuário acessa `/login` e preenche e-mail e senha.
2. O frontend chama `POST /api/v1/auth/login` no `progweb_ms1_user` (porta 3000).
3. O JWT recebido é salvo no `localStorage` e injetado automaticamente em todas as requisições via interceptor do Axios.
4. O usuário é redirecionado para `/dashboard`, que exibe a lista de produtos buscada em `GET /api/v1/products` no `progweb_ms2_products` (porta 3001).
5. O botão **Sair** limpa o contexto de autenticação, remove o token do `localStorage` e redireciona para `/login`.

### Pré-requisitos

- `progweb_ms1_user` rodando em `http://localhost:3000`
- `progweb_ms2_products` rodando em `http://localhost:3001`
- MySQL via Docker: `cd db && docker compose up -d`

```bash
npm install
npm run dev   # http://localhost:3001
```

---

## Endpoints consumidos

| Serviço | Método | Rota | Auth | Uso |
|---------|--------|------|------|-----|
| `progweb_ms1_user` | `POST` | `/api/v1/auth/login` | Não | Autentica e retorna JWT + dados do usuário |
| `progweb_ms2_products` | `GET` | `/api/v1/products` | Sim (Bearer) | Lista todos os produtos com categoria |

---

## Decisões técnicas

### Gerenciamento de estado de autenticação — Context API + useReducer

O estado de autenticação (`token`, `user`, `isAuthenticated`) é global via `AuthContext`. O `useReducer` gerencia as ações `LOGIN` e `LOGOUT`. O `AuthProvider` envolve toda a aplicação no `layout.tsx`.

### Injeção de token — interceptor Axios

O `AuthContext` registra um interceptor de request nos dois clientes Axios (`api` e `productsApi`). Sempre que o token muda, o interceptor é reregistrado — garantindo que todas as requisições subsequentes carreguem o header `Authorization: Bearer <token>` automaticamente.

### Hooks com React Query

Os hooks de dados usam React Query e são responsáveis **apenas por buscar e expor dados** — sem lógica de navegação ou mensagens de erro:

- **`useLogin`** — `useMutation` que chama o serviço de login. Expõe `submit`, `isPending`, `isError` e `error`.
- **`useProducts`** — `useQuery` com `queryKey: ["products-list"]` e `staleTime` de 5 minutos. Expõe `products`, `isLoading`, `isError` e `error`. O cache evita requisições repetidas ao navegar entre rotas.

### Try/catch nas páginas

O tratamento de erros e navegação fica nas páginas, não nos hooks:

- **`/login`** — o `handleSubmit` envolve o `submit` do hook num try/catch. `401` exibe "E-mail ou senha inválidos", outros erros exibem mensagem genérica.
- **`/dashboard`** — um `useEffect` observa `isError` do hook. `401` faz logout + redirect para `/login`; `403` exibe "sem permissão"; outros erros exibem mensagem genérica.

### Proteção de rota

A proteção é simples e client-side: o dashboard verifica `isAuthenticated` do `AuthContext` antes de renderizar. Se falso, exibe mensagem com botão para voltar ao login.

### Persistência do token — localStorage

O token é salvo no `localStorage` para sobreviver a recarregamentos de página. Na montagem do `AuthProvider`, o token salvo é restaurado via `useEffect`.

> **Risco de segurança:** o `localStorage` é acessível por qualquer JavaScript na página — um ataque XSS pode exfiltrar o token. Em produção, a alternativa mais segura é armazená-lo em cookie `HttpOnly`, que é inacessível ao JavaScript e enviado automaticamente pelo browser em cada requisição.

---

## Estrutura relevante

```
src/
├── app/
│   ├── layout.tsx          # ReactQueryProvider + AuthProvider
│   ├── login/page.tsx      # Formulário de login com try/catch
│   └── dashboard/page.tsx  # Lista de produtos + proteção de rota + logout
├── contexts/
│   ├── AuthContext.tsx      # Provider, interceptors Axios, login/logout
│   └── authReducer.ts      # Estado e ações de autenticação
├── hooks/
│   ├── useLogin.ts          # useMutation — login
│   └── useProducts.ts       # useQuery — listagem de produtos
├── services/
│   ├── auth.service.ts      # POST /auth/login
│   └── product.service.ts   # GET /products
├── lib/
│   ├── api.ts               # Axios para progweb_ms1_user
│   ├── productsApi.ts       # Axios para progweb_ms2_products
│   └── queryClient.tsx      # ReactQueryProvider (client component)
└── types/
    ├── auth.ts              # User, LoginRequest, LoginResponse
    └── product.ts           # Product, Category
```