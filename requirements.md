# Documento de Requisitos: Plataforma de Gestão de Ocorrências Urbanas

## 1. Objetivo do Sistema
Desenvolver uma plataforma web que permita aos cidadãos registrar ocorrências relacionadas à infraestrutura urbana, possibilitando que órgãos públicos recebam, organizem e acompanhem essas solicitações até sua resolução.

**Exemplos de Ocorrências:**
- Buraco na via
- Poste apagado
- Vazamento de água
- Coleta de lixo
- Mato alto
- Semáforo quebrado
- Entulho
- Árvore caída
- Boca de lobo entupida
- Pichação
- Animais mortos

---

## 2. Atores

### Cidadão
**Pode:**
- Criar chamados
- Anexar fotos
- Informar localização
- Acompanhar andamento
- Avaliar atendimento
- Receber notificações

### Atendente Municipal
**Pode:**
- Visualizar chamados
- Alterar status
- Responder cidadão
- Solicitar mais informações
- Encaminhar chamado

### Equipe Operacional
**Pode:**
- Visualizar chamados atribuídos
- Atualizar andamento
- Registrar execução do serviço
- Anexar fotos da resolução

### Administrador
**Pode:**
- Gerenciar usuários
- Gerenciar categorias
- Gerenciar setores
- Emitir relatórios
- Configurar sistema

---

## 3. Requisitos Funcionais (RF)

* **RF01 — Cadastro de Usuários:** O sistema deve permitir cadastro utilizando Nome, CPF (opcional), Email, Telefone e Senha.
* **RF02 — Login:** Permitir autenticação por Email e Senha, ou Gov.br (futuro).
* **RF03 — Recuperação de Senha:** Enviar link para redefinição de senha.
* **RF04 — Registrar Chamado:** O cidadão poderá informar título, descrição, categoria, localização, fotos e prioridade (opcional).
* **RF05 — Localização:** Permitir selecionar no mapa, utilizar GPS ou digitar endereço.
* **RF06 — Upload de Imagens:** Permitir anexar até X imagens nos formatos JPG, PNG e WEBP.
* **RF07 — Categorias:** Exemplos: Iluminação, Pavimentação, Limpeza, Água, Esgoto, Trânsito, Meio Ambiente.
* **RF08 — Status do Chamado:** Status possíveis: Aberto, Em análise, Encaminhado, Em execução, Resolvido, Cancelado.
* **RF09 — Histórico:** Registrar todas as alterações (ex: 02/08 Criado -> 03/08 Encaminhado -> 04/08 Equipe iniciou -> 05/08 Resolvido).
* **RF10 — Comentários:** Permitir comunicação entre prefeitura e cidadão no chamado.
* **RF11 — Avaliação:** Após concluído, o usuário pode avaliar com estrelas e comentário.
* **RF12 — Dashboard Administrativo:** Visualizar chamados por bairro, categoria, status, resolvidos e pendentes.
* **RF13 — Pesquisa:** Pesquisar chamados por bairro, categoria, status, período e protocolo.
* **RF14 — Relatórios:** Gerar arquivos PDF e Excel.
* **RF15 — Notificações:** Enviar notificação por email ou push (futuro) quando houver criação, mudança de status ou resolução de chamado.
* **RF16 — Protocolo:** Todo chamado recebe um número único (Ex: `#2026-000182`).
* **RF17 — Transparência Pública:** Visitantes poderão visualizar chamados públicos (localização, categoria, fotos, status) sem expor dados pessoais do criador.
* **RF18 — Evitar Duplicidade:** Ao cadastrar um novo chamado, o sistema verifica ocorrências semelhantes próximas e sugere acompanhar o existente em vez de criar outro.
* **RF19 — Moderação:** Administradores podem ocultar chamados ofensivos ou inadequados.
* **RF20 — API:** Disponibilizar API REST para integração com aplicativos móveis ou sistemas da prefeitura.

---

## 4. Requisitos Não Funcionais (RNF)

