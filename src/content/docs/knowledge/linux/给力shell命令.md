---
title: 给力shell命令
description: 给力的shell命令.
---

| [鸟哥私房菜](../鸟哥私房菜) |

* 显示消耗内存/CPU最多的10个进程

```bash
ps aux | sort -nk +4 | tail
ps aux | sort -nk +3 | tail
```

* 查看Apache的并发请求数及其TCP连接状态

```bash
 netstat -n | awk '/^tcp/ {++S![pic]($NF)} END {for(a in S) print a, S![pic](a)}'
```

* 查看http连接

```bash
netstat -n | awk '/tcp/ {++state![pic]($NF)} END {for(key in state) print key,"\t",state![pic](key)}'
```

* 按ip查看httpd连接数: 

```bash
netstat -anlp | grep 80 | grep tcp | awk {'print $5'} | awk -F: {'print $1'}| sort |uniq -c | sort -nr |more
netstat -anptcp | grep EST | awk '{print $5}' | awk -F '![pic](.)' '{print $1"."$2"."$3"."$4}' | sort | uniq -c | sort -rn
```

* 查看SYN状态的http连接

```bash
netstat -an | grep SYN | awk '{print $5}' | awk -F: '{print $1}' | sort | uniq -c | sort -nr | more
netstat -an | grep ESTABLISHED | awk '{print $5}' | awk -F: '{print $1}' | sort | uniq -c | sort -nr | more
netstat -an | grep TIME_WAIT | awk '{print $5}' | awk -F: '{print $1}' | sort | uniq -c | sort -nr | more
netstat -tna | cut -b 49- |grep TIME_WAIT | sort |more
```

* 查看TIME_WAIT状态的http连接

```bash
netstat -tna | cut -b 49- |grep TIMEWAIT | sort |more netstat -an | grep TIMEWAIT | awk '{print $5}' | awk -F: '{print $1}' | sort | uniq -c | sort -nr | more
```

* 查看ESTABLISHED状态的http连接

```bash
netstat -an | grep ESTABLISHED | awk '{print $5}' | awk -F: '{print $1}' | sort | uniq -c | sort -nr | more netstat -an | grep ":80" | grep ESTABLISHED | sort | more
```

* 找出自己最常用的10条命令及使用次数（或求访问最多的ip数）

```bash
 sed -e ‘s/| /\n/g’ ~/.bash_history |cut -d ‘'‘' -f 1 | sort | uniq -c | sort -nr | head 
```

* 日志中第10个字段表示连接时间，求平均连接时间

```bash
cat access_log |grep "connect cbp" |awk 'BEGIN{sum=0;count=0;}{sum+=$10;count++;}END{printf("sum=%d,count=%d,avg=%f\n",sum,count,sum/count)}' 
```

* lsof命令

```bash
lsof abc.txt 显示开启文件abc.txt的进程
lsof -i :22 知道22端口现在运行什么程序
lsof -c abc 显示abc进程现在打开的文件
lsof -p 12  看进程号为12的进程打开了哪些文件
```

* 杀掉一个程序的所有进程
  * pkill -9 httpd
  * killall -9 httpd
    `注意尽量不用-9，数据库服务器上更不能轻易用kill，否则造成重要数据丢失后果将不堪设想。`
* rsync命令（要求只同步某天的压缩文件，而且远程目录保持与本地目录一致）

```bash
/usr/bin/rsync -azvR –password-file=/etc/rsync.secrets `find . -name "*$yesterday.gz"  -type f ` storage@192.168.2.23::logbackup/13.21/
```

* 把目录下*.sh文件改名为*.SH
  * `find .  -name "*.sh" | sed  's/\(.*\)\.sh/mv \0 \1.SH/' |sh`
  * `find .  -name "*.sh" | sed  's/\(.*\)\.sh/mv & \1.SH/'|sh`  （跟上面那个效果一样）
* ssh执行远程的程序，并在本地显示

```bash
ssh -n -l xxxxx 192.168.2.14 "ls -al /home/xxxxx"
```

* 直接用命令行修改密码

```bash
echo "xxxxxPassword" |passwd –stdin xxxxx
```

* ssh免密码登录

```bash
ssh-keygen
ssh-copy-id -i ~/.ssh/id_rsa.pub user@remoteServer
```

* 以http方式共享当前文件夹的文件
  
  ```
  $python -m SimpleHTTPServer
  在浏览器访问http://IP:8000/即可下载当前目录的文件。
  ```

* shell段注释

```bash
:<<'echo hello,world!'
```

* 查看服务器序列号

```bash
dmidecode |grep "Serial Number"   （查看机器其他硬件信息也可用这个命令）
```

