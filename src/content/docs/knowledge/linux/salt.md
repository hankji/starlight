---
title: salt安装
---

## Salt 简介

Salt 是一个基础设施管理工具，能够实现远程执行、配置管理和云管理等功能。它采用了高效的消息传递机制，使得在大规模环境中管理系统变得更加简单和高效。

## 安装步骤

### 1. 安装 EPEL RPM 包

首先安装 EPEL RPM 包：

```sh
rpm -ivh http://mirrors.sohu.com/fedora-epel/6Server/x86_64/epel-release-6-8.noarch.rpm
```

### 2. 安装 Salt Master

使用 yum 安装 salt-master：

```sh
yum install salt-master
```

### 3. 配置 Salt Master

编辑 Salt Master 配置文件（默认路径：`/etc/salt/master`）：

```sh
# vi /etc/salt/master
interface: 10.0.2.15
file_roots:
  base:
    - /srv/salt/
  dev:
    - /srv/salt/dev/
  prod:
    - /srv/salt/prod/
```

### 4. 创建目录并配置文件

创建以上目录并创建配置文件：

```sh
mkdir -p /srv/salt /srv/salt/dev /srv/salt/prod
```

### 5. 配置 Salt Minion

编辑 Salt Minion 配置文件（默认路径：`/etc/salt/minion`）：

```sh
master: saltmaster.minisite.com
id: test.minisite.com
# 这里最好配置在 hosts 中，尽量少用 IP 指定
```

### 6. 认证 Minion

在 Master 端查看 Minion 端证书并进行认证：

```sh
[root@MyCentOs salt]# salt-key -L
Accepted Keys:
Unaccepted Keys:
test.minisite.com
Rejected Keys:
[root@MyCentOs salt]# salt-key -a test.minisite.com
```

### 7. 验证通信

验证 Master 与 Minion 之间的通信：

```sh
[root@MyCentOs salt]# salt '*' test.ping 
test.minisite.com:
    True
```

## Salt 使用技巧

### 推送最新配置

推送最新配置到 Minion：

```sh
salt '*_web.minisite.com' state.highstate -v test=True 
```

### 查看信息

查看 grains 分类：

```sh
salt '*' grains.ls
```

查看 grains 所有信息：

```sh
salt '*' grains.items
```

查看 grains 某个信息：

```sh
salt '*' grains.item osrelease
```

### Minion 自主保持状态

默认的 state 只有在服务端调用的时候才执行，很多时候我们希望 Minion 自觉地去保持在某个状态：

```sh
# cat /srv/pillar/top.sls 
base:
  "*":
    - schedule

# cat /srv/pillar/schedule.sls
schedule:
  highstate:
    function: state.highstate
    minutes: 30
# 文档: http://docs.saltstack.com/topics/jobs/schedule.html
```

### 启动服务

启动、停止或重启 Salt Master 服务：

```sh
service salt-master start|stop|restart
```
