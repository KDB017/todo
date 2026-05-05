.PHONY: install dev dev-frontend dev-backend build clean

install:
	cd frontend && npm install
	cd backend && npm install

dev:
	@make -j2 dev-frontend dev-backend

dev-frontend:
	cd frontend && npm run dev

dev-backend:
	cd backend && npm run dev

build:
	cd frontend && npm run build
	cd backend && npm run build

clean:
	rm -rf frontend/node_modules backend/node_modules frontend/dist backend/dist
