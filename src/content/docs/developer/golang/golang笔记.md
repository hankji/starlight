---
title: golang 笔记
---

## Tips

1. 左值可寻址，右值不可寻址
2. 左值可调用值接收及指针接收方法
3. 接口使用时需要区分值接收及指针接收方法

## 调试

1. go test -v -bench . -benchmem -cpu 2 (bench可以使用正则匹配想要的名字)
2. go test -v (v参数冗长模式输出t.Log信息)
3. Go test -v filename.go
4. go test -test.bench=”regexp”
5. go test -run=REG xxx (包或文件)
6. go test -run=NONE -v -bench . -benchmem (只运行benchmark)
7. go test -count=1 -v xx.go (禁用缓存)
8. go test中TestMain(m *testing.m)初始化
   ```
   func TestMain(m *testing.M) {
           sub = genSubject()
           m.Run()
   }
   ```
9. 覆盖率
   * go test -v adindex/index -bench . -benchmem -cover -coverprofile=cover.out
   * go tool cover -func=cover.out
10. go build -race xxxx (竞争检查)
11. CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /tmp/ws
12. go test -v -bench . adserver/service -benchtime=3s -cpuprofile=prof.cpu -o atest
13. 命令行生成的性能文件需要加载二进制运行文件分析`pprof -http=:8080  atest prof.cpu`
14. GOTRACEBACK=crash 开启golang 的coredump

## golang pprof

1. 1.10后pprof自带火焰图, 可以提前安装: go get -u github.com/google/pprof && pprof -http=:8080 /Users/hank/pprof/pprof.test.dap.xxxxxx.com:7000.samples.cpu.015.pb.gz
2. 引入 _ "net/http/pprof"
3. 如果自身有http服务: 

```go
if conf.Config.Log.Loglevel == "debug" {
        r.PathPrefix("/debug").Handler(http.DefaultServeMux)
    }
```

3. 如果没有http服务:

```
go func() {
        log.Println(http.ListenAndServe("localhost:7001", nil))
    }()
```

1. go tool pprof http://test.dap.xxxxxx.com:7011/debug/pprof/profile?debug=1 (1,2)
2. go tool pprof --inuse_space(/--alloc_space)  http://test.dap.xxxxxx.com:7011/debug/pprof/heap?debug=2
3. GODEBUG=gctrace=1 /go/bin/adufc -confdir=/go/src/adufc/config/ 2>gclog.log & //开启GC跟踪
4. **curl -o trace.data "http://test.dap.xxxxxx.com:7000/debug/pprof/trace?seconds=10" 保存到本地后再使用go tool trace trace.data 进行查看.**
5. pprof -http=:8080 profile.out [新版pprof支持]
6. 火焰图:

```
export PATH=$PATH:/Users/hank/Documents/gopath/src/github.com/uber/go-torch/FlameGraph/
go-torch -alloc_space http://127.0.0.1:8080/debug/pprof/heap --colors=mem
go-torch -inuse_space http://127.0.0.1:8080/debug/pprof/heap --colors=mem
go-torch -u http://test.dap.xxxxxx.com:7000/debug/pprof/profile
```

## Mertics 度量

1. http://www.cnblogs.com/yangecnu/p/Using-Metrics-to-Profiling-WebService-Performance.html
2. 

## yaml配置

1. 结构体首字母需要大写
2. yaml文件中需要小写

## http

- 获取客户端ip:

```go
ip := req.Header.Get("X-Real-IP")
if ip == "" {
    ip = req.RemoteAddr
    ip, _, _ = net.SplitHostPort(ip)
}
```

## govendor

### 其基本思路是，将引用的外部包的源代码放在当前工程的vendor目录下面，go 1.6以后编译go代码会优先从vendor目录先寻找依赖包；

1. go get -u -v github.com/kardianos/govendor
2. govendor init
3. govendor list(查看依赖的包)
4. govendor add +external
5. govendor update 包名
6. govendor list| grep "u " |grep -v "v " | awk {'print $2'} | xargs  govendor remove

## go mod (vgo)

1. go mod init github.com/hankji/testmod (这里的名字最好要符合url规范)
2. go mod tidy //清理及添加未写入go.mod文件的包
3. go mod vendor //当前包下创建vendor目录,并cache
4. go build -mod vendor //使用vendor进行构建
5. go mod why -m dep 可以输出引入这个 dep 的路径
6. go download/edit/graph/verify/why //use `go help mod`
7. `env GIT_TERMINAL_PROMPT=1 go get xxxx`  //下载内网私有代码
8. `git config --global url."git@gitlab.com:groupName/projectName.git".insteadOf "https://gitlab.com/groupName/projectName.git"`
9. 同7功能`[url "git@git-pd.xxxxxx.com:xxxxxx/quarenden.git"]
   insteadOf = https://git-pd.xxxxxx.com/xxxxxx/quarenden.git`
