# 🧩 Documentação Automática usando MkDocs e Python

Algo que **gosto muito** é ficar navegando em documentações de bibliotecas — sinceramente, uma boa documentação é algo que acho **lindo de ver** e também **difícil de manter** 😅.

Agora imagine: toda vez que uma alteração é feita em um comportamento, precisar ir até a página que o explica, copiar e colar o código, escrever o que mudou, fazer o *build*, **verificar** se está tudo certo... opa, não era para ficar assim! — eu já cansei só de imaginar 😤.

## 🐛 Ferramenta a ser documentada

Criei uma ferramenta bem simples que realiza uma chamada à **PokeAPI**, pega informações sobre um Pokémon e exibe o resultado no terminal.

O código-fonte pode ser encontrado aqui: [Documentação automática](https://github.com/XandeCoding/codigos-de-artigos/tree/main/python/documentacao_automatica)

Falando um pouco mais sobre o projeto: usei o **Poetry** para gerenciar o ambiente virtual e manter as bibliotecas isoladas do restante do sistema (ninguém quer entulhar o PC de libs, né?).
Mas você pode usar qualquer outra ferramenta, como *pyenv* ou *virtualenvwrapper* — é indiferente.

As bibliotecas instaladas estão listadas no `pyproject.toml`, então é só instalar e começar a brincar.

---

## 📝 Como documentar

![Código de acesso à API de Pokémon PokeAPI]({{ get_img_url('python/documentacao_automatica/docs/assets/pokemon_code.png') }})

Esse é um pedacinho do código que vou usar como exemplo.
Você deve ter reparado nessas `"""` — elas são [**Docstrings**](https://peps.python.org/pep-0257/), usadas para documentar o código. É uma convenção muito comum para documentar módulos, classes, funções... enfim, qualquer coisa.
Se for documentar algo, recomendo fortemente usar docstrings 😜.

Essas docstrings são o que fazem a mágica acontecer: vamos fazer com que elas sejam lidas automaticamente e inseridas nas páginas correspondentes da documentação.
Com as docstrings prontas e explicando o que cada função faz, podemos prosseguir.

---

## ⬆️ Instalando o MkDocs

Para instalar usando o **Poetry** é bem simples — basta usar um `poetry add`, ou `pip install` caso não o esteja utilizando.

![Código de como instalar o mkdocs]({{ get_img_url('python/documentacao_automatica/docs/assets/instalar-mkdocs.png') }})

> **Obs.:** Na instalação do `mkdocstrings`, substitua o `[python]` pela linguagem que você estiver utilizando.
> Confira a documentação oficial para verificar o suporte: [Mkdocstrings Docs](https://mkdocstrings.github.io/usage/handlers/#available-handlers).

Instalamos o **MkDocs**, um tema bonito chamado **mkdocs-material** (questão de gosto, mas eu gosto muito 😄), e por fim o **mkdocstrings**, um plugin que percorre o projeto e insere as docstrings nas páginas correspondentes.

E agora? O que fazemos com tudo isso? 🤔
Calma, não precisa mandar uma carta para o Caldeirão do Huck — é bem mais simples que isso 😂.
Seguindo o passo a passo abaixo, sua documentação vai estar pronta rapidinho:

### Passo 1️⃣

Abra um terminal dentro da pasta do projeto e use o comando:

```bash
mkdocs new .
```

Isso criará os arquivos de configuração e a pasta docs.

### Passo 2️⃣

Agora você deve ter um arquivo chamado mkdocs.yml na raiz do projeto.
Nele, adicione as seguintes configurações:
```yml

site_name: Documentação Automática # Pode usar o nome da sua aplicação

theme:
  name: material # Adiciona o tema bonitinho

  plugins:
  - search # Plugin que possibilita buscas na documentação
  - mkdocstrings: # Esse faz a mágica acontecer!
      default_handler: python
```

Obs.: Sim, o código ficou meio feinho, mas assim você pode só copiar e colar — minha preguiça saúda a sua 🙏

O plugin mkdocstrings é o responsável por ler as docstrings e adicioná-las automaticamente nas páginas correspondentes.

### Passo 3️⃣

Execute os comandos:

```bash
mkdocs build
mkdocs serve
```
Depois, acesse a documentação pelo navegador no endereço:
👉 http://127.0.0.1:8000/

Você verá algo parecido com a imagem abaixo:

![Index da página de documentação]({{ get_img_url('python/documentacao_automatica/docs/assets/mkdocs-index.png') }})

### Passo 4️⃣

Ao acessar, você verá uma introdução explicando como adicionar páginas — é bem simples! Basta criar um arquivo .md dentro da pasta docs na raiz do projeto, e ele será adicionado automaticamente à estrutura da documentação.
Sua estrutura deve ficar parecida com esta:

![Estrutura de pastas]({{ get_img_url('python/documentacao_automatica/docs/assets/estrutura.png') }})

### Passo 5️⃣

Agora vamos à página pokemon, usada para documentar o módulo pokemon que vimos no início.

![Arquivo markdown de documentação]({{ get_img_url('python/documentacao_automatica/docs/assets//markdown.png') }})

No conteúdo da página, temos uma breve introdução e depois algo como:
```markdown
::: src.pokemon
```

Mas o que é isso?
Esse comando mapeia o módulo a ser documentado automaticamente — o caminho é o mesmo usado no import.
Não acredita que funciona? Dá uma olhada no resultado:

![Documentação do módulo de Pokémon]({{ get_img_url('python/documentacao_automatica/docs/assets/mkdocs-pokemon.png') }})

### Passo 6️⃣

Aproveite! 😁

### 🎉 Fim

Em poucos passos, já temos uma documentação bem legal!
Caso você adicione novos módulos ou queira criar mais páginas, é só incluir o arquivo dentro da pasta docs, e pronto.

Espero que tenha gostado!
E qualquer dúvida (ou se encontrou algum erro — acontece nas melhores famílias 😅), é só deixar um comentário logo abaixo!
