SHELL:=/bin/bash
VERSION?=$(shell git describe --tags --always)
NAME:=rostrum
CURRENT_DOCKER_IMAGE=quintilesims/$(NAME):$(VERSION)
LATEST_DOCKER_IMAGE=quintilesims/$(NAME):latest

build:
	yarn run build --non-interactive
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo --ldflags "-w -s -X main.Version=1" -o rostrum .
	docker build -t $(CURRENT_DOCKER_IMAGE) .

release: build
	docker push $(CURRENT_DOCKER_IMAGE)
	docker tag $(CURRENT_DOCKER_IMAGE) $(LATEST_DOCKER_IMAGE)
	docker push $(LATEST_DOCKER_IMAGE)

run:
	yarn run build --non-interactive
	go run main.go

.PHONY: build release run