10. 本地module导入:`require go-blog/handler/health-check v0.0.0
    replace go-blog/handler/health-check => ../go-blog/handler/health-check  //本地包相对路径或绝对路径`
11. 可以使用`go clean -modcache` 解决一些缓存等问题

### vgo更新

1. `go get -u` 来获取minor或者 patch 更新，比如从1.0.0更新到1.0.1或者1.1.0
2. `go get -u=patch` 来获取最新的patch更新（会更新到1.0.1但不会更新1.1.0）
3. `go get package@version` 来更新特定的版本。

## 预编译

1. http://blog.ralch.com/tutorial/golang-conditional-compilation/

## rpc编码:

1. gencode go -schema rpcParam.schema -package rpcparams (https://github.com/andyleap/gencode)

## 日志打印文件及行号

```
1 log.SetFlags(log.LstdFlags | log.Lshortfile)
2 func HandleError(err error) (b bool) {
    if err != nil {
        // notice that we're using 1, so it will actually log where
        // the error happened, 0 = this function, we don't want that.
        _, fn, line, _ := runtime.Caller(1)
        log.Printf("[error] %s:%d %v", fn, line, err)
        b = true
    }
    return
}
```

## fmt.printf()

```go
package main
import "fmt"
import "os"
type point struct {
    x, y int
}
func main() {
//Go 为常规 Go 值的格式化设计提供了多种打印方式。例如，这里打印了 point 结构体的一个实例。
    p := point{1, 2}
    fmt.Printf("%v\n", p) // {1 2}
//如果值是一个结构体，%+v 的格式化输出内容将包括结构体的字段名。
    fmt.Printf("%+v\n", p) // {x:1 y:2}
//%#v 形式则输出这个值的 Go 语法表示。例如，值的运行源代码片段。
    fmt.Printf("%#v\n", p) // main.point{x:1, y:2}
//需要打印值的类型，使用 %T。
    fmt.Printf("%T\n", p) // main.point
//格式化布尔值是简单的。
    fmt.Printf("%t\n", true)
//格式化整形数有多种方式，使用 %d进行标准的十进制格式化。
    fmt.Printf("%d\n", 123)
//这个输出二进制表示形式。
    fmt.Printf("%b\n", 14)
这个输出给定整数的对应字符。
    fmt.Printf("%c\n", 33)
%x 提供十六进制编码。
    fmt.Printf("%x\n", 456)
//对于浮点型同样有很多的格式化选项。使用 %f 进行最基本的十进制格式化。
    fmt.Printf("%f\n", 78.9)
//%e 和 %E 将浮点型格式化为（稍微有一点不同的）科学技科学记数法表示形式。
    fmt.Printf("%e\n", 123400000.0)
    fmt.Printf("%E\n", 123400000.0)
//使用 %s 进行基本的字符串输出。
    fmt.Printf("%s\n", "\"string\"")
//像 Go 源代码中那样带有双引号的输出，使用 %q。
    fmt.Printf("%q\n", "\"string\"")
//和上面的整形数一样，%x 输出使用 base-16 编码的字符串，每个字节使用 2 个字符表示。
    fmt.Printf("%x\n", "hex this")
//要输出一个指针的值，使用 %p。
    fmt.Printf("%p\n", &p)
//当输出数字的时候，你将经常想要控制输出结果的宽度和精度，可以使用在 % 后面使用数字来控制输出宽度。默认结果使用右对齐并且通过空格来填充空白部分。
    fmt.Printf("|%6d|%6d|\n", 12, 345)
//你也可以指定浮点型的输出宽度，同时也可以通过 宽度.精度 的语法来指定输出的精度。
    fmt.Printf("|%6.2f|%6.2f|\n", 1.2, 3.45)
//要最对齐，使用 - 标志。
    fmt.Printf("|%-6.2f|%-6.2f|\n", 1.2, 3.45)
//你也许也想控制字符串输出时的宽度，特别是要确保他们在类表格输出时的对齐。这是基本的右对齐宽度表示。
    fmt.Printf("|%6s|%6s|\n", "foo", "b")
//要左对齐，和数字一样，使用 - 标志。
    fmt.Printf("|%-6s|%-6s|\n", "foo", "b")
//到目前为止，我们已经看过 Printf了，它通过 os.Stdout输出格式化的字符串。Sprintf 则格式化并返回一个字符串而不带任何输出。
    s := fmt.Sprintf("a %s", "string")
    fmt.Println(s)
//你可以使用 Fprintf 来格式化并输出到 io.Writers而不是 os.Stdout。
    fmt.Fprintf(os.Stderr, "an %s\n", "error")
}
```

- fmt.printf format
  - General
    - %v 以默认的方式打印变量的值
    - %T 打印变量的类型
  - Integer
    - %+d 带符号的整型，fmt.Printf("%+d", 255)输出+255
    - %0*d (%02d) 补零
    - %q 打印单引号
    - %o 不带零的八进制
    - %#o 带零的八进制
    - %x 小写的十六进制
    - %X 大写的十六进制
    - %#x 带0x的十六进制
    - %U 打印Unicode字符
    - %#U 打印带字符的Unicode
    - %b 打印整型的二进制
    - %5d 表示该整型最大长度是5，下面这段代码`fmt.Printf("|%5d|", 1)` `fmt.Printf("|%5d|", 1234567)`
  - Float
    - %f (=%.6f) 6位小数点
    - %e (=%.6e) 6位小数点（科学计数法）
    - %g 用最少的数字来表示
    - %.3g 最多3位数字来表示
    - %.3f 最多3位小数来表示
  - String
    - %s 正常输出字符串
    - %q 字符串带双引号，字符串中的引号带转义符
    - %#q 字符串带反引号，如果字符串内有反引号，就用双引号代替
    - %x 将字符串转换为小写的16进制格式
    - %X 将字符串转换为大写的16进制格式
    - % x 带空格的16进制格式
  - String Width (以5做例子）
    - %5s 最小宽度为5
    - %-5s 最小宽度为5（左对齐）
    - %.5s 最大宽度为5
    - %5.7s 最小宽度为5，最大宽度为7
    - %-5.7s 最小宽度为5，最大宽度为7（左对齐）
    - %5.3s 如果宽度大于3，则截断
    - %05s 如果宽度小于5，就会在字符串前面补零
  - Struct
    - %v 正常打印。比如：{sam {12345 67890}}
    - %+v 带字段名称。比如：{name:sam phone:{mobile:12345 office:67890}
    - %#v 用Go的语法打印。 比如main.People{name:”sam”, phone:main.Phone{mobile:”12345”, office:”67890”}}
  - Boolean
    - %t 打印true或false
  - Pointer
    - %p 带0x的指针
    - %#p 不带0x的指针

## 定时器

```
package main

import (
    "log"
    "time"
)

// Run the function every tick
// Return false from the func to stop the ticker
func Every(duration time.Duration, work func(time.Time) bool) chan bool {
    ticker := time.NewTicker(duration)
    stop := make(chan bool, 1)

    go func() {
        defer log.Println("ticker stopped")
        for {
            select {
            case time := <-ticker.C:
                if !work(time) {
                    stop <- true
                }
            case <-stop:
                return
            }
        }
    }()

    return stop
}

func main() {
    stop := Every(1*time.Second, func(time.Time) bool {
        log.Println("tick")
        return true
    })

    time.Sleep(3 * time.Second)
    log.Println("stopping ticker")
    stop <- true
    time.Sleep(3 * time.Second)
}
```

## CGO

1. GODEBUG=cgocheck=1 go build netsdk.go
2. LD_LIBRARY_PATH=$(pwd)/lib ./netsdk -ip 192.168.1.101 -user admin -passwd admin

## 开源项目

### 阅读

* [https://golang.org/doc/effective_go](https://translate.google.com/website?sl=en&tl=zh-CN&ajax=1&u=https://golang.org/doc/effective_go)
* [https://github.com/golang/go/wiki/CodeReviewComments](https://rre2kuwcysoxr7fi4rj4ukmjku-ac4c6men2g7xr2a-github-com.translate.goog/golang/go/wiki/CodeReviewComments)
* [https://github.com/golang/go/wiki](https://rre2kuwcysoxr7fi4rj4ukmjku-ac4c6men2g7xr2a-github-com.translate.goog/golang/go/wiki)
* [The Go Programming Language Specification - The Go Programming Language](https://golang.org/ref/spec)
* [How to start a Go project in 2023 | Ben E. C. Boyter](https://boyter.org/posts/how-to-start-go-project-2023/)
* [50 Shades of Go: Traps, Gotchas, and Common Mistakes for New Golang Devs](https://devs.cloudimmunity.com/gotchas-and-common-mistakes-in-go-golang/index.html)

### 开源

1. https://github.com/spf13/viper 配置
2. https://github.com/spf13/cast  类型转换
3. https://prometheus.io  监控收集
4. https://awesome-go.com  精彩项目
5. go get -u -v github.com/rakyll/hey
6. go get -u -v golang.org/x/vgo 官方包管理器vendor
7. [go ui](https://ebitenui.github.io)

### GRPC Swagger

1. https://swagger.io
