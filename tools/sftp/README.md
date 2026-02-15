# Docker Compose - SFTP gerenciando arquivos com segurança

![Capa]({{ get_img_url('tools/sftp/media/capa.png') }})

Bom dia a todos! Espero que tenha os encontrado bem. Hoje gostaria de compartilhar com vocês quase uma versão 2.0 do meu antigo texto
de [Docker Compose - Servidor FTP](), comigo querendo trazer algumas melhorias de segurança e dicas
de boas práticas esse texto surgiu.

Não me entenda mal, o texto anterior ele tem seu charme, se você quer subir um FTP básico
e rápido ele é sua pedida.

Bem caso não conheça o protocolo **SFTP** (_Secure File Transfer Protocol ou SSH File Transfer Protocol_)
ele é um protocolo de transferência de arquivos pela rede como o FTP mas utiliza o SSH para criptografar
os comandos e dados (durante a transmissão).

## Quem pode, pode, quem não pode não vai estar podendo

Aconselho a criar uma pasta com dois subdiretórios, um de arquivos (files) e outro para persistir as
credenciais (creds).

```
sftp
|- files
|- creds
```

E para não termos problemas de permissionamento é bom já garantirmos os acessos a quem deve, para
evitarmos problemas ao apagar ou editar arquivos criados pelo container Docker.

Para evitar isso aconselho descobrir o usuário que vai ser utilizado e adicionar as
pastas no mesmo grupo deste usuário, além de setar as permissões via chmod.

```
Obs.: Caso o usuário que criou as pastas seja o mesmo que vai executar o container docker, **provável
que esse passo não seja necessário embora seja recomendado**
```

Por facilidade vou pressupor que o usuário que está sendo utilizado na shell é o mesmo que vai subir o docker,
então vamos lá!

1 - Utilizar o comando `whoami` para descobrir o usuário atual
```
➜ whoami
alexandre
```

2 - No meu caso o usuário se chama _alexandre_ agora vamos checar qual o id do usuário

```
➜ id
uid=1000(alexandre) gid=1000(alexandre) grupos=1000(alexandre),4(adm),24(cdrom),27(sudo),30(dip),46(plugdev),100(users),116(lpadmin),987(docker)

```

3 - Está vendo o valor de `uid` que precede o nome do nosso usuário em parenteses? O valor dentro dele
que queremos, no meu caso é _1000_, vamos precisar disso quando formos criar os usuários com acesso ao SFTP

4 - Adicione as pastas necessárias no grupo, com o comando _chown_ na pasta que estamos trabalhando,
com o usuário e grupo no seguinte formato _usuario:grupo_

```
chown -R alexandre:alexandre ./sftp
```

5 - Adicionando as permissões, para quem **criou** o arquivo e quem está no **grupo**
poder tanto _ler_, _editar_ e _excluir_ os dados e para o resto poder só executar a leitura (774)

```
chmod 774 -R ./sftp
```

## Criar o arquivo de usuários

Essa aplicação que utilizar hoje ela permite que os usuários sejam passados
via arquivo, eu acho essa forma mais fácil de gerenciar que via comando ou env então bora criar
esse arquivo.

Basta criar um arquivo _users.conf_ e adicionar cada informação do usuário no seguinte
formato `usuario:senha:uid` vou explicar cada campo:

- **usuario:** Pode ser qualquer nome de usuario, inclusive o do seu usuário atual (meu caso)
- **senha:** Vou deixar vazio esse campo pois vamos utilizar uma chave _SSH_ para autenticação
- **uid:** O uid que pegamos no ponto passado _(caso seja um apressadinho tente 1000 ou 1001)_.

O conteúdo do meu **users.conf** ficará desse jeito:

``` 
alexandre::1000
```

## Gerando as chaves SSH

Para gerar as chaves eu vou utilizar o ssh-keygen que já vem instalado no ubuntu normalmente.

1 - Entre na pasta _creds_ dentro de __/sftp__

2 - Utilize o comando **ssh-keygen -t rsa** e digite o nome do arquivo, pode ser qualquer um
eu coloquei _key_ 

3 - Após isso ele pergunta se você quer adicionar uma senha, é opcional, eu não costumo adicionar
lembrando que se adicionada ela será pedida em cada acesso

## Após a Odisséia Ulisses retorna à casa

Agora é a melhor hora, segue o docker compose da felicidade:

```
services:
  sftp:
    image: atmoz/sftp
    restart: 'unless-stopped' 
    volumes:
      - ./files:/home/alexandre/upload                          # Os arquivos serão mantidos aqui
      - ./creds/key.pub:/home/alexandre/.ssh/keys/key.pub:ro    # Compartilhando as chaves com o serviço
      - ./users.conf:/etc/sftp/users.conf:ro                    # Adicionando os usuários
    ports:
      - 2222:22                                                 # A porta exposta será a 2222
```

E para subir tudo basta executar:

```
docker compose up -d
```

## Como conectar

Caso queira uma dica de um client para conectar ao seu recém criado serviço eu recomendo o clássico Filezilla,
segue abaixo como o utilizar:

1 - Abra o _gerenciador de sites_ na aba _Arquivo

![Arquivo/gerenciador de sites]({{ get_img_url('tools/sftp/media/guia_arquivo.png') }})

2 - Segue as configurações sugeridas:

![gerenciador de sites/configuracao]({{ get_img_url('tools/sftp/media/config.png') }})

- Protocolo: SFTP
- Host: localhost
- Porta: 2222 - Normalmente é a 22 mas redirecionamos para a 22, _faço isso para evitar conflitos_
- Tipo de Logon: Arquivo chave
- Usuário: alexandre - Adicione o usuário do arquivo _users.conf_
- Arquivo com chave: Aponte para a chave privada (sem o .pub) que criou no passo [Gerando a chave SSH]
- Cor de fundo: ai vai do seu gosto


3 - Voilá, agora é só aproveitar para realizar seus deploys duvidosos ou guardar seus arquivos da steam verde
no seu SFTP favorito (amor de pai e mãe não tem medida)

## Isso é tudo, pessoal!

Espero que tenha sido útil para vocês, ele ficou um pouco mais extenso que do que eu desejava porém 
quis deixar tudo bem explicado (eu espero que esteja mesmo 😅). Porém caso tenha dúvidas
só me chamar na caixa de comentários que vou estar feliz em responder qualquer pergunta!.

