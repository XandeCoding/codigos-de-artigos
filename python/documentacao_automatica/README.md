# Documentação Automática usando MkDocs e Python

Algo que curto muito é ficar navegando na documentação de libs sinceramente uma documentação é algo que acho lindo de se ver e também difícil de manter :sweat_smile:.

Imagine toda vez que seja feita alguma alteração em um comportamento de algo ir à página que explica fazer um copy paste do código, escrever o que ela faz agora, fazer o build, checar se está tudo certo, êpa não era pra ficar assim... eu já cansei só de imaginar :triumph:

Para facilitar isso existem algumas ferramentas como o MkDocs que facilitam bastante e nos ajudam a automatizar algumas tarefas chatas, nesse artigo vou escrever um pouco do que e como usei para fazer uma documentação de uma ferramenta Python, mas um ponto importante disso tudo é que MkDocs é agnóstico de linguagem então pode ser feito com outras linguagens também só dar uma olhadinha na [documentação](https://www.mkdocs.org/) deles!


## Ferramenta a ser documentada :beetle:


Fiz uma ferramenta bem simples que realiza uma chamada na PokeAPI e pega informações relacionadas a um pokémon e mostra no terminal.

O código-fonte pode ser encontrado aqui: [Documentação automática](https://github.com/XandeCoding/codigos-de-artigos/tree/main/python/documentacao_automatica)

Falando um pouco mais do projeto usei o poetry para gerenciar o ambiente virtual e deixar as libs que instalei isoladas do resto do sistema, ninguém quer ficar entulhando o pc com um monte de libs não é mesmo, mas você pode usar qualquer outra como _pyenv_, _virtualenvwrapper_ é algo indiferente.

Bem as libs que instalei estão no `pyproject.toml` e no `requirements.txt` então é só instalar (um _pip install -r requirements.txt_ deve funcionar) e começar a brincar.

## Como documentar :writing_hand:


![Código de acesso a api de pokémon PokeAPI]({{ get_img_url('python/documentacao_automatica/docs/assets/pokemon_code.png') }})

Esse é um pedacinho do código que vou usar como exemplo para explicar para vocês, bem já deve ter reparado nessas `"""` elas são [Docstrings](https://peps.python.org/pep-0257/) são usadas para documentar o código e é uma convenção bastante usada, para documentar módulos, classes, funções bem de qualquer forma se for documentar algo recomendo usar :stuck_out_tongue_winking_eye: .

Essas docstrings que vão realizar a mágica vamos fazer com que elas sejam lidas de forma automática e inseridas na respectiva página de documentação do módulo. Bem com as docstrings inseridas e explicando o que cada função faz, vamos para prosseguir.

## Instalando o MkDocs :arrow_up:

Para instalar usando o **Poetry** é bastante fácil basta usar um _poetry add_ ou _pip install_ caso não esteja o usando.

![Código de como instalar o mkdocs]({{ get_img_url('python/documentacao_automatica/docs/assets/instalar-mkdocs.png') }})

Bem instalamos o **mkdocs**, um tema para deixar a documentação mais bonita **mkdocs-material** isso é questão de gosto no caso eu gosto muito, mas tem outros temas caso tenha interesse segue link com mais informações [temas de MkDocs](https://www.mkdocs.org/user-guide/choosing-your-theme/). E por último temos o **mkdocstrings** ele é um plugin que percorre nosso projeto e insere as docstrings encontradas dentro de nossas páginas.

Mas bem com as libs instaladas, o que fazemos agora? :thinking: não precisa mandar uma carta para o Caldeirão do Hulk é bem mais simples que isso :joy:, seguindo o passo a passo logo você vai ter sua documentação pronta.

1 - Abra um terminal dentro da pasta do projeto e use o comando **`mkdocs new .`**, isso vai fazer com que os arquivos de configuração e a pasta _docs_ sejam criadas.

2 - Neste momento você já deve ter um arquivo chamado **`mkdocs.yml`** na raiz do seu projeto nele adicione as seguintes configurações.

```yml
site_name: Documentação Automática # Pode ser usado o nome da sua aplicação
theme:
  name: material # Adiciona o tema bonitinho
plugins:
- search # Plugin que possibilita buscas pela documentação
- mkdocstrings: # Esse que faz a mágica, mais informações abaixo
    handlers:
      python:
        setup_commands:
          - import sys
          - sys.path.append("src")
    watch: # Live-reload para os mais íntimos - mais informações abaixo também
      - src
```

_Obs.: Sim, adicionei o código meio feio, mas assim você pode só copiar e colar, minha preguiça saúda a sua :open_hands:_

*  _mkdocstrings:_ Como já comentei ele que lê as docstrings e adiciona na respectiva página que é relacionada com o módulo, mas já vamos ver como usar. De resto adicionei um código Python (sim ele aceita algumas funções python na configuração) para que a pasta `src` que é a que está o meu código seja reconhecido pela ferramenta, caso alguma pasta sua não seja reconhecida assim como a minha, esse é o caminho, basta adicionar ali e pronto.

*  _watch:_ Isso faz com que ao realizar uma alteração no código a mesma seja atualizada para que a documentação esteja sincronizada com o código tanto alterações no código quanto nas docstrings habilitam o reload da página, no caso adicionei a pasta onde está a minha aplicação, inclusive muito legal escrever a doc e já ver a mesma sendo inserida na página.

3 - Execute **`mkdocs build`** e depois **`mkdocs serve`** e ele vai deixar a sua doc accessível pelo navegador pela url `http://127.0.0.1:8000/`. Você deve ter algo parecido com isso abaixo.

![Index da página de documentação]({{ get_img_url('python/documentacao_automatica/docs/assets/mkdocs-index.png') }})

4 - Ao acessar você vai ter uma pequena introdução de como adicionar páginas, mas é muito simples basta criar um arquivo _.md_ dentro da pasta **docs** que está na raiz do seu projeto e a mesma já é adicionada na estrutura da documentação. Se está tudo indo certo você vai ter uma estrutura parecida com essa abaixo, foco na pasta **docs**.

![Estrutura de pastas]({{ get_img_url('python/documentacao_automatica/docs/assets/estrutura.png') }})

5 - Vamos atacar a página pokemon ela que vou usar para documentar o meu módulo pokemón que vimos no ínicio.

![Arquivo markdown de documentação]({{ get_img_url('python/documentacao_automatica/docs/assets//markdown.png') }})

* Temos uma pequena introdução do que se trata aquela página e logo após vemos um `::: src.pokemon` mas do que se trata isso. Bem ele que mapeia o arquivo que será inserido de forma automática e partir dali é inserido a doc usando o caminho do arquivo (módulo se preferir) que está na pasta src é a mesma sintaxe do import, não acredita que funcionou? Olha o resultado aí em baixo!

![documentação do módulo de pokémon]({{ get_img_url('python/documentacao_automatica/docs/assets/mkdocs-pokemon.png') }})


6 - Aproveite :grin:

# Fim

Em alguns passos já temos uma doc bem legal e caso tenhamos mais um módulo ou seja necessário adicionar mais uma página é bem simples é só criar na pasta docs e está feito. Espero que tenha gostado e qualquer dúvida (ou se achou alguma coisa errada, acontece nas melhoras famílias) só mandar um comentário logo abaixo!
