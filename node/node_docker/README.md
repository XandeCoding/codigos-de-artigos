# Dockerfile - Node com Typescript

Bom dia, tudo bem? Espero que sim! Meus caros conterrâneos da terra do hype exacerbado em Inteligência Artificial _sigo no aguardo esperançoso de que elas tirem 
nossos trabalhos_ 🙏.

Mas, enquanto isso não acontece, gostaria de compartilhar uma estrutura de Dockerfile que criei durante
alguns estudos. E não querendo faltar com humildade, acredito que o resultado ficou muito bom 😎.
No meu caso, a imagem inicial tinha cerca de 1GB e após alguns ajustes ficou com cerca de 161MB
(segundo o [Dive](https://github.com/wagoodman/dive)), vale ressaltar que é uma app 
simples feita em [Hono](https://hono.dev/).

`**Observação:** Lembrando que isso não quer dizer que sua aplicação terá esse mesmo tamanho,
pode ficar maior ou menor, isso vai depender do tamanho da base de código e das dependências
instaladas no projeto`


```Dockerfile
FROM node:lts-alpine AS builder
WORKDIR /usr/src/app
COPY --chown=node:node package*.json tsconfig.json ./
COPY --chown=node:node /src ./src
RUN npm ci --silent
RUN npm run build
RUN npm ci --silent --omit=dev 

FROM node:lts-alpine AS runner
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
USER node
EXPOSE 3000
ENTRYPOINT ["node", "./dist/index.js"]
```

## Para quem não está com pressa

Embora esse Dockerfile contemple muitos casos, vou passar algumas dicas de como usar e explicar
um pouco melhor o que fiz em cada passo para que você possa customizar e poder rodar sua aplicação
da melhor forma possível!

### Expor a aplicação

Primeiro e mais importante para sua aplicação ser exposta, além dela estar aceitando requisições
externas ([lembra do `0.0.0.0`?](https://dev.to/engrmark/what-is-host0000-goa)), é preciso 
também publicar as portas do container para a máquina que está executando a imagem.
Segue comando de exemplo para uma aplicação que utiliza a porta
**3000**, que é a mesma definida no Dockerfile:

```shell
docker run nome_da_imagem:tag_da_imagem -p 3000:3000
```

Caso esteja utilizando _Docker Compose_, o campo `ports` já se encarrega disso.
Um manifesto básico para essa aplicação seria algo como:

```docker-compose
services:
  node_api:
    build: .
    ports:
      - 3000:3000

```

### Trocando em miúdos

Agora gostaria de explicar de forma mais detalhada o que estou fazendo.

- **1. Build Multistage:** O primeiro bloco que seria a fase de build se encarrega de
além de baixar as dependências realizar o build da aplicação. Inclusive após gerar o código
transpilado, as dependências de desenvolvimento são removidas para diminuir o tamanho final da imagem.

- **2. Imagem Base:** Aqui vale um ponto de atenção pois estou utilizando a última
imagem do node e do alpine disponibilizada (fica mais fácil manter o texto atualizado dessa forma😅). 
Porém uma melhor prática seria especificar tanto a versão do Node quanto a do Alpine
ou utilizar a hash da imagem dessa forma teríamos uma imagem ainda menos passível
de alterações no comportamento.

    ```Dockerfile
    FROM node:24.12.0-alpine3.23 as BUILDER
    ```
ou 
    ```Dockerfile
    FROM node@sha256:c921b97d4b74f51744057454b306b418cf693865e73b8100559189605f6955b8 AS builder
    ```

- **3. Segurança e Execução:** Na segunda parte, só realizei a cópia do que é estritamente
necessário para a execução da aplicação. Após isso, determino que o usuário `node`
(que já vem por padrão nas imagens oficiais) seja utilizado. Isso é importante, pois, caso não seja feito,
o usuário `root` será utilizado e isso pode deixar brechas de segurança na imagem.

- **4. Entrypoint:** E então finalmente exponho a porta 3000 que é a utilizada pela minha aplicação
**não deixe de colocar a que sua aplicação está utilizando** e utilizo o comando _ENTRYPOINT_.
Aqui executo o JavaScript transpilado na camada anterior de forma direta, mas um comando explicitado
no _package.json_ também poderia estar sendo utilizado.


### Tchau :clap:

Então é isso, obrigado pela leitura! Espero que esse artigo tenha sido de alguma ajuda.
Eu já pesquisei algumas imagens mas sempre pareciam um pouco complexas demais ou faltava algo
que eu precisava. Dessa forma, acho que este modelo não resolve todos os casos, mas serve como
uma boa base para utilizar Docker em conjunto com Node e Typescript.
