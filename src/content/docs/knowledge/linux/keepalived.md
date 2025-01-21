---
title: keepalived配置
---

## 自动切换使用keepalived软件实现

在上面两互备服务器基础上, 每台服务器都安装keepalived

```
MASTER: 192.168.1.94
BACKUP: 192.168.1.92
VIP: 192.168.1.90
```

### 软件安装

```bash
wget http://www.keepalived.org/software/keepalived-1.2.2.tar.gz
tar xzvf keepalived-1.2.2.tar.gz
cd keepalived
./configure --prefix=/usr/local/keepalived
make && make install
```

### 软件配置

```bash
cp /usr/local/keepalived/etc/rc.d/init.d/keepalived /etc/rc.d/init.d/
cp /usr/local/keepalived/etc/sysconfig/keepalived /etc/sysconfig/
mkdir /etc/keepalived
cp /usr/local/keepalived/etc/keepalived/keepalived.conf /etc/keepalived/
ln -s /usr/local/keepalived/sbin/keepalived /usr/sbin/
service keepalived start
```

### keepalived配置文件参考

```bash
[root@vmCentos keepalived]* cat /etc/keepalived/keepalived.conf 
! Configuration File for keepalived

global_defs {
    notification_email {
     admin@163.com
    }
    notification_email_from keepalived@localhost.com
    smtp_server 127.0.0.1
    smtp_connect_timeout 30
    router_id LVS_DEVEL
}

# 如果执行自定义脚本添加如下配置
# vrrp_script check_run {
#    script "/root/keepalived_check_mysql.sh"
#    interval 5
# }

vrrp_instance VI_1 {
     state BACKUP
     interface eth0
     virtual_router_id 51
     priority 90
     advert_int 1
     authentication {
          auth_type PASS
          auth_pass acmeptt
     }
     # 如果执行自定义脚本添加如下配置
     # track_script {
     #    check_run
     # }
     virtual_ipaddress {
          192.168.1.90
     }
}
```

### 测试服务器切换

在服务器94上执行: `ip a`，可以看到主服务器已经绑定虚拟IP

```bash
[root@localhost ~]* ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 16436 qdisc noqueue 
     link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
     inet 127.0.0.1/8 scope host lo
     inet6 ::1/128 scope host 
         valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast qlen 1000
     link/ether b8:ac:6f:c2:b0:8e brd ff:ff:ff:ff:ff:ff
     inet 192.168.1.94/24 brd 192.168.1.255 scope global eth0
     inet 192.168.1.90/32 scope global eth0
     inet6 fe80::baac:6fff:fec2:b08e/64 scope link 
         valid_lft forever preferred_lft forever
```

- ping VIP，保证虚拟服务器可以正常连接
- telnet 相关服务端口
- 在主服务器上停止keepalive服务后，重复上面两步操作

### 自定义脚本示例

```bash
vim /root/keepalived_check_mysql.sh
#!/bin/bash
MYSQL=/usr/local/mysql/bin/mysql
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=password
CHECK_TIME=3
# mysql is working MYSQL_OK is 1 , mysql down MYSQL_OK is 0
MYSQL_OK=1
function check_mysql_helth (){
$MYSQL -h $MYSQL_HOST -u $MYSQL_USER -p${MYSQL_PASSWORD} -e "show status;" >/dev/null 2>&1
if [ $? = 0 ] ;then
MYSQL_OK=1
else
MYSQL_OK=0
fi
return $MYSQL_OK
}
while [ $CHECK_TIME -ne 0 ]
do
let "CHECK_TIME -= 1"
check_mysql_helth
if [ $MYSQL_OK = 1 ] ; then
CHECK_TIME=0
exit 0
fi
if [ $MYSQL_OK -eq 0 ] && [ $CHECK_TIME -eq 0 ]
then
/etc/init.d/keepalived stop
exit 1
fi
sleep 1
done
```
