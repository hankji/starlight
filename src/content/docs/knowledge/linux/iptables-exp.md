---
title: iptables示例
---
### iptables示例

* iptables -A INPUT -i lo -j ACCEPT
* iptables -A INPUT -p tcp -m multiport --dports 22,80 -j ACCEPT
* iptables -A INPUT -p udp --dport 53 -j ACCEPT
* iptables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
* iptables -P INPUT DROP
* 注： -m state --state ESTABLISHED 扮演很重要角色，那就是允许连线出去后对方主机回应进来的封包。
* iptables -P INPUT DROP 表示默认策略是否定

```bash
iptables -A INPUT -i lo -j ACCEPT
例如做 ORACLE 服务器，或者有 X 的环境下，有些进程是需要自己连接自己的
如果 INPUT 链设置过死，而又恰恰没有允许 lo 自己连接自己，那么会导致有些进程跑步起来，应用程序无法正常运行的状况

iptables -A INPUT -p tcp -s 203.156.xxx.0/24 --dport 22 -j ACCEPT
iptables -A OUTPUT -p tcp -s 203.156.xxx.0/24 --sport 22 -j ACCEPT
iptables -P INPUT DROP
iptables -P OUTPUT DROP
iptables -P FORWARD DROP
iptables -A INPUT -p icmp -s 203.156.xxx.0/24 -j ACCEPT
iptables -A OUTPUT -p icmp -s 203.156.xxx.0/24 -j ACCEPT
iptables -A INPUT -p udp --sport 53 -j ACCEPT
iptables -A OUTPUT -p udp --dport 53 -j ACCEPT
iptables -A INPUT -s 127.0.0.0/24 -d 127.0.0.0/24 -j ACCEPT
iptables -A OUTPUT -s 127.0.0.0/24 -d 127.0.0.0/24 -j ACCEPT
iptables -A INPUT -p udp --dport 53 -j ACCEPT
iptables -A OUTPUT -p udp --sport 53 -j ACCEPT
iptables -A INPUT -p tcp --dport 25 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 25 -j ACCEPT
iptables -A INPUT -p tcp --dport 110 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 110 -j ACCEPT
iptables -A INPUT -p tcp --dport 953 -j ACCEPT
iptables -A OUTPUT -p tcp --sport 953 -j ACCEPT
```

添加路由

```bash
iptables -t nat -A POSTROUTING -s 10.119.0.0/16 -o eth0 -j MASQUERADE
iptables -t nat -A POSTROUTING -s 10.120.0.0/16 -o eth0 -j MASQUERADE
iptables -t nat -A POSTROUTING ! -d 10.0.0.0/8 -o eth1 -j MASQUERADE
```