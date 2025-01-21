---
title: NC命令
description: A guide in my new Starlight docs site.
---

## 端口扫描

```bash
$nc -z -v -n 172.31.100.7 21-25
```

> 可以运行在TCP或者UDP模式，默认是TCP，-u参数调整为udp.
> 
> z 参数告诉netcat使用0 IO,连接成功后立即关闭连接， 不进行数据交换(谢谢@jxing 指点)
> 
> v 参数指使用冗余选项（译者注：即详细输出）
> 
> n 参数告诉netcat 不要使用DNS反向查询IP地址的域名
> 
> 这个命令会打印21到25 所有开放的端口。Banner是一个文本，Banner是一个你连接的服务发送给你的文本信息。当你试图鉴别漏洞或者服务的类型和版本的时候，Banner信息是非常有用的。但是，并不是所有的服务都会发送banner。
> 
> 一旦你发现开放的端口，你可以容易的使用netcat 连接服务抓取他们的banner。

```bash
$ nc -v 172.31.100.7 21
```

> netcat 命令会连接开放端口21并且打印运行在这个端口上服务的banner信息。

## Chat Server

```bash
$nc -l 1567    
```

> netcat 命令在1567端口启动了一个tcp 服务器，所有的标准输出和输入会输出到该端口。输出和输入都在此shell中展示。

```bash
$nc 172.31.100.7 1567
```

> 不管你在机器B上键入什么都会出现在机器A上。

## 文件传输

```bash
server$ nc -l 1567 < file.txt
client$ $nc -n 172.31.100.7 1567 > file.txt
或者
server$ nc -l 1567 > file.txt
client$ nc 172.31.100.23 1567 < file.txt
```