* 查看网卡是否有网线物理连接

```bash
/sbin/mii-tool
```

* 查找几分钟前修改的文件:

```bash
find . -mmin +6 -type f -name '*.rrd' 
find . -mmin -30 -type f -exec rm {} \;
```

* Linux踢出已登录用户的方法：

```bash
# pkill -KILL -t pts/0 (pts/0为w指令看到的用户终端号)
```

* 网络查看

```bash
route -n # 查看路由表
netstat -lntp # 查看所有监听端口 (netstat -anpo|grep ':80'|wc -l 查看80链接)
netstat -antp # 查看所有已经建立的连接
netstat -s # 查看网络统计信息
```

* 查看组用户:

```bash
getent group daemon
```

* 系统硬盘read only时:

```bash
root@www ~]* mount -n -o remount,rw /
```

* 光盘挂载:  [root@www ~]# mount -o loop /root/centos5.2_x86_64.iso /mnt/centos_dvd
* ps 显示结果补全:  ps -efww
* ps -fj ax
* 系统连接查看:

```bash
netstat -n | awk '/^tcp/ {++S![pic]($NF)} END {for(a in S) print a, S![pic](a)}'
```

* 踢掉已登录用户: pkill -kill -t tty (如: pkill -kill -t pts/1)
* 查找文件中包括"a"或"b"但不包含"c",第2~6列的和为第7列, 大于第7列平均值的行数

```bash
grep -v c test3|egrep "a|b"|awk -F ',' 'BEGIN{OFS=",";sum=0}{sum+=$2+$3+$4+$5+$6;print $0,sum}'|awk -F ',' 'BEGIN{sum=0;avg=0;num=0}{sum+=$8;a![pic](NR)=$8}END{avg=sum/NR;for (var in a){if (a![pic](var)>avg){num+=1}};print num}'
```

* 查看网卡速率: ethtool eth0/1
* 从某主机的80端口开启到本地主机2001端口的隧道

```bash
ssh -N -L2001:localhost:80 somemachine
```

* 快速备份一个文件: `cp filename{,.bak}`
* 批量修改图片大小: find ./ -name '*.jpg' -exec convert -resize 600x480 {} {} \;
* cat正常,less命令乱码时可使用以下两种方法: 
  * export LESS=-isMrf (或添加到登录脚本中)
  * export LESSCHARSET=utf-8 (推荐)
* 从下面的例子当中我们也可以知道，指令之后的选项除了前面带有减号『-』之外，某些特殊情况下，选项或参数前面也会带有正号『+』的情况
  * date +%Y/%m/%d
* date -d '1970-01-01 UTC 1343723811 seconds' +"%Y-%m-%d %T"  转换时间戳

* 查找某目录下 最近120分中修改的文件 find /opt/projects/deploy/pmis -cmin -120
* 查看访问量 `tail -10000 /opt/weblogs/minisite-access.log |awk {'print $7'} |sort |uniq -c |sort -nr |more`

## Webserver 相关
* 实时查看正在执行的sql语句

```bash
/usr/sbin/tcpdump -i eth0 -s 0 -l -w - dst port 3306 | strings | egrep -i 'SELECT|UPDATE|DELETE|INSERT|SET|COMMIT|ROLLBACK|CREATE|DROP|ALTER|CALL'
```

* 查看http连接

```bash
netstat -n | awk '/tcp/ {++state![pic]($NF)} END {for(key in state) print key,"\t",state![pic](key)}'
```

* 查看SYN状态的http连接

```bash
netstat -an | grep SYN | awk '{print $5}' | awk -F: '{print $1}' | sort | uniq -c | sort -nr | more
```

* 查看TIME_WAIT状态的http连接
  
```bash
netstat -tna | cut -b 49- |grep TIMEWAIT | sort |more netstat -an | grep TIMEWAIT | awk '{print $5}' | awk -F: '{print $1}' | sort | uniq -c | sort -nr | more
```

* 查看ESTABLISHED状态的http连接
  
```bash
netstat -an | grep ESTABLISHED | awk '{print $5}' | awk -F: '{print $1}' | sort | uniq -c | sort -nr | more netstat -an | grep ":80" | grep ESTABLISHED | sort | more
```

* 批量kill进程
  
```bash
ps -efww|grep sqlr-listener|grep -v grep|cut -c 9-15|xargs kill -9
```

* 查看活动的php-cgi连接数
  
```bash
netstat -anpo|grep php-cgi|wc -l
```

* 按ip查看httpd连接数 

```bash
netstat -anlp | grep 80 | grep tcp | awk {'print $5'} | awk -F: {'print $1'}| sort |uniq -c | sort -nr
netstat -n | awk '/^tcp /{++S![pic]($NF)} END {for(a in S) print a, S![pic](a)}'
```

