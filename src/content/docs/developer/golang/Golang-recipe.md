---
title: Golang-recipe
description: A guide in my new Starlight docs site.
---

### `go list` Command

1. **Get packages without tests**
    ```sh
    go list -json ./... | jq -rc 'select((.TestGoFiles | length)==0) | .ImportPath'
    ```
2. **Get Go version of current module**
    ```sh
    go mod edit -json | jq -r .Go
    ```
3. **Get Go versions of upstream modules**
    ```sh
    go list -deps -json ./... | jq -rc 'select(.Standard!=true and .Module.GoVersion!=null) | [.Module.GoVersion,.Module.Path] | join(" ")' | sort -V | uniq
    ```
4. **Get directly dependent modules that can be upgraded**
    ```sh
    go list -u -m $(go list -m -f '{{.Indirect}} {{.}}' all | grep '^false' | cut -d ' ' -f2) | grep '\['
    ```
5. **Get upstream modules without Go version**
    ```sh
    go list -deps -json ./... | jq -rc 'select(.Standard!=true and .Module.GoVersion==null) | .Module.Path' | sort -u
    ```
6. **Get available module versions**
    ```sh
    go list -m -versions github.com/google/gofuzz
    ```
7. **Show compiler optimization decisions on heap and inlining**
    ```sh
    go build -gcflags="-m -m" . 2>&1 | grep inline
    ```
    **Disable inlining:**
    ```sh
    go build -gcflags="-l" .
    ```

### `go-plantuml`

- **Install:** 
    ```sh
    go install github.com/bykof/go-plantuml@latest
    ```
- **Usage:** 
    ```sh
    go-plantuml generate -d . -r -o graph.puml
    ```
- **在线生成:** [PlantUML](https://www.plantuml.com/plantuml/uml)

### Make Graph of Function Calls in Package with `go-callvis`

- **Install:** 
    ```sh
    go install github.com/ofabry/go-callvis
    ```
- **Usage:** 
    ```sh
    go-callvis .
    ```

### Explore Go Code in Browser Powered by `go-guru` with `pythia`

- **Install:** 
    ```sh
    go install github.com/fzipp/pythia@latest
    go install golang.org/x/tools/cmd/guru@latest
    ```
- **Usage:** 
    ```sh
    pythia net/http
    ```

### Generate Mocks with `mockgen`

- **Install:** 
    ```sh
    go install go.uber.org/mock/mockgen@latest
    ```
- **Usage:** 
    ```sh
    mockgen -source=foo.go [other options]
    ```

### fieldalignment

- **Link**
[更多描述](https://golangprojectstructure.com/how-to-make-go-structs-more-efficient/)
- **Install:**
    ```sh
    go install golang.org/x/tools/go/analysis/passes/fieldalignment/cmd/fieldalignment@latest
    ```
- **Usage:** 
    ```sh
    fieldalignment main.go
    ```

### modernize

- **介绍:**
用于检测可以使用新版本功能的工具
- **Install:**
    ```sh
    $ go run golang.org/x/tools/gopls/internal/analysis/modernize/cmd/modernize@latest -fix -test ./...
    ```

