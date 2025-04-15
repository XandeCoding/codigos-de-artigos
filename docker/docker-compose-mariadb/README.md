# Docker Compose - MariaDB

Sabe quando você precisa subir um banco de dados pra rodar uma API ou algum projeto localmente, mas não quer perder tempo instalando e configurando tudo na sua máquina?

Outro dia, passei exatamente por isso. Tive um certo trabalho até fazer funcionar, então resolvi compartilhar aqui pra, quem sabe, te poupar quase uma hora tentando descobrir um erro por causa de variáveis de ambiente colocadas erradas 😅

Esse é um script que fiz pra usar com o Docker Compose. Caso ainda não tenha o Docker instalado, é só acessar o [site oficial](https://docs.docker.com/compose/install/linux/) — eles têm um guia bem legal de instalação. 

Depois de instalar, é só salvar o conteúdo abaixo em um arquivo chamado *`docker-compose.yml`*, rodar o comando `docker-compose up` na pasta onde está o arquivo, e pronto! O banco vai subir na porta 3306 (que você pode alterar, assim como as variáveis de ambiente).

Espero que te ajude. Valeu e xau! ✌️

```yaml
services:
  bancoMariaDb:
    image: mariadb
    restart: always
    container_name: bancoMariaDb
    ports:
      - "3306:3306"
    volumes:
      - .:/code
    environment:
      - MYSQL_ROOT_PASSWORD=web
      - MYSQL_DATABASE=web
```
