# Docker Compose - Servidor FTP

Oi pessoal! Vim compartilhar mais um script de `docker-compose` que montei para salvar arquivos aqui em casa, usando um PC antigo que estava parado.  
Então, se você tem um pczinho aí encostado e quer usá-lo como backup ou para armazenar coisas e não lotar o disco do seu computador principal — sem depender de internet —, acho uma boa!

Usei o **ProFTPD**, que foi o serviço FTP mais fácil e simples que encontrei.  
Também testei o **vsftpd**, mas achei ele um pouco mais complexo de configurar.

```yaml
services:
  ftp-container:
    image: kibatic/proftpd
    network_mode: host
    restart: always
    environment:
      FTP_LIST: "usuario:senha"
      USERADD_OPTIONS: "-o --gid 33 --uid 33"
    volumes:
      - "./files:/home/casa"
```

Agora vou explicar algumas configurações que você pode ajustar conforme seu uso:

- **network_mode —** Essa opção faz o container usar a mesma rede do computador hospedeiro (o PC que está rodando o FTP).
    Com isso, o serviço fica visível na rede local da sua casa — você consegue acessá-lo pelo celular ou qualquer outro dispositivo conectado à mesma rede.

- **FTP_LIST —** Aqui você define o usuário e a senha no formato usuario:senha.
    Dá pra adicionar mais de um usuário separando com ;.
    Atenção: a senha não pode conter caracteres especiais.

- **USERADD_OPTIONS —** Define o grupo e o usuário padrão dentro do container.
    Do jeito que está configurado, ele consegue criar e ler arquivos normalmente.

- **volumes —** O primeiro caminho (./files) é a pasta no seu computador que será compartilhada com o FTP.
    É nela que os arquivos serão salvos. Recomendo criar uma pasta vazia com esse nome (files) na mesma pasta do script.
    O segundo caminho (/home/casa) é a pasta dentro do container. Esse nome pode ser qualquer um — o importante é garantir que o primeiro caminho esteja correto.

É isso! Espero que ajude. Qualquer dúvida, só chamar. Até mais! 👋
