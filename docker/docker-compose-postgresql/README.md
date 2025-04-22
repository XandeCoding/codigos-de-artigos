# Rodando PostgreSQL com Docker Compose + Dashboard

**Bom dia, meus amantes de banco de dados!** (sei que isso não existe, mas vamos lá — estou tentando quebrar o gelo aqui 🫠)

Quero compartilhar um script para rodar o **PostgreSQL** usando `docker-compose`, que pode ser útil pra quem quer algo bem simples: só colocar pra rodar, com uma dashboard bonitinha pra visualizar os dados e fazer algumas queries também.

Sem muita enrolação, bora pro código:

```yaml
services:
  database_postgres:    
    image: postgres:latest
    ports:
      - 5432:5432
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_USER: username
      POSTGRES_DB: database_name 
    volumes:
      - ${HOME}/postgres-data/:/var/lib/postgresql/data    
      
  pgweb:
    container_name: pgweb
    restart: always
    image: sosedoff/pgweb
    ports:
      - 8081:8081
    links:
      - database_postgres:database_postgres
    environment:
      - PGWEB_DATABASE_URL=postgres://username:password@database_postgres:5432/database_name?sslmode=disable
    depends_on:
      - database_postgres
```

---

## 🛠 Explicando um pouco mais

### `database_postgres`

Nada muito novo sob o sol. São só algumas variáveis pra inicializar o banco com o usuário corretamente.

Mas o **pulo do gato** está em `volumes`:  
Ali eu garanto que uma pasta será criada na `HOME` do usuário, e nela ficarão os dados do banco.  

👉 Assim, se por acaso você der um `docker-compose down` (ou `docker compose down`, dependendo da versão), seus dados **não serão perdidos**.  
Não é o ideal pra colocar em produção, mas quebra um galho e tanto em muitos casos! 😂

---

### `pgweb` (Dashboard)

Tem duas coisas legais aqui:

- A **URL de conexão** é passada via variável de ambiente, facilitando tudo.
- O **`links`** cria uma ligação entre os serviços — define um alias, permitindo que o container `pgweb` acesse o banco de dados `database_postgres` pelo nome `database_postgres`.

Além disso, o **`depends_on`** garante que o banco suba **antes** da dashboard, evitando erros de conexão.

---

## 🚀 Rodando tudo

Depois de rodar um belo:

```bash
docker-compose up
```

Você já pode acessar sua dashboard no navegador pela URL:

```
http://localhost:8081/
```

Lá você pode executar queries ou só visualizar os dados — tudo direto do navegador, sem instalar mais nada.

---

## ✌️ É isso!

Espero que esse script seja útil pra alguém.  
Qualquer dúvida, os comentários estão aí pra isso 🤙
