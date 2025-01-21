---
title: flag包
---

## 关于Flag

`flag`包在解析命令行参数时，会将传递的`args`参数分解为标志参数和非标志参数。

标志参数是以`-`或`--`开头的参数，用于指定特定的选项或配置。标志参数可以有关联的值，例如`-host example.com`中的`-host`是标志参数，而`example.com`是与之关联的值。

非标志参数是除了标志参数之外的所有参数。它们通常是位置相关的参数，用于提供位置相关的输入或操作。

以下是`flag`包解析命令行参数时的分解规则：

1. 所有以`-`或`--`开头的参数都被视为标志参数。例如：`-host example.com`和`--port 8080`。

2. 标志参数可以使用单个`-`或双`--`，例如：`-host`和`--host`是等效的。

3. 标志参数可以有关联的值。关联值可以通过空格分隔或使用等号（`=`）连接。例如：`-host example.com`和`--port=8080`。

4. 非标志参数是剩余的未被解析为标志参数的参数。它们按照它们在命令行中出现的顺序进行处理。

以下是一个示例程序，演示`flag`包如何分解`args`参数：

```go
package main

import (
    "flag"
    "fmt"
)

func main() {
    // 定义命令行参数
    host := flag.String("host", "localhost", "服务器主机名")
    port := flag.Int("port", 8080, "服务器端口号")

    // 解析命令行参数
    flag.Parse()

    // 非标志参数
    args := flag.Args()

    // 输出结果
    fmt.Println("标志参数:")
    fmt.Println("host:", *host)
    fmt.Println("port:", *port)

    fmt.Println("\n非标志参数:")
    for i, arg := range args {
        fmt.Printf("参数 %d: %s\n", i, arg)
    }
}
```

在上面的示例中，我们使用`flag.Args()`函数获取非标志参数。它返回一个字符串切片，包含所有未被解析为标志参数的参数。

例如，当我们执行以下命令时：

```
go run main.go -host example.com -port 9000 arg1 arg2
```

输出将为：

```
标志参数:
host: example.com
port: 9000

非标志参数:
参数 0: arg1
参数 1: arg2
```

在这个示例中，`example.com`和`9000`是标志参数，而`arg1`和`arg2`是非标志参数。

希望这个示例能帮助你理解`flag`包如何分解`args`参数，并提取标志参数和非标志参数。
