.PHONY: clean all

NAME=librevault-web
VERSION=0.0.1

build/$(NAME)-$(VERSION)-linux-amd64/$(NAME): static.go *.go
	GOOS=linux go build -o $@

build/$(NAME)-$(VERSION)-linux-arm7/$(NAME): static.go *.go
	GOARCH=arm GOARM=7 GOOS=linux go build -o $@

build/$(NAME)-$(VERSION)-windows-amd64/$(NAME).exe: static.go *.go
	GOOS=windows go build -o $@

build/$(NAME)-$(VERSION)-darwin-amd64/$(NAME): static.go *.go
	GOOS=darwin go build -o $@

dist/$(NAME)-$(VERSION)-windows-amd64.zip: build/$(NAME)-$(VERSION)-windows-amd64/$(NAME).exe
	mkdir -p dist
	cd build && zip ../$@ $(^:build/%=%)

dist/$(NAME)-$(VERSION)-linux-amd64.tgz: build/$(NAME)-$(VERSION)-linux-amd64/$(NAME)
	mkdir -p dist
	tar czf $@ -C build $(^:build/%=%)

dist/$(NAME)-$(VERSION)-linux-arm7.tgz: build/$(NAME)-$(VERSION)-linux-arm7/$(NAME)
	mkdir -p dist
	tar czf $@ -C build $(^:build/%=%)

dist/$(NAME)-$(VERSION)-darwin-amd64.tgz: build/$(NAME)-$(VERSION)-darwin-amd64/$(NAME)
	mkdir -p dist
	tar czf $@ -C build $(^:build/%=%)

static.go: static/bundle.js index.html routes.go
	go generate

static/bundle.js: $(shell find src -print)
	node_modules/.bin/webpack --progress -p

all: dist/$(NAME)-$(VERSION)-linux-amd64.tgz dist/$(NAME)-$(VERSION)-linux-arm7.tgz dist/$(NAME)-$(VERSION)-windows-amd64.zip dist/$(NAME)-$(VERSION)-darwin-amd64.tgz

clean:
	rm -rf dist $(NAME)* static.go *.zip *.tgz build static/bundle.js
