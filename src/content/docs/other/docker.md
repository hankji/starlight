---
title: Docker
---

Install
-------

### Add the EPEL Repository

    rpm -iUvh http://dl.fedoraproject.org/pub/epel/6/x86_64/epel-release-6-8.noarch.rpm
    yum update -y

### Installation

    yum -y install docker-io
    chkconfig docker on

#### update

    yum --enablerepo=epel-testing update docker-io

### move images path

    mkdir -p /opt/docker/docker
    mkdir -p /var/lib/docker
    #mount -o bind /var/lib/docker /opt/docker/docker
    
    vim /etc/fstab
    /opt/docker/docker /var/lib/docker none bind 0 0
    # mount all stuff from /etc/fstab
    mount -a

### limits

vim /etc/sysctl.conf

     fs.file-max = 65536

vim /etc/security/limits.conf

```
* soft nproc 65535
* hard nproc 65535
* soft nofile 65535
* hard nofile 65535
```

vim /etc/security/limits.d/90-nproc.conf

    * soft nproc 65535

#### dynamic change limits

echo -n 'Max processes=SOFT_LIMITS:HARD_LIMITS' > /proc/<pid>/limits

### proxy

> https://github.com/dockboard/docker-proxy

export http_proxy=http://106.186.20.252:8384

**run brfore daemon**

### run

`vim /etc/sysconfig/docker`

    # /etc/sysconfig/docker
    #
    # Other arguments to pass to the docker daemon process
    # These will be parsed by the sysv initscript and appended
    # to the arguments list passed to docker -d
    
    other_args="-H tcp://10.11.1.171:4243 -H unix:///var/run/docker.sock --iptables=false"
    
    service docker start

### interface

`vim /etc/sysconfig/network-scripts/ifcfg-docker0`

    DEVICE=docker0
    TYPE=Bridge
    ONBOOT=yes
    NM_CONTROLLED=yes
    BOOTPROTO=none
    IPADDR=10.9.2.1
    NETMASK=255.255.255.0
    IPV6INIT=no
    USERCTL=no

## registry

### download

    git clone https://github.com/dotcloud/docker-registry
    git checkout -b 0.8.0
    cd docker-registry
    cp config/config_sample.yml config/config.yml

### config

`vim config/config.yml`

    local: &local
        <<: *common
        storage: local
        storage_path: /opt/docker/registry

### install deps

`pip install -r requirements.txt`

### run registry

`docker run --name registry -p 10.11.1.171:5000:5000 -d registry`

    docker run --name registry \
        -p 10.11.1.171:5000:5000 \
        -e SETTINGS_FLAVOR=dev \
        -e STORAGE_PATH=/opt/docker/registry \
        -e CORS_ORIGINS=[\'*\'] \
        -v /opt/docker/registry:/opt/docker/registry \
        --restart always \
        -d registry

#### ui

    docker run -p 10.11.1.171:8080:8080 \
        -e REG1=http://dk.wizinnov.com/v1/ \
        atcol/docker-registry-ui

shipyard
--------

    mkdir -p /opt/docker/shipyard-data
    docker run -it -d --name shipyard-rethinkdb-data \
        -v /opt/docker/shipyard-data:/data \
        --restart always \
        --entrypoint /bin/bash shipyard/rethinkdb -l
    
    docker run -it -d --name shipyard-rethinkdb \
        -p 10.11.1.171:49153:28015 \
        -p 10.11.1.171:49154:29015 \
        -p 10.11.1.171:49155:8080 \
        --restart always \
        --volumes-from shipyard-rethinkdb-data shipyard/rethinkdb
    
    docker run -it -p 10.11.1.171:8080:8080 -d --name shipyard \
        --restart always \
        --link shipyard-rethinkdb:rethinkdb shipyard/shipyard
    
    docker run -it -d --name shipyard-cli \
        --restart always \
        shipyard/shipyard-cli

cadvisor
--------

    docker run -it -d \
        --volume /:/rootfs:ro \
        --volume /var/run:/var/run:rw \
        --volume /sys:/sys:ro \
        --volume /cgroup:/cgroup \
        --volume /var/lib/docker/:/var/lib/docker:ro \
        --publish 10.11.1.171:8088:8080 \
        --name cadvisor \
        --restart always \
        google/cadvisor:latest
    
    docker run -it -d \
        --volume /:/rootfs:ro \
        --volume /var/run:/var/run:rw \
        --volume /sys:/sys:ro \
        --volume /cgroup:/cgroup \
        --volume /var/lib/docker/:/var/lib/docker:ro \
        --publish 10.11.1.173:8088:8080 \
        --name cadvisor \
        --restart always \
        google/cadvisor:latest
    
    docker run -it -d \
        --volume /:/rootfs:ro \
        --volume /var/run:/var/run:rw \
        --volume /sys:/sys:ro \
        --volume /cgroup:/cgroup \
        --volume /var/lib/docker/:/var/lib/docker:ro \
        --publish 10.10.1.159:8088:8080 \
        --name cadvisor \
        --restart always \
        google/cadvisor:latest

Sevice Discovery
----------------

    # etcd
    docker run -it -d \
        --name etcd \
        -p 10.11.1.171:4001:4001 \
        -p 10.11.1.171:7001:7001 \
        --restart always \
        coreos/etcd
    
    docker run -it -d \
        -e HOST_IP=10.11.1.171 \
        -e ETCD_HOST=10.11.1.171:4001 \
        -v /var/run/docker.sock:/var/run/docker.sock \
        --name docker-register \
        jwilder/docker-register

Images
------

### build image

    febootstrap -i bash -i wget -i passwd -i telnet -i yum -i iputils -i iproute -i tar \
        -i vim-minimal -i openssh-server -i openssh-clients -i lsof -i patch -i diffutils \
        centos6-base-min centos6-base-min http://mirrors.sohu.com/centos/6/os/x86_64/ \
        -u http://mirrors.sohu.com/centos/6/updates/x86_64/

or:

    wget -c http://mirrors.microsocl.com/docker/file/build-centos.sh
    chmod +x build-centos.sh
    ./build-centos.sh
    cat centos6-min.tar.xz | docker import - dk.wizinnov.com/sunkun/centos6-base-min

### import to docker

    cd centos6-base-min && tar -c .|docker import - centos6-base-min

### tag & push to registry

    docker tag <image> dk.wizinnov.com/sunkun/centos6-base-min
    docker push dk.wizinnov.com/sunkun/centos6-base-min

### build with Dockerfile

    docker build -t dk.wizinnov.com/sunkun/centos6-min-ssh http://mirrors.microsocl.com/docker/file/centos6-min-ssh

### run

    docker run -d --name test1 -v /opt/datum:/opt/datum ac <image>

#### docker run pararmeters

* -d: Detached mode: Run container in the background, print new container id
* -e: Set environment variables
* -h: Container host name
* -m: Memory limit (format: <number><optional unit>, where unit = b, k, m or g)
* --name: Assign a name to the container
* -p: Publish a container's port to the host
    format: ip:hostPort:containerPort | ip::containerPort | hostPort:containerPort
    (use 'docker port' to see the actual mapping)
* --privileged: Give extended privileges to this container
* -v: Bind mount a volume (e.g. from the host: -v /host:/container, from docker: -v /container)
* --volumes-from: Mount volumes from the specified container(s)

Deploy
------

### data volume images

#### build

    docker build -t dk.wizinnov.com/sunkun/data-datum http://mirrors.microsocl.com/docker/file/data-datum
    docker build -t dk.wizinnov.com/sunkun/data-conf-nginx http://mirrors.microsocl.com/docker/file/data-conf-nginx
    docker build -t dk.wizinnov.com/sunkun/data-weblogs http://mirrors.microsocl.com/docker/file/data-weblogs
    docker build -t dk.wizinnov.com/sunkun/data-projects http://mirrors.microsocl.com/docker/file/data-projects
    docker build -t dk.wizinnov.com/sunkun/data-conf-php http://mirrors.microsocl.com/docker/file/data-conf-php

#### run

    docker run --name data-datum dk.wizinnov.com/sunkun/data-datum
    docker run --name data-conf-nginx dk.wizinnov.com/sunkun/data-conf-nginx
    docker run --name data-weblogs dk.wizinnov.com/sunkun/data-weblogs
    docker run --name data-projects dk.wizinnov.com/sunkun/data-projects
    docker run --name data-conf-php dk.wizinnov.com/sunkun/data-conf-php

### build nginx image

    docker build -t dk.wizinnov.com/sunkun/centos6-nginx http://mirrors.microsocl.com/docker/file/centos6-nginx

### data volume init

    docker run -d --name ssh-data --volumes-from data-datum --volumes-from data-conf-nginx --volumes-from data-weblogs --volumes-from data-projects dk.wizinnov.com/sunkun/centos6-min-ssh
    
    ssh 10.9.1.x
    // add nginx conf file to /opt/etc/nginx
    // add ip.conf to /opt/projects/www/ipsource/ip.conf

### run nginx image

    docker run -d --name centos6-nginx --volumes-from data-datum --volumes-from data-conf-nginx --volumes-from data-weblogs --volumes-from data-projects dk.wizinnov.com/sunkun/centos6-nginx

### another way

    # data volume
    docker run -d \
        --name dev-ngx-conf \
        -v /opt/docker/container/dev/ngx-conf:/opt/etc/nginx \
        dk.wizinnov.com/sunkun/data-conf-nginx
    docker run -d \
        --name dev-projects \
        -v /opt/docker/container/dev/projects:/opt/projects \
        dk.wizinnov.com/sunkun/data-projects
    docker run -d \
        --name dev-weblogs \
        -v /opt/docker/container/dev/weblogs:/opt/weblogs \
        dk.wizinnov.com/sunkun/data-weblogs
    docker run -d \
        --name dev-datum \
        -v /opt/docker/container/dev/datum:/opt/datum \
        dk.wizinnov.com/sunkun/data-datum
    
    mkdir -p /opt/docker/container/dev/mysql-conf
    docker run -d \
        --name dev-mysql-conf \
        -v /opt/docker/container/dev/mysql-conf:/opt/etc/mysql \
        dk.wizinnov.com/sunkun/data-conf-mysql
    
    mkdir -p /opt/docker/container/dev/mysqldata
    docker run -d \
        --name dev-mysql-data \
        -v /opt/docker/container/dev/mysqldata:/opt/mysqldata \
        dk.wizinnov.com/sunkun/data-mysql
    
    mkdir -p /opt/docker/container/dev/php55-conf
    docker run -d \
        --name dev-php55-conf \
        -v /opt/docker/container/dev/php55-conf:/opt/etc/php \
        dk.wizinnov.com/sunkun/data-conf-php
    
    # service
    # ngx
    docker run -dti \
        --name dev-ngx-ssh \
        --volumes-from dev-ngx-conf \
        --volumes-from dev-projects \
        --volumes-from dev-weblogs \
        --volumes-from dev-datum \
        -m 1g \
        dk.wizinnov.com/sunkun/centos6-nginx-ssh
    
    # mysql
    docker run -dti \
        --name dev-mysql \
        --volumes-from dev-mysql-conf \
        --volumes-from dev-mysql-data \
        -m 1g \
        dk.wizinnov.com/sunkun/centos6-mysql
    
    # ngx php55
    docker run -dti \
        --name dev-www \
        --volumes-from dev-ngx-conf \
        --volumes-from dev-php55-conf \
        --volumes-from dev-projects \
        --volumes-from dev-weblogs \
        --volumes-from dev-datum \
        -m 1g \
        dk.wizinnov.com/sunkun/centos6-nginx-php55-ssh
    
    docker run -dti \
        --name dev-mysql2 \
        --volumes-from dev-mysql-conf \
        --volumes-from dev-mysql-data \
        -m 1g \
        dk.wizinnov.com/sunkun/centos6-mysql
    
    docker run --rm \
        --name dev-www2 \
        --volumes-from dev-ngx-conf \
        --volumes-from dev-php55-conf \
        --volumes-from dev-projects \
        --volumes-from dev-weblogs \
        --volumes-from dev-datum \
        --link dev-mysql2:db \
        -m 1g \
        dk.wizinnov.com/sunkun/centos6-nginx-php55-ssh env
    
    
    HOSTNAME=670dbea2e59d
    DB_PORT=tcp://10.9.1.58:3306
    DB_PORT_3306_TCP=tcp://10.9.1.58:3306
    DB_PORT_3306_TCP_ADDR=10.9.1.58
    DB_PORT_3306_TCP_PORT=3306
    DB_PORT_3306_TCP_PROTO=tcp
    DB_NAME=/dev-www2/db

networking
----------

### create bridge

`vim /etc/sysconfig/network-scripts/ifcfg-br1`

    DEVICE=br1
    TYPE=Bridge
    ONBOOT=yes
    NM_CONTROLLED=yes
    BOOTPROTO=none
    IPADDR=10.8.1.1
    NETMASK=255.255.255.0
    IPV6INIT=no
    USERCTL=no

`ifup br1`

### iptable forward

#### 10.11.1.0/24 (for container)

```
#iptables -t nat -A POSTROUTING -s 10.8.0.0/16 -o eth1 -j MASQUERADE
#iptables -t nat -A POSTROUTING -s 10.9.0.0/16 -o eth1 -j MASQUERADE
iptables -t nat -A POSTROUTING ! -d 10.0.0.0/8 -o eth0 -j MASQUERADE
```

#### 171 (10.11 gateway)

##### -> net10 (for container)

```
iptables -t nat -A POSTROUTING -d 10.10.0.0/16 -o tun0 -j MASQUERADE
```

#### 159 (10.10 gateway)

##### -> net11 (for container)

```
iptables -t nat -A POSTROUTING -d 10.11.0.0/16 -o tun0 -j MASQUERADE
```

##### net8 -> net10

```
iptables -t nat -A POSTROUTING -s 10.7.0.0/16 -o eth1 -j MASQUERADE
```aaa

#### backup

iptables-save > /etc/sysconfig/iptables
iptables-restore < /etc/sysconfig/iptables

### pipework

#yum install -y http://rdo.fedorapeople.org/rdo-release.rpm
yum install -y https://repos.fedorapeople.org/repos/openstack/openstack-icehouse/rdo-release-icehouse-4.noarch.rpm
yum install -y iproute

<https://github.com/jpetazzo/pipework>

    ./pipework br1 ssh-data 10.8.1.12/24@10.8.1.1


send mail
---------

### on host:

strat sendmail daemon

`vim /etc/mail/access`, add
```

Connect:10.9                    RELAY

```
### on container

use -S smtp=xxx
```

mail -v -S smtp=smtp://10.11.1.171 -s 'tx44444444' -r 'lostsnow@gmail.com' lostsnow@gmail.com

```
API & commands
--------------

### API

    curl http://dk.wizinnov.com/v1/search
    curl http://dk.wizinnov.com/v1/repositories/wizinnov/centos6-ssh/tags
    curl -XDELETE http://dk.wizinnov.com/v1/repositories/sunkun/centos6-base-min/
    curl http://dk.wizinnov.com/v1/images/<image-id>/json

### commands

* docker inspect <container>    # show container information
* docker images --no-trunc      # show full image id
* docker ps --no-trunc          # show full container id
* docker port CONTAINER PORT
* docker run -i -t CONTAINER_ID /bin/bash
* docker top CONTAINER_ID       # show running process
* cat /cgroup/memory/docker/<container>/memory.stat
* docker ps -a | awk '{print $1, $2, $NF}' | column -t
* docker ps -a | grep Exited | grep -v sunkun/data


cat /proc/mounts | grep "mapper/docker" | awk '{print $2}' | xargs -r umount


### remove all containers

    docker stop $(docker ps -a -q)
    docker rm $(docker ps -a -q)

### supervisord


* supervisord: 初始启动Supervisord, 启动、管理配置中设置的进程
* supervisorctl stop programxxx: 停止某一个进程(programxxx), programxxx为[program:chatdemon]里配置的值, 这个示例就是chatdemon
* supervisorctl start programxxx: 启动某个进程
* supervisorctl restart programxxx: 重启某个进程
* supervisorctl stop groupworker: 重启所有属于名为groupworker这个分组的进程(start,restart同理)
* supervisorctl stop all: 停止全部进程, 注：start、restart、stop都不会载入最新的配置文件
* supervisorctl reload: 载入最新的配置文件, 停止原有进程并按新的配置启动、管理所有进程
* supervisorctl update: 根据最新的配置文件, 启动新配置或有改动的进程, 配置没有改动的进程不会受影响而重启

> 注意: 用stop停止掉的进程, 用reload或者update都不会自动重启

### reload supervisord

* in container: kill -HUP <pid>
* out container: docker kill -s HUP CONTAINER_ID

### clean

#  locales
rm -rf /usr/{{lib,share}/locale,{lib,lib64}/gconv,bin/localedef,sbin/build-locale-archive}
#  docs
rm -rf /usr/share/{man,doc,info,gnome/help}
#  cracklib
rm -rf /usr/share/cracklib
#  i18n
rm -rf /usr/share/i18n
#  sln
rm -rf /sbin/sln
#  ldconfig
rm -rf /etc/ld.so.cache
rm -rf /var/cache/ldconfig/*

### kexec
```

# update kernel

yum install kexec-tools
latestkernel=`ls -t /boot/vmlinuz-* | sed "s/\/boot\/vmlinuz-//g" | head -n1`
echo $latestkernel
kexec -l /boot/vmlinuz-${latestkernel} --initrd=/boot/initramfs-${latestkernel}.img --append="`cat /proc/cmdline`"
kexec -e

```

QA
----

### sshd

1. disable PAM
2. disable GSSAPIAuthentication

### timezone

    docker run -v /etc/localtime:/etc/localtime:ro ...

or set in Dockerfile

    RUN cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

reference
---------

* https://docs.docker.com/reference/api/registry_api/
* http://www.4linuxfun.com/centos-with-docker/
* http://jpetazzo.github.io/2014/01/29/docker-device-mapper-resize/
* http://feilong.me/2011/03/monitor-processes-with-supervisord
* http://knktc.com/2014/08/09/docker-cheat-sheet/
* https://github.com/jdeathe/centos-ssh
* https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Resource_Management_Guide/sec-memory.html
* http://unix.stackexchange.com/questions/79924/determine-if-reboot-is-required-to-update-kernel