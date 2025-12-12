include .env
export $(shell sed 's/=.*//' .env) 
GO= go
GOLINT=golangci-lint 
MODULE	= main
SRCDIR	= internal
TARGET	= $(MODULE).go
DOCKER=docker

all:
	@:


test:
	$(GO) run ./$(SRCDIR)/${TARGET}

lint:
	$(GOLINT) run 

format:
	$(GOLINT) fmt  ./$(SRCDIR)

dockerup:
	$(DOCKER) compose up -d

dockerdown:
	$(DOCKER) compose down