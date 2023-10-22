# Usando DDD com FastAPI e subaplicações

Estive estudando Domain Driven Design por alguns dias e quero compartilhar alguns conceitos que me ajudaram a pensar e estruturar melhor um projeto e espero que ajudem vocês também.

## Aliás, o que é DDD?

Domain driven design é uma filosofia que ajuda a criar um projeto com foco no domínio do mesmo, isso quer dizer que ao entrarmos em um projeto utilizaremos conhecimentos de especialistas da área.

Isso ajuda a sabermos para o que exatamente vai ser utilizado, a melhor forma de resolver algum problema e para evitar erros comuns que pessoas que não estão familiarizadas com a área possam cometer.

Isso ajuda muito, pois se não conhecermos ou não tivermos auxílio de alguém que conhece o domínio ou área em que o software atua podemos fazer um projeto que não resolve de forma adequada os problemas ou pior que resolve tudo menos o porque dele ter sido criado.

## Beleza e o que tem demais?

Alguns de vocês devem estar pensando "mas poxa isso é óbvio, entender das regras de negócio e programar depois não há nada de mais nisso" e bem ele não é só isso ele vem com uma bagagem de conceitos que ajudam a fazer um design de projeto mais fácil de ser entendido, diminuir o acoplamento, e a criar camadas do projeto que ajudam muito na organização e na manutenção do software.

### E falando nessas camadas elas são:

**Domínio:** Isso é onde as regras de negócios da aplicação ficam.

**Infraestrutura:** Aqui consiste tudo que seu software precisa independentemente de outros partes como módulos, bibliotecas externas, configurações do banco de dados e etc.

**Aplicação:** Esta camada serve para fazer o meio de campo entre a camada de interface e a de domínio.

**Interface:** Fornece a interação com os outros sistemas como serviços web, front-end por exemplo.

## E agora é mão na massa

E chega de teoria e vamos ver código 😄, fiz um projeto usando o que aprendi de DDD e vou mostrar um pouco dele para vocês, espero que gostem qualquer dúvida ou feedback é só comentar que estarei feliz em responder. Só relembrando é só um estudo que fiz esse projeto não demonstra todos os conceitos de DDD até porque é um projeto pequeno não iria caber todos como factories, agregates e por aí vai.

Este projeto é só um software que armazena e devolve Todos que no caso são simplesmente notas o qual eu guardo com um id que uso como chave primaria, text para deixar o texto, e completed para saber se ela foi realizada ou não. Nele usei FastAPI que e um framework de Python que tem algumas features bem legais segue link abaixo para quem quiser saber mais assim como o link do meu projeto no GitHub .Então vamos lá pasta por pasta. 🙌

Projeto: [DDD_FastAPI](https://github.com/XandeCoding/ddd_fastAPI)

[FastAPI documentação](https://fastapi.tiangolo.com/)

![Alt Text]({{ get_img_url('python/usando-ddd-com-fastapi-e-subaplicacoes/docs/assets/estrutura.png')}})

### Raiz do projeto

**environment:** nele deixei as variáveis de ambiente como a chave de segurança e a url do banco de dados, que pegam do sistema caso não tenha pegam as que uso em desenvolvimento.

**wsgi:** chama o uvicorn(ASGI) que é a ferramenta que uso para rodar o sistema.

### modules/todos

![Alt Text]({{ get_img_url('python/usando-ddd-com-fastapi-e-subaplicacoes/docs/assets/app-todos.png')}})

**todos:** Aqui eu uso uma feature muito interessante do FastAPI que é criar um subaplicativo o qual chamo de todoApp o que faz que ele seja mais desacoplado de outras partes do sistema, e depois eu só o monto no arquivo framework dentro de infrastructure que vamos falar mais tarde.

**todosModel:** Deixo as funções que fazem as queries no banco neste arquivo.

**todosSchema:** Aqui fica os schemas que uso para tipar e validar os dados que mando para o banco e que recebo via endpoint.

Assim eu organizo os módulos se eu tiver que implementar algo que não seja ligado ao domínio de todos como, por exemplo, lidar com alguma planilha ou enviar e-mails eles teriam que ser em módulos diferentes, assim eu evitaria modificações em algo que já está funcionando (provavelmente 😅).

### infrastructure

![Alt Text]({{ get_img_url('python/usando-ddd-com-fastapi-e-subaplicacoes/docs/assets/mount.png')}})

**framework:** Deixo as configurações ligados a estrutura do framework no caso ele abrir a conexão com o banco de dados assim como fechar, e acoplo a subaplicação (no caso podemos falar módulo também) na aplicação principal.

**repository:** Aqui usando o Encode como ORM que é baseado no SQLAlchemy mas com suporte ao asyncio e crio as tabelas (devido ao tamanho do projeto não deixei separado a instanciação da tabela de todos) e configuro o banco de dados no caso SQLite.

## Conclusão

Espero que tenham gostado do artigo e do projeto teste aplicando DDD gostei bastante do resultado inicial, mas caso tenham visto algum espaço para melhoria no projeto estou sempre aberto a sugestões. ✌️
