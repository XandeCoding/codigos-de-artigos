load-req:
	@echo 'Teste de carga com 125 conexões e 100.000 requisições'
	@bombardier -c 125 -n 100000 http://localhost:3000/films

load-connection:
	@echo 'Teste de carga com 1.000 conexões e 100.000 requisições'
	@bombardier -c 1000 -n 100000 http://localhost:3000/films

load-heavy:
	@echo 'Teste de carga com 10.000 conexões e 1.000.000 requisições'
	@bombardier -c 10000 -n 1000000 http://localhost:3000/films
