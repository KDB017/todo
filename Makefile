include .env
export $(shell sed 's/=.*//' .env) 
GO= go
GOLINT=golangci-lint 
MODULE	= main
SRCDIR	= src
TARGET	= $(MODULE).go

all:
	@:


test:
	$(GO) run ./$(SRCDIR)/${TARGET}

lint:
	$(GOLINT) run 

format:
	$(GOLINT) fmt  ./$(SRCDIR)