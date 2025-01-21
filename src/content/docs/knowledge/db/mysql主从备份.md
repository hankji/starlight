---
title: mysql主从备份
description: mysql 主从备份.
---

记录于：_2011年6月3日11时22分_


## *mysql服务器配置*

```sql
![pic](client)
port=3306
#default-character-set=utf8
loose-default-character-set=utf8 (用于mysql-bin在使用时无法使用此选项)
![pic](mysqld)
port=3306
skip-locking
key_buffer = 256M
max_allowed_packet = 1M
table_cache = 256
sort_buffer_size = 1M
read_buffer_size = 1M
read_rnd_buffer_size = 4M
myisam_sort_buffer_size = 64M
thread_cache_size = 8
query_cache_size = 16M
default-character-set=utf8
init_connect='SET NAMES utf8'
max_connections=1000
ft_min_word_len=1
thread_concurrency = 8
log-bin=mysql-bin
expire_logs_days=10
datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
user=mysql
server-id = 1
* Default to using old password format for compatibility with mysql 3.x
* clients (those using the mysqlclient10 compatibility package).
old_passwords=1

* Disabling symbolic-links is recommended to prevent assorted security risks;
* to do so, uncomment this line:
* symbolic-links=0

![pic](mysqld_safe)
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid
![pic](mysqldump)
quick
max_allowed_packet=16M
![pic](mysql)
no-auto-rehash
![pic](isamchk)
key_buffer=128M
sort_buffer_size=128M
read_buffer=2M
write_buffer = 2M
![pic](myisamchk)
key_buffer=128M
sort_buffer_size=128M
read_buffer=2M
write_buffer = 2M
![pic](mysqlhotcopy)
interactive-timeout
```

`注: 所有主从服务器的servier-id不能相同 `

## 示例
* 假设主服务器ip: 192.168.1.94
* 从服务器ip: 192.168.1.92

### 在主服务器上进行的操作
  
  * 授权
    
    ```
    GRANT REPLICATION SLAVE ON *.* to 'rep1'@'192.168.1.92' identified by 'mysql';
    flush privileges;
    ```
  
  * 查询主数据库状态
    
    ```
    mysql> show master status;
    +------------------+----------+--------------+------------------+
    | File             | Position | Binlog_Do_DB | Binlog_Ignore_DB |
    +------------------+----------+--------------+------------------+
    | mysql-bin.000004 |       98 |              |                  | 
    +------------------+----------+--------------+------------------+
    1 row in set (0.00 sec)    
    ```
    
    记下file及position的值,在后面操作会用到

* 配置从服务器
  
  * 修改从服务器的my.cnf文件中server-id值, 保证唯一性
  
  * 启动服务
    
    ```
    service mysqld start
    或/usr/local/mysql/bin/mysqld_safe --user=mysql &
    ```
  
  * 登录mysql
    
    ```
    mysql -uroot -p
    ```
  
  * 执行同步sql语句
    
    ```
    mysql>change master to
    master_host='192.168.1.94',
    master_user='user',
    master_password='mysql',
    master_log_file='mysql-bin.000004',
    master_log_pos=98;
    ```
  
  * 主从同步检查
    
    ```
    mysql> show slave status\G;
    *************************** 1. row ***************************
           Slave_IO_State: Waiting for master to send event
              Master_Host: 192.168.1.94
              Master_User: user
              Master_Port: 3306
            Connect_Retry: 60
          Master_Log_File: mysql-bin.000004
      Read_Master_Log_Pos: 98
           Relay_Log_File: mysqld-relay-bin.000009
            Relay_Log_Pos: 235
    Relay_Master_Log_File: mysql-bin.000004
         Slave_IO_Running: `Yes`
        Slave_SQL_Running: `Yes`
          Replicate_Do_DB: 
      Replicate_Ignore_DB: 
      .....
      .....
    ```
    
    `slave_io及slave_sql进程都必须正常运行, 状态为Yes;否则都是不正确的状态`

*******

### 旧数据处理
如果主数据库服务器已经存在用户数据,那么在进行主从复制前,需要以下处理

* 主数据库锁表操作

```
    mysql> flush tables with read lock;
```

* 查看主数据库的状态

```
    mysql> show master status; 
```

记下file及position的值

* 把主服务器的数据文件复制到从服务器
* 取消主数据库锁定

```
mysql> unlock tables;
```

* 从服务器的操作和前面的步骤一样(略)

## 常见主从同步问题

#### id冲突

```
slave:mysql> stop slave;   #停掉slave的复制先。
master:mysql> flush tables with read lock; #锁掉master服务器的所有表，禁止写入。
master:mysql> show master status; #还是上面的语句，查看并记录下 File mysql-bin.000002, Position 1087
+------------------+----------+----------------------------------+------------------+
| File             | Position | Binlog_Do_DB                     | Binlog_Ignore_DB |
+------------------+----------+----------------------------------+------------------+
| mysql-bin.000002 |     1087 | test_db                          |                  |
+------------------+----------+----------------------------------+------------------+
1 row in set (0.00 sec)
chluo@master:~$ mysqldump test_db > test_db.sql  #在命令行中导出DB的数据，这里是bash操作：）
master:mysql> unlock tables; #导出完成之后，解锁。 master可以继续跑起来了。
chluo@slave:~$ mysql test_db < test_db.sql  #在slave的命令行中导入DB的数据，这里又是bash操作：）
slave:mysql> change master to
    -> master_log_file='mysql-bin.000002',  #将这里修改为刚记录下来的数据
    -> master_log_pos=1087;   #还有这里
slave:mysql> start slave;
slave:mysql> change master to master_host='xx.xx.79.54', master_user='slave', master_password='xxxxx',master_log_file='binlog.000001',master_log_pos=8843;
change master to master_host='xx.xx.92.32', master_user='slave', master_password='xxxxx', master_log_file='binlog.000011', master_log_pos=120611482;
init-file=/usr/local/mysql/init.sql
USE adserv;
INSERT INTO adserv.adindex (SELECT * FROM adservp.adindex);
INSERT INTO adserv.adindex_goto (SELECT * FROM adservp.adindex_goto);
slave:mysql> set session transaction isolation level read committed;
show variables like "%transaction%";
show variables like "%binlog%";
```

```
/usr/local/mysql/bin/mysqlbinlog /opt/projects/mysql/data/binlog.000149 --start-datetime='2011-6-16 17:13:50' |grep '121212'| less
slave stop;set GLOBAL SQL_SLAVE_SKIP_COUNTER=1;slave start;
```
