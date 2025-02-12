---
title: SSH Tunnel
---

## ssh 参数
```
-C  压缩数据传输
-f  后台登录用户名密码
-N  不执行shell[与 -g 合用]
-g  允许打开的端口让远程主机访问        
-L  本地端口转发
-R  远程端口转发
-p  ssh 端口
```

## 开tunnels的2大作用

1. 加密SSH client 与 SSH server 传输的数据
2. 突破防火墙限制

## 绑定本地端口

既然SSH可以传送数据，那么我们可以让那些不加密的网络连接，全部改走SSH连接，从而提高安全性。假定我们要让8080端口的数据，都通过SSH传向远程主机，命令如下：

```sh
$ ssh -D 8080 user@host
```

SSH会建立一个socket，去监听本地的8080端口。一旦有数据传向那个端口，就自动把它转移到SSH连接上面，发往远程主机。可以想象，如果8080端口原来是一个不加密端口，现在将变成一个加密端口。

## 本地端口转发

有时，绑定本地端口还不够，还必须指定数据传送的目标主机，从而形成点对点的"端口转发"。为了区别后文的"远程端口转发"，我们把这种情况称为"本地端口转发"（Local forwarding）。假定host1是本地主机，host2是远程主机。由于种种原因，这两台主机之间无法连通。但是，另外还有一台host3，可以同时连通前面两台主机。因此，通过host3，将host1连上host2。我们在host1执行下面的命令：

```sh
$ ssh -L 2121:host2:21 host3
```

命令中的L参数一共接受三个值，分别是"本地端口:目标主机:目标主机端口"，它们之间用冒号分隔。这条命令的意思，就是指定SSH绑定本地端口2121，然后指定host3将所有的数据，转发到目标主机host2的21端口（假定host2运行FTP，默认端口为21）。这样一来，我们只要连接host1的2121端口，就等于连上了host2的21端口。

```sh
$ ftp localhost:2121
```

"本地端口转发"使得host1和host3之间仿佛形成一个数据传输的秘密隧道，因此又被称为"SSH隧道"。

## 远程端口转发

既然"本地端口转发"是指绑定本地端口的转发，那么"远程端口转发"（remote forwarding）当然是指绑定远程端口的转发。还是接着看上面那个例子，host1与host2之间无法连通，必须借助host3转发。但是，特殊情况出现了，host3是一台内网机器，它可以连接外网的host1，但是反过来就不行，外网的host1连不上内网的host3。这时，"本地端口转发"就不能用了，怎么办？解决办法是，既然host3可以连host1，那么就从host3上建立与host1的SSH连接，然后在host1上使用这条连接就可以了。我们在host3执行下面的命令：

```sh
$ ssh -R 2121:host2:21 host1
```

R参数也是接受三个值，分别是"远程主机端口:目标主机:目标主机端口"。这条命令的意思，就是让host1监听它自己的2121端口，然后将所有数据经由host3，转发到host2的21端口。由于对于host3来说，host1是远程主机，所以这种情况就被称为"远程端口绑定"。绑定之后，我们在host1就可以连接host2了：

```sh
$ ftp localhost:2121
```

这里必须指出，"远程端口转发"的前提条件是，host1和host3两台主机都有sshD和ssh客户端。

## SSH的其他参数

SSH还有一些别的参数，也值得介绍。N参数，表示只连接远程主机，不打开远程shell；T参数，表示不为这个连接分配TTY。这个两个参数可以放在一起用，代表这个SSH连接只用来传数据，不执行远程操作。

```sh
$ ssh -NT -D 8080 host
```

f参数，表示SSH连接成功后，转入后台运行。这样一来，你就可以在不中断SSH连接的情况下，在本地shell中执行其他操作。

```sh
$ ssh -f -D 8080 host
```

### Nginx的端口转发服务再结合SSH的话，可以实现加密传输。

想起了针对这类的私有API加密服务，可以尝试一下。

考来源：[SSH原理与应用](http://www.ruanyifeng.com/blog/2011/12/ssh_port_forwarding.html)

例子：AB 一个网段 CD一个网段 只有A能SSH连接到C

B------A---ssh--->C------D

> 情况一 A想访问D

本地转发(正向端口转发)

```sh
ssh -L 8000:D:8888 c@c 
```

> 情况二 C想访问B

远程转发(反向端口转发)

```sh
ssh -R 8888:B:22 c@c
```

### 如何保持持久的SSH链接

用ssh链接服务端，一段时间不操作或屏幕没输出（比如复制文件）的时候，会自动断开。解决办法有两种：

1. 在客户端配置

```sh
vi /etc/ssh/ssh_config
```

添加：

```
Host *
ServerAliveInterval 30
```

这表示要让所有的ssh连接自动加上此属性；如果要指定服务端，如下：

```sh
ssh -o ServerAliveInterval=30 IP地址 
```

2. 在服务端

编辑服务器 `/etc/ssh/sshd_config`，最后增加：

```
ClientAliveInterval 60
ClientAliveCountMax 1
```

这样，SSH Server 每 60 秒就会自动发送一个信号给 Client，而等待 Client 回应。

### 示例

1. 将本地端口映射到213服务器的2222端口，用于远程透过内网连接公司电脑：

```sh
ssh -N -f -R 2222:127.0.0.1:22 xxxxx@10.10.10.10 -p 2005
```

2. 访问本地2121端口，连接234.234.234.234的21端口：

```sh
ssh -N -f -L 2121:234.234.234.234:21 user@123.123.123.123
```

3. 映射远端服务器端口18080到本地17070端口：

```sh
ssh -R 18080:127.0.0.1:17070 hank-vm-dev -N
```

4. 动态端口请求：

```sh
ssh -N -D 8555 -p 7007 security@hemm.cc
```

5. 通过本地代理连接：

```sh
ssh -o ProxyCommand="nc -X 5 -x 127.0.0.1:8555 %h %p" -p 2222 security@32.116.34.133
```