.PHONY: setup up down migrate dev dev-frontend dev-backend test test-frontend test-backend hooks

setup: up migrate hooks

up:
	docker compose up -d

down:
	docker compose down

migrate:
	cd backend && set -a && . ../.env && set +a && npx drizzle-kit migrate

dev:
	@trap 'kill 0' SIGINT; npm run dev:backend & npm run dev:frontend & wait

dev-backend:
	npm run dev:backend

dev-frontend:
	npm run dev:frontend

test:
	npm test

test-frontend:
	npm test -w frontend

test-backend:
	cd backend && set -a && . ../.env && set +a && npx vitest run

hooks:
	cp scripts/pre-commit .git/hooks/pre-commit
	chmod +x .git/hooks/pre-commit
	@echo 'pre-commit hook installed'
