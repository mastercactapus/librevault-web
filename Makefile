.PHONY: clean all


librevault-web: static.go *.go
	go build
librevault-web.exe: static.go *.go
	GOOS=windows go build
librevault-web.darwin: static.go *.go
	GOOS=darwin go build -o librevault-web.darwin

static.go: dist/bundle.js index.html
	go generate

dist/bundle.js: $(shell find src -print)
	node_modules/.bin/webpack --progress -p

all: librevault-web librevault-web.exe librevault-web.darwin

clean:
	rm -rf dist librevault-web* static.go
