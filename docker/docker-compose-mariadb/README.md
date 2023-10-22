# Docker Compose - MariaDB

Sabe quando você tem que subir um banco de dados pra fazer uma api ou só rodar um projeto na sua máquina e não quer perder todo aquele tempo instalando e configurando na sua máquina?

Outro dia tive que fazer isso e tive um trabalhinho então quis compartilhar aqui para caso alguém precise não demore quase uma hora com um erro porque colocou as variáveis de ambiente errado :sweat:

Esse é um script que fiz para usar com o docker-compose, então caso não tenha ele instalado é só ir no site do docker e instalar eles tem um guia bem legal de como instalar.

Então depois de instalado é só colocar esse script dentro de um arquivo '_docker-compose.yml_' e rodar o comando '_docker-compose up' na pasta onde está o arquivo que ele já vai estar rodando na porta 3306 que inclusive pode ser alterada assim como as variáveis de ambiente ali em baixo.

Espero que tenha te ajudado e xau :v:

``` elixir
version: "3"
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
            - MYSQL_USER=friends
            - MYSQL_ROOT_PASSWORD=friends
            - MYSQL_DATABASE=friends
```

