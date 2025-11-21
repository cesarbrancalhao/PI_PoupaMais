.PHONY: help init init-pod dev prod install clean clean-pod db db-pod db-purge db-purge-pod

# Default
help:
	@echo "Comandos disponíveis:"
	@echo "  make init            - Instala todas as dependências e inicia todos os serviços"
	@echo "  make init-pod        - Instala todas as dependências e inicia todos os serviços com podman"
	@echo "  make dev             - Executa client e server em modo dev"
	@echo "  make prod            - Executa client e server em modo prod"
	@echo "  make install         - Instala dependências de client e server"
	@echo "  make clean           - Limpa a build do client e server"
	@echo "  make clean-pod       - Limpa a build do client e server com podman"
	@echo "  make db              - Inicia o banco de dados"
	@echo "  make db-pod          - Inicia o banco de dados com podman"
	@echo "  make db-purge        - Limpa o banco de dados"
	@echo "  make db-purge-pod    - Limpa o banco de dados com podman"

init:
	@echo "Instalando dependências de client e server..."
	@make install
	@make db
	@make dev

init-pod:
	@echo "Instalando dependências de client e server..."
	@make install
	@make db-pod
	@make dev

install:
	@echo "Instalando dependências do client..."
	@cd client && npm install
	@echo "Instalando dependências do server..."
	@cd server && npm install
	@echo "Instalação completa!"

db:
	@echo "Iniciando banco de dados..."
	@cd server && docker compose up -d postgres
	@until docker exec poupa_mais_db pg_isready -U postgres >/dev/null 2>&1; do \
		echo "Aguardando o banco de dados iniciar..."; \
		sleep 2; \
	done; \
	echo "Banco de dados iniciado com sucesso!"

db-pod:
	@echo "Iniciando banco de dados com podman..."
	@cd server && podman compose up -d postgres
	@until podman exec poupa_mais_db pg_isready -U postgres >/dev/null 2>&1; do \
		echo "Aguardando o banco de dados iniciar..."; \
		sleep 2; \
	done; \
	echo "Banco de dados iniciado com sucesso!"

dev:
	@echo "Iniciando client, server e banco..."
	@echo "Pressione Ctrl+C para parar todos os serviços"
	@trap 'kill 0' EXIT INT TERM; \
	(cd client && npm run dev) & \
	(cd server && npm run start:dev) & \
	wait

prod:
	@echo "Iniciando client e server em modo prod..."
	@echo "Pressione Ctrl+C para parar ambos os serviços"
	@trap 'kill 0' EXIT INT TERM; \
	(cd client && npm run build) & \
	(cd server && npm run build) & \
	wait

clean:
	@echo "Limpando a build..."
	@rm -rf client/.next
	@rm -rf server/dist
	@rm -rf server/coverage
	@cd server && docker compose down
	@echo "Limpeza concluída!"

clean-pod:
	@echo "Limpando a build..."
	@rm -rf client/.next
	@rm -rf server/dist
	@rm -rf server/coverage
	@cd server && podman compose down
	@echo "Limpeza concluída!"

db-purge:
	@echo "Limpando banco de dados..."
	@cd server && docker compose down -v
	@echo "Banco de dados limpo com sucesso!"

db-purge-pod:
	@echo "Limpando banco de dados..."
	@cd server && podman compose down -v
	@echo "Banco de dados limpo com sucesso!"