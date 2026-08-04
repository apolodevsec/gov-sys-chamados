# Implementação da API de Autenticação (Auth)

Conforme os requisitos (**RF01, RF02, RF03** e **RF20 - API REST**), criaremos um módulo de autenticação baseado em Endpoints (Route Handlers do Next.js). Isso permitirá que o sistema web e futuros aplicativos móveis consumam a mesma API.

## Open Questions

> [!WARNING]
> Para o cadastro (**Registro**), os requisitos pedem: Nome, CPF, Telefone, Email e Senha. Como o Supabase envia um email de confirmação por padrão, você quer que eu **desative temporariamente a confirmação de email** (Auto-Confirm) no código para facilitar seus testes agora no MVP, ou prefere manter o fluxo real de ter que clicar no link do email? *(Se quiser manter o link, precisarei configurar a rota de callback)*.

## Proposed Changes

Criaremos as seguintes rotas dentro da pasta `src/app/api/auth`:

### 1. `POST /api/auth/register`
**Responsabilidade:** Criar um novo usuário.
- **Corpo (Payload):** `email`, `password`, `name`, `cpf` (opcional), `phone` (opcional).
- **Ação:** Chamará `supabase.auth.signUp()`, enviando `name`, `cpf` e `phone` no campo `options.data` para que o nosso *Trigger* (criado anteriormente) insira esses dados na tabela `profiles`.

### 2. `POST /api/auth/login`
**Responsabilidade:** Autenticar o usuário.
- **Corpo (Payload):** `email`, `password`.
- **Ação:** Chamará `supabase.auth.signInWithPassword()`. Os cookies de sessão (JWT) serão definidos automaticamente pelo utilitário `@supabase/ssr`.

### 3. `POST /api/auth/logout`
**Responsabilidade:** Encerrar a sessão.
- **Ação:** Chamará `supabase.auth.signOut()` e limpará os cookies de sessão.

### 4. `GET /api/auth/me`
**Responsabilidade:** Retornar o usuário logado atualmente.
- **Ação:** Chamará `supabase.auth.getUser()` e fará um `SELECT` na tabela `profiles` para retornar os dados completos do cidadão/atendente logado, incluindo o `role`.

### 5. `GET /api/auth/callback`
**Responsabilidade:** Rota de serviço para o Supabase.
- **Ação:** Quando um usuário clica no link de confirmação de email ou de recuperação de senha, o Supabase o redireciona para cá. Esta rota troca o código de autorização pela sessão final do usuário.

## Verification Plan

1. Criarei os arquivos de rota (`route.ts`) usando Zod para validação estrita de dados de entrada.
2. Usarei as instâncias de cliente SSR (`createServerClient`) do Supabase para garantir que os JWTs sejam gerenciados via cookies.
3. Fornecerei a lista final detalhada com exemplos práticos de como consumir cada endpoint.
