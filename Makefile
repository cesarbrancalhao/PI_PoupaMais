.PHONY: help init dev prod install install-client install-server clean

# Default
help:
	@echo "Comandos disponíveis:"
	@echo "  make init            - Instala todas as dependências e inicia todos os serviços"
	@echo "  make dev             - Executa client e server em modo dev"
	@echo "  make prod            - Executa client e server em modo prod"
	@echo "  make install         - Instala dependências de client e server"
	@echo "  make install-client  - Instala apenas as dependências do client"
	@echo "  make install-server  - Instala apenas as dependências do server"
	@echo "  make clean           - Limpa a build"

# Instala todas as dependências e inicia todos os serviços
init:
	@echo "Instalando dependências de client e server..."
	@make install
	@make dev

# Executa client, server e banco em modo dev
dev:
	@echo "Iniciando client, server e banco..."
	@echo "Pressione Ctrl+C para parar todos os serviços"
	@trap 'kill 0' EXIT INT TERM; \
	(cd server && podman compose up -d postgres); \
	until podman exec poupa_mais_db pg_isready -U postgres >/dev/null 2>&1; do \
		echo "Aguardando o banco de dados iniciar..."; \
		sleep 2; \
	done; \
	(cd client && npm run dev) & \
	(cd server && npm run start:dev) & \
	wait

# Executa client e server em modo prod
prod:
	@echo "Iniciando client e server em modo prod..."
	@echo "Pressione Ctrl+C para parar ambos os serviços"
	@trap 'kill 0' EXIT INT TERM; \
	(cd client && npm run build) & \
	(cd server && npm run build) & \
	wait

# Instala dependências de client e server
install:
	@echo "Instalando dependências do client..."
	@cd client && npm install
	@echo "Instalando dependências do server..."
	@cd server && npm install
	@echo "Instalação completa!"

# Instala apenas as dependências do client
install-client:
	@echo "Instalando dependências do client..."
	@cd client && npm install

# Instala apenas as dependências do server
install-server:
	@echo "Instalando dependências do server..."
	@cd server && npm install

# Limpa a build
clean:
	@echo "Limpando a build..."
	@rm -rf client/.next
	@rm -rf server/dist
	@rm -rf server/coverage
	@cd server && podman compose down
	@echo "Limpeza concluída!"