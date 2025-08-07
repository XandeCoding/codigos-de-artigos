# 🥖 Bun e Node – Será que o pãozinho tem chance?

Bem-vindos, meus companheiros marginalizados, insultados e que passam por vexames apenas por usar JavaScript no backend (e jogar no bicho às sextas — com fé vem coelho dessa vez 🙏).

Como muitos têm acompanhado, nosso ecossistema vem crescendo bastante, não só com novas bibliotecas e funcionalidades, mas também com novas *runtimes* para executar código JavaScript no backend — seja para realizar consultas em bancos, fornecer dados via API REST, entregar arquivos estáticos ou outras aplicações.

Mas queria me aprofundar mais no contexto de runtimes neste momento. Assim como os dinossauros do *Jurassic Park* 🦖 evoluíram, começaram a se reproduzir e formar belas famílias devoradoras de pessoas, as runtimes também evoluíram. Hoje temos três pesos pesados no ringue nosso amado **Node.js**, o **Deno** (que inclusive é do mesmo criador — o que o ressentimento pela ex não faz, hein? 😅), e o **Bun**.

Como já brinquei um pouco com o famoso Deno [neste artigo sobre páginas estáticas](https://dev.to/xandecodes/criando-uma-api-de-paginas-estaticas-basica-com-deno-t-rex-5h8o), agora chegou a vez de testar o Bun.

## ⏪ Um breve resumo dos últimos episódios

O Node.js foi lançado em 2009 e possibilitou utilizar JavaScript no backend. Desde então, tem crescido em popularidade. Acredito que isso se deve ao fato de ser uma linguagem de fácil adaptação, até mesmo para quem não tem muita intimidade com programação. Também pesa a sua forte presença no frontend e a acessibilidade direta pelo navegador — para muitos, foi a primeira linguagem com a qual tiveram contato.

E tudo isso com uma performance admirável, graças à V8, a *engine* do Chrome ⚙️. Que sempre foi um navegador perfomático, e usá-lo para rodar código no servidor foi um golaço. Estamos há mais de uma década criando bugs e *queries* mal otimizadas em JavaScript. 🫠

Mas nada é perfeito. Mesmo sendo mantido por engenheiros e engenheiras muito talentosos, o Node.js começou a enfrentar alternativas — e uma delas é o **Bun**, que é o foco deste texto.

## 🍔 O que é o Bun? (É de comer? Às vezes, sim)

Para começar: o Bun é uma runtime feita do zero com uma linguagem recente chamada [Zig](https://www.youtube.com/watch?v=kxT8-C1vmd4), pensada com foco em segurança e performance.

O objetivo do Bun é entregar **performance** e uma **API padrão** que ajude na produtividade. O *package manager* que o acompanha funciona muito bem, inclusive.

Diferente do Node.js e do Deno, o Bun utiliza a engine do Safari para rodar o JavaScript — famosa por sua velocidade, mas também conhecida por ser mais difícil de se desenvolver para ela. Um ponto muito positivo é o suporte **nativo ao TypeScript** (sim, eu sou um junkie por tipos, me julgue 😅 — mas se eu for concatenar uma *string* com um objeto, quero saber conscientemente que estou fazendo uma cachorrada).

> **📌 Obs.:** O Node.js tem melhorado muito o suporte a TypeScript, mas algumas funcionalidades ainda estão em fase experimental 🧪.

## 🧪 O que dá pra fazer com o Bun?

Agora que já contei muita lorota 😄, queria mostrar um humilde benchmark que fiz para testar o brinquedo. Nele, foi feita a leitura de um arquivo JSON, que depois era *parseado* e respondido numa requisição. Simples assim:

![]({{ get_img_url('multi_language/bun e node/benchmark.png') }})

> **📊 Obs.:**
>
> *Benchmark realizado em um i7-1255U com 8GB de memória*
>
> - **Low Load**: 125 conexões e 100.000 requisições  
> - **Medium Load**: 1.000 conexões e 100.000 requisições  
> - **Heavy Load**: 10.000 conexões e 1.000.000 requisições  
>
> Os testes foram feitos com o [bombardier](https://github.com/codesenberg/bombardier). Aqui está o repositório com os testes: [bun-e-node](https://github.com/XandeCoding/codigos-de-artigos/tree/main/multi_language/bun%20e%20node)

Também recomendo um benchmark mais completo e profissional: [Deno vs. Node.js vs. Bun: Performance Comparison 2025](https://www.youtube.com/watch?v=DpDHPoStZZ8)

![]({{ get_img_url('multi_language/bun e node/benchmark_2.png') }})

Analisando com cuidado, vemos algumas qualidades e defeitos também:

- ⚡ **Velocidade** – Realmente entregou uma performance superior. No último teste de carga intensa, teve média de **300.96ms**, enquanto o Node respondia em **1000.42ms** — cerca de 3x mais rápido.

- 🧠 **Recursos** – Aqui surgem controvérsias. No primeiro teste, o Bun consumiu menos memória e CPU. No segundo, porém, teve um pico de **1.51 GiB de memória**! Isso já foi corrigido na [issue #17063](https://github.com/oven-sh/bun/issues/17063), mas é um risco a ser considerado para quem quer ser early adopter 🧪.

## 💭 Considerações

Embora os benchmarks sejam empolgantes, nem tudo são flores no dia a dia. Nos meus testes, por exemplo, usar o roteador padrão do Bun trouxe um *overhead* muito maior do que implementar algo manualmente. A diferença foi tão grande que achei que havia um bug no código.

Apesar de ter sido feito do zero, com base nos aprendizados das outras runtimes e com forte foco em performance, o Bun **ainda não tem a bagagem** do Node.js. São mais de 10 anos de história e uma comunidade gigantesca.

Isso faz muita diferença. Caso surja um problema no Node.js, é bem provável que alguém já tenha passado por isso e compartilhado uma solução. Sem contar que muitas bibliotecas são construídas com o Node como base.

Portanto, se estiver pensando em fazer uma troca, analise bem: sua aplicação realmente vai ganhar algo com isso? Porque dificilmente ela vai se comportar exatamente igual — para o bem ou para o mal.

## ✅ Conclusão

É isso! Espero ter dado uma visão panorâmica sobre essas duas runtimes. O ecossistema de Backend com JavaScript está em plena expansão, e isso é ótimo para nós devs. A cada dia surgem ferramentas mais modernas, estáveis e interessantes, disputando espaço com os irmãos mais velhos 🧓.

