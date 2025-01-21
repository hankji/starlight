---
title: mysql双机互备自动切换
description: mysql双机互备自动切换.
---

## 双机互备

(配置文件可参考主从配置: [mysql主从备份](mysql主从备份) )

- 主机A: 192.168.1.94
- 主机B: 192.168.1.92

### 在主机A的配置文件中增加如下配置:

```
binlog-do-db=mipp
binlog-ignore-db=mysql
master-host=192.168.1.92
master-user=user
master-password=mysql
master-port=3306
master-connect-retry=60
replicate-do-db=mipp
```

###  在主机B的配置文件中增加如下配置:

```
binlog-do-db=xxxx
binlog-ignore-db=mysql
master-host=192.168.1.94
master-user=user
master-password=mysql
master-port=3306
master-connect-retry=60
replicate-do-db=mipp
```

## 自动切换

自动切换使用keepalived软件实现,
_在上面两互备服务器基础上, 每台服务器都安装keepalived_
参考 [keepalived](../linux/keepalived)
