# Bun e Node - Será que o pãozinho tem chance?

Bem vindos meus companheiros que são marginalizados, insultados e passam por vexame somente por usar JavaScript no backend (E jogar no bicho nas sextas, com fé vem coelho dessa vez :pray). 
Como muitos vem acompanhando durante há algum tempo nosso ecossistema vem crescendo bastante não só com libs e novas funcionalidades mas com novas runtimes para executar que possibilitam
executar código JavaScript no backend seja para realizar consultas em bancos, fornecer dados via api rest, fornecer dados estáticos e várias outras aplicações.

Mas queria me aprofundar mais no contexto de runtimes nesse momento, assim como os dinossauros do Jurassic Park evoluíram e começaram a procriar e criar lindas
famílias devoradoras de pessoas as runtimes também fizeram o mesmo e atualmente acho que temos 3 pesos pesados no ringue, começando pelo nosso amado Node.js,
Deno (que inclusive é do mesmo criador, o que o resentimento pela ex não faz) e Bun. E como já brinquei um pouco com o famoso Deno (link do artigo de paginas estaticas) agora chegou a vez do Bun.

Só dando um repasse dos últimos capítulos o Node.js chegou como uma bomba no ecossistema de devs por possibilitar utilizar a mesma linguagem tanto no frontend
quanto no backend sempre foi algo que embora tenha suas controvérsias sempre foi adotado em muitas empresas seja o Java com seu PrimeFace ou PHP com qualquer coisa 
que sua mente libidinosa deseje, e Node.js fez isso com o queridinho do momento que era o JavaScript uma linguagem de fácil adaptação até para quem não tem muita intimidade,
não que isso não seja verdade com outras linguagens mas com Javascript acredito que há uma barreira menor seja por ser muito utilizada no frontend
ou por ser acessível pelo navegador para muitos essa foi a primeira a linguagem que a pessoa teve contato.
E tudo com isso com uma perfomance admirável sendo a engine V8 do chrome que roda por baixo dos panos Chrome que sempre foi um bom navegador e bem
perfomático imagine utilizar isso para rodar códigos do lado do servidor... o cerco estava armado, e estamos aí a mais de uma década
criando bugs e queries mal otimizadas em Javascript.

Mas nada é perfeito e Node.js mesmo sendo feito por engenheiros e engenheiras bastante talentosos surgiram algumas alternativas
e uma delas é o Bun que é o assunto do texto de hoje.

### o que é o Bun? (É de comer? Às vezes sim)


Para começar Bun é uma runtime feita do zero com uma linguagem criada recentemente chamada [Zig](https://www.youtube.com/watch?v=kxT8-C1vmd4) que é feita
pensada em seguranca e perfomance, dito isso o foco do Bun é também perfomance e entregar uma api padrão que auxilie na produtividade o package manager que vem junto
funciona muito bem inclusive. Ele diferente do Node.js e Deno utiliza a engine do Safari para rodar o código produzido em JavaScript que é bem 
famosa pela velocidade mas também por ser mais díficil desenvolver para ela, outro ponto muito positivo é suporte padrão para TypeScript 
sim eu sou um Junkie por tipos me julgue, mas quando vou concatenar uma string com um objeto eu quero conscientemente saber 
que estou fazendo uma cachorrada. *Obs.: Node tem melhorado muito o suporte para Typescript porém algumas coisas ainda estão em fase experimental.*

### o que se faz com Bun? 

Agora que já contei muita lorota queria mostrar um humilde benchmark que fiz para testar o brinquedo onde era feita a leitura de um arquivo
json e esse arquivo era parseado e respondido na requisição, simples assim:


![]({{ get_img_url('multi_language/bun e node/benchmark.png') }})

Obs.: Low load sendo 'Teste de carga com 125 conexões e 100.000 requisições', Medium load 'Teste de carga com 1.000 conexões e 100.000 requisições'
e Heavy load com 'Teste de carga com 10.000 conexões e 1.000.000 requisições', os testes foram executados com bombardier e segue link do repo com os testes [bun e node](link do repo)

E segue também um outro benchmark [Deno vs. Node.js vs. Bun: Performance Comparison 2025](https://www.youtube.com/watch?v=DpDHPoStZZ8) que diferentemente de mim 
foi feito por uma pessoa séria:

![]({{ get_img_url('multi_language/bun e node/benchmark_2.png') }})

Analisando com cuidado vemos algumas qualidades e defeitos também:

- **Velocidade** - Ele realmente entregou uma perfomance melhor que seus concorrentes, um caso mais extremo no último teste de carga intensa sendo de
uma média de 300.96ms enquanto Node respondia em seus 1000.42ms cerca de 3 vezes mais rápido do que a outra app em Node.js.

- **Recursos** - Aqui temos algumas controvérsias pois no primeiro teste do vídeo vimos que ele realmente estava consumindo menos memória e cpu 
mas olha que surpresa no segundo teste isso foi totalmente o contrário com um consumo de memória atingindo um pico de 1.51GiB,
isso já foi corrigido na issue [17063](https://github.com/oven-sh/bun/issues/17063) porém é um risco que deve estar pronto a correr
caso queira ser um dos early adopter da runtime.

Algumas considerações que gostaria de trazer é que embora alguns benchmarks brilhem os olhos nem tudo é assim no dia a dia, nos meus testes vi que alguns detalhes
como utilizar o roteamento padrão do Bun para expor rotas pode trazer um overhead bem maior que fazê-lo a mão, isso pode parecer
óbvio mas a diferença foi muito gritante a ponto de chegar a pensar que havia algum bug no código. E embora o Bun tenha
sido feito do zero se aproveitando dos aprendizados das runtimes que vieram antes e com um foco bem grande em perfomance ele não traz a mesma bagagem e
compatibilidade que o Node.js traz tendo mais de uma década de história e há uma grande comunidade em volta então caso encontre um problema
tem uma grande chance de alguém já ter passado por isso e você conseguir ajudar, outro ponto e que várias libs são construídas o utilizando como base,
então caso queira fazer um troca analise bem se a sua aplicação terá ganhos pois dificilmente ela terá o mesmo comportamento (isso para o bem ou para mal).


### Conclusão

Bem é isso, espero ter trazido um pouco do panorama entre essas duas runtimes, o ecossistema Backend JavaScript está crescendo e isso é bem frutífero
para nós devs pois a cada dia temos ferramentas mais estáveis e novas se querendo se provar e ganhando espaço dos seus irmãos mais velhos.
