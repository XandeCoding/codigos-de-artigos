run:
	@echo "Executando projeto"
	@export QUART_APP=src.main:app;quart run

run-dev:
	@echo "Executando projeto em modo de desenvolvimento"
	python -m quart --app src.main:app run --port 5000 --reload

lint:
	@echo "Executando lint no projeto"
	@ruff check --fix .