* 禁IP 

```bash
iptables -A INPUT -s IP地址 -j REJECT iptables -A INPUT -s IP地址/24 -j REJECT
route add -net IP地址 netmask 255.255.255.0 reject
```

* 查看系统状态 

```bash
vmstat 1 10 
iostat 1 10 
iostat -x
netstat iptraf
```

* DNS 解析 

```bash
tcpdump host xxx.106.0.20 and port 53 -X -s 500 -l -nn -i eth1
```

* 分析access log 

```bash
tail -n 10000 access-www.log |awk '{print$7}' |sort |uniq -c | sort -nr|more
```

* 刷新 memcached 

```bash
echo 'flush_all' | nc 127.0.0.1 11211
```

* 查看 load average 

```bash
awk '{print $1}' /proc/loadavg
```

* 查看80端口连接状态 

```bash
netstat -ntl|awk '$4~/:80$/ {print $6}'|sort|uniq -c
```

* 定时任务

```
用cron处理定时任务,首先要保证cron操作已经运行。如果安装了cron 的话。正常情况下cron已经开机自运行了，如果没有运行的话。
/etc/init.d/cron start
用crontab来安排定时任务
.crontab [-u user] {-l| -r | -e} .-l:显示任务 .-e:编辑任务 .-r:清空任务
任务格式为: 分 时 日期 月份 星期 操作命令 eg:
##每天14点运行一次 * 14 * * * echo " look me" >> /home/lost/test
##表示每两分钟运行一次 0-59/2 * * * * echo "look me" >> /tmp/test
##表示2与15点运行一次 * 2,15 * * * echo "look me " >> /tmp/test
: 表示任意 - : 表示区间. / :表示频率 , ：表示枚举\ [http://linux.vbird.org/linux_basic/0430cron.php#cron](http://linux.vbird.org/linux_basic/0430cron.php#cron.md)
```

* 跟踪指定的进程pid.

```
strace -p pid gdb -p pid
```

* 文件系统相关 
* 批量查找文件并删除 

```
find . -name test.php -exec rm {} \; find . -name test.php | xargs rm -rf
```

* 更改某一目录下所有目录的权限, 不包括文件, aaa 是目录名

```
find aaa -type d -exec chmod 755 {} \;
```

* 替换文件内容

```
sed -i 's/b/strong/g' index.html 此命令搜索 index.html 文件中的 b 并将其替换为 strong。
```

* 打包 ssh 到另一 server 解包

```
tar zcvf - ./data | ssh webserver "cat > xxx.tgz" tar zcvf - ./data | (cd ./aaa/; tar zxvf -)
```

* 文件中查找

```
grep -nr "aaa" . sed -i "s/aaa/bbb/g" grep "aaa" -rl .
```

* 查看文件属性，可用此查看压缩文件的格式

```
file 文件名
```

* 递归查找文件内的字符串

```
find ./ -name '*.html' -exec grep "breadcrumbs.inc.php" '{}' \; -print
这条命令将查找所有包含 breadcrumbs.inc.php 的 HTML 文件。
```

* 查找目录内行首带TAB的文件 

```
find /path/to/file -type f -name "*.php" | xargs grep -nr ''$'\t'
```

* 去掉不用的 /aaa/bbb 的$PATH 

```
export PATH=echo $PATH | sed -e 's/:\/aaa\/bbb//g'
```

* 统计字符串中某个字符出现的次数

```
echo "abcdabc1234abc" | awk -F'a' '{print NF-1}'
echo abcdabc1234abc | grep -o 'a' | wc -l
echo "abcdaaaaaaaaabc1234abc" | awk '{print gsub("a","a")}'
echo abcdafsdfesd|perl -ne 'print tr/a//;'
str="abcdabc1234abc" str=${str//![pic](a)} echo ${#str}
```

* history: export HISTTIMEFORMAT="'whoami:%F %T :" history | more
* 实时查看网络流量:

```
sar -n DEV 1 100
```

* 查看进程，按内存从大到小排列

```
ps -e -o " %c : %P : %z : %a" | sort -k4 -nr
ps aux |sort -rnk 4
```

* 按 CPU 利用率从大到小排列

```
ps -e -o " %C : %p : %z : %a" | sort  -nr
ps aux |sort -rnk 3
```

* 查看实时更新的文件: tail -f access.log
* io状态: iostat -x 1 10
* io进程占用情况: pidstat -d 1
* httpd日志分析

