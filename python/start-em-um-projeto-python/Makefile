run-dev:
	@echo "Executando projeto em modo de desenvolvimento"
	@export QUART_APP=src.main:app;quart run

lint:
	@echo "Executando lint no projeto"
	ruff check --fix .

format:
	@echo "Executando formatador de código"
	black .

