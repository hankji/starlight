---
title: Linux Service 示例
---

## Apache 和 MySQL 制作 Linux Service

### Apache

```sh
grep -v "#" /usr/local/apache-2.2.15/bin/apachectl > /etc/init.d/apache
```

用 `vi` 编辑 Apache 服务控制脚本 `/etc/init.d/apache`：

```sh
vi /etc/init.d/apache
```

在文件最前面插入下面的行，使其支持 `chkconfig` 命令：

```sh
#!/bin/sh
# chkconfig: 2345 85 15
# description: Apache is a World Wide Web server.
```

保存后退出 `vi` 编辑器，执行下面的命令增加 Apache 服务控制脚本执行权限：

```sh
chmod +x /etc/init.d/apache
```

执行下面的命令将 Apache 服务加入到系统服务：

```sh
chkconfig --add apache
```

执行下面的命令检查 Apache 服务是否已经生效：

```sh
chkconfig --list apache
```

命令输出类似下面的结果：

```sh
apache          0:off 1:off 2:on 3:on 4:on 5:on 6:off
```

表明 Apache 服务已经生效，在 2、3、4、5 运行级别随系统启动而自动启动。以后可以使用 `service` 命令控制 Apache 的启动和停止。

启动 Apache 服务：

```sh
service apache start
```

停止 Apache 服务：

```sh
service apache stop
```

### MySQL

复制生成 Linux MySQL 服务器的自动启动与停止脚本：

```sh
cp /usr/local/mysql/share/mysql/mysql.server /etc/rc.d/init.d/mysql
chkconfig --list | grep mysql  # 查询当前是否有 MySQL 服务
chkconfig --add mysql          # 添加 MySQL 服务到服务器管理中
chkconfig --list | grep mysql  # 查询此时 MySQL 服务器的启动状态
chkconfig --level 35 mysql on  # 设置在 3、5 运行级别也自启动
service mysql start            # 或 /etc/rc.d/init.d/mysql start
/usr/local/mysql/bin/mysqladmin version  # 测试服务器是否已启动
/usr/local/mysql/bin/mysqladmin ping     # 出现 "mysql is alive"
```