```
tail -n 10000 new.huntmine.com-log |awk  '{print$7}' |sort |uniq -c | sort -nr|more
tail -n 10000 new.huntmine.com-log |awk  '{print$7}' |grep "txt"|sort |uniq -c | sort -nr|more

tail -100000 minisite-access.log |grep addsharenum.php| awk  '{print $1}' |sort |uniq -c | sort -nr|more
tail -100000 minisite-access.log |grep addsharenum.php| awk  '{print $NF}' |sort |uniq -c | sort -nr|more
```

* httpd线程

```
ps -eLo state,cmd|grep httpd|wc -l
ps -e -o 'pid,comm,args,pcpu,rsz,vsz,stime,user,uid' |grep httpd|grep -v grep
```

* tcpdump抓取http包:

```
tcpdump -i eth0 -A -s 0 'tcp port 8080 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)'
tcpdump -i eth0 port 8080 -w /tmp/dump -c 2000
```

* ip封锁:
  
  ```
  //对同时超过50个链接的ip进行过滤
  for i in `netstat -an | grep -i ':80' |grep 'EST' | awk '{print $5}' | cut -d : -f 1 | sort | uniq -c | awk '{if($1 > 50) {print $2}}'`
  do
    echo $i
    echo $i >> /tmp/banip
    /sbin/iptables -A INPUT -p tcp -j DROP -s $i
  done
  ```

* 查看httpd进程数量: `ps -ef | grep httpd | wc -l`

* 批量kill进程: 

```
ps -efww|grep sqlr-listener|grep -v grep|cut -c 9-15|xargs kill -9
```

* 调试php:

```
pmap $(pgrep php-fpm |head -1)
strace -frp $(pgrep -n php-cgi)
strace $(pidof php-fpm |sed 's/\(![pic](0-9)*\)/\-p \1/g')
```

* 批量替换文件中的字符串:

```
sed -i "s/\"\/css\/resource_details.css/\"http:\/\/90.194.55.01:500\/css\/resource_details.css/g" *
```

* Replace all tabs with spaces in an application

```
$ grep -PL "\t" -r . | grep -v ".svn" | xargs sed -i 's/\t/ /g'
```

* 查看指定时间内修改的文件: `find /opt/projects/www/ -name *.php -mtime -10 > ij.log`

* 查找后复制: `find...|xargs cp -t DIR`

* 测试页面web访问

```
curl -s -v -o /dev/null http://www.baidu.com/
```

* 测试页面请求头

```
curl -I  -H "Origin: http://xx.oo.codevm.com" http://test.dev.codevm.com/sense/htdocs/?callback=_jsonph90ozj13am8l4n29
```

* 批量查找包含bomb文件

```
find -type f -print0 | xargs -0 grep -l `printf '^\xef\xbb\xbf'` | sed 's/^/found BOM in: /'
```

* apache日志中得到访问量最高前100个IP

```
cat logfile | awk ‘{a![pic]($1)++} END {for(b in a) print b”\t”a![pic](b)}’|sort -k2
```

* bash脚本调试

```
export PS4='+${BASH_SOURCE}:${LINENO}:${FUNCNAME![pic](0)}: '
bash/sh -x scriptname.sh
```

* csplit切分文件: csplit needDelCodisKey.log 8814410 (可以以行号为分割点,还有其它高级用法)

* 查看指定进程的标准输出
  
```sh
strace -ewrite -p $PID
strace -ewrite -p $PID 2>&1 | grep 'write(1,' #过滤标准输出的内容
```

* 查看存在文件A中但不存在B文件中的内容

```
grep -vFf 158_2_spam.txt 158_2.log
```

* curl高级用法
  
```bash
curl -o /dev/null -s -w time_namelookup:"\t"%{time_namelookup}"\n"time_connect:"\t\t"%{time_connect}"\n"time_appconnect:"\t"%{time_appconnect}"\n"time_pretransfer:"\t"%{time_pretransfer}"\n"time_starttransfer:"\t"%{time_starttransfer}"\n"time_total:"\t\t"%{time_total}"\n"time_redirect:"\t\t"%{time_redirect}"\n" http://online.rayjump.com/openapi/ads 
```

* 查看所有容器的IP地址
  
```bash
sudo docker ps -aq | xargs sudo docker inspect --format='{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'
```

* nc命令传输文件
```bash
server: nc -l 1234 > file.txt
client: nc ip地址 1234 < file.txt
```
  

## ssh隧道

1. ssh -N -f -R 2222:127.0.0.1:22  user@10.10.10.10 -p 2005  //可以将本地端口映射到10服务器的2222端口. 用于远程透过内网连接公司电脑
2. ssh -N -f -L 2121:234.234.234.234:21  user@123.123.123.123    //现在访问本地2121端口，就能连接234.234.234.234的21端口了