* **RNF01:** Sistema responsivo.
* **RNF02:** Compatível com Chrome, Edge, Firefox, Safari.
* **RNF03:** Tempo médio de resposta inferior a 2 segundos para operações comuns.
* **RNF04:** Senha criptografada utilizando bcrypt.
* **RNF05:** Autenticação baseada em JWT.
* **RNF06:** Toda comunicação deve utilizar HTTPS.
* **RNF07:** Logs de auditoria para ações críticas.
* **RNF08:** Backup automático diário.
* **RNF09:** Disponibilidade mínima de 99%.
* **RNF10:** Escalável para suportar milhares de chamados.
* **RNF11:** API documentada com OpenAPI/Swagger.
* **RNF12:** Código organizado em camadas (ex: Controller, Service, Repository).
* **RNF13:** Validação estrita de entradas.
* **RNF14:** Proteção contra SQL Injection, XSS, CSRF e Rate Limit.
* **RNF15:** Banco de dados relacional (Sugestão: PostgreSQL).
* **RNF16:** Arquivos armazenados em armazenamento externo (S3 ou equivalente) em produção.
* **RNF17:** Acessibilidade conforme WCAG 2.1 nível AA.

---

## 5. Regras de Negócio (RN)

* **RN01:** Todo chamado possui exatamente uma categoria.
* **RN02:** Todo chamado deve possuir uma localização válida.
* **RN03:** Somente administradores podem excluir chamados.
* **RN04:** Chamados resolvidos não podem ser editados pelo cidadão.
* **RN05:** Todo chamado deve possuir um protocolo único.
* **RN06:** Toda alteração de status gera registro no histórico do chamado.
* **RN07:** O cidadão pode cancelar apenas chamados que ainda não foram iniciados (status: Aberto).
* **RN08:** Um chamado só pode ser marcado como "Resolvido" após registro da execução pela equipe responsável.
* **RN09:** Fotos enviadas devem respeitar limite de tamanho (ex.: 10 MB por arquivo) e quantidade máxima configurável.
* **RN10:** Dados pessoais do cidadão nunca são exibidos na área pública de transparência.

---

## 6. Tecnologias Sugeridas

**Frontend**
- React
- TypeScript
- Tailwind CSS
- React Router
- React Query (TanStack Query)
- React Hook Form + Zod (validação)
- Leaflet (OpenStreetMap) ou Google Maps para geolocalização

**Backend**
- Node.js
- Next.js
- TypeScript
- Supabase
- PostgreSQL
- JWT e bcrypt
- Multer para upload de arquivos

**Infraestrutura**
- Docker e Docker Compose
- Nginx (proxy reverso)
- MinIO (desenvolvimento) / S3 (produção)
- GitHub Actions para CI/CD

---

## 7. Escopo para Protótipo (MVP - Minimum Viable Product)

Para validar a ideia e a arquitetura central do sistema antes do desenvolvimento completo, o protótipo deve focar exclusivamente no fluxo principal de ponta a ponta (Core Flow).

### Funcionalidades do Protótipo:
1. **Autenticação Básica (Simplificada):**
   - Cadastro e Login de Cidadão (Email e Senha).
   - Login de Atendente/Administrador (conta pré-configurada).
   *(Recuperação de senha e Gov.br fora do escopo do MVP).*

2. **Gestão de Chamados (Cidadão):**
   - Formulário de abertura de chamado com campos essenciais: Categoria (lista estática reduzida), Descrição, Localização (seleção simples num mapa usando Leaflet) e Upload de 1 foto.
   - Listagem "Meus Chamados" para acompanhar o status básico.

3. **Painel de Atendimento (Administrador/Atendente):**
   - Tabela/Lista de chamados recebidos.
   - Visualização dos detalhes do chamado (foto, descrição e local no mapa).
   - Capacidade de alterar o status do chamado em 3 passos simples: *Aberto -> Em Execução -> Resolvido*.

4. **Transparência Básica (Público):**
   - Uma tela inicial com um mapa geral exibindo marcadores dos chamados "Abertos" e "Em execução", sem identificar os criadores.

### Simplificações Técnicas para o Protótipo:
- **Armazenamento de Imagens:** Utilizar armazenamento local na própria máquina/servidor (disco) através do Multer, postergando a integração com MinIO/S3 para a fase final.
- **Notificações:** Simular as notificações apenas visualmente no frontend, sem integração de servidor de e-mail (SMTP) ou push real no momento.
- **Relatórios e Dashboards complexos:** Fora do escopo. Focar apenas em listar os dados brutos na tela.
