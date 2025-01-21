---
title: ssh密钥认证
---

## 密钥认证及sshd配置

### 生成公钥和密钥

```bash
$ ssh-keygen -t rsa
$ cd .ssh/
```

### 将公钥添加到服务器

```bash
$ cat id_rsa.pub >> authorized_keys
```

### sshd文件配置

```plaintext
PermitRootLogin no
PasswordAuthentication no
RSAAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
ChallengeResponseAuthentication no
```

## SSH Server整体设定

### 基本设定

```plaintext
Port 22
Protocol 2,1
ListenAddress 192.168.0.100
PidFile /var/run/sshd.pid
LoginGraceTime 600
Compression yes
```

### 主机私钥文件

```plaintext
HostKey /etc/ssh/ssh_host_key
HostKey /etc/ssh/ssh_host_rsa_key
HostKey /etc/ssh/ssh_host_dsa_key
```

### Version 1设定

```plaintext
KeyRegenerationInterval 3600
ServerKeyBits 768
```

### 登录文件与daemon名称

```plaintext
SyslogFacility AUTH
LogLevel INFO
```

### 安全设定

#### 登录设定

```plaintext
PermitRootLogin no
UserLogin no
StrictModes yes
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys
```

#### 认证部分

```plaintext
RhostsAuthentication no
IgnoreRhosts yes
RhostsRSAAuthentication no
HostbasedAuthentication no
IgnoreUserKnownHosts no
PasswordAuthentication yes
PermitEmptyPasswords no
ChallengeResponseAuthentication yes
```

#### Kerberos相关设定

```plaintext
#KerberosAuthentication no
#KerberosOrLocalPasswd yes
#KerberosTicketCleanup yes
#KerberosTgtPassing no
```

#### X-Window相关设定

```plaintext
X11Forwarding yes
#X11DisplayOffset 10
#X11UseLocalhost yes
```

#### 登录后设定

```plaintext
PrintMotd no
PrintLastLog yes
KeepAlive yes
UsePrivilegeSeparation yes
MaxStartups 10
```

#### 用户抵挡设定

```plaintext
DenyUsers test
DenyGroups test
```

### SFTP服务设定

```plaintext
Subsystem sftp /usr/lib/ssh/sftp-server
```

## linux使用密钥登录

1. 将私钥拷贝到用户.ssh目录
2. 执行`ssh-agent bash`
3. 执行`ssh-add 私钥文件`

## ssh登录太慢的解决方法

SSH 登录太慢可能是 DNS 解析的问题。可以在 sshd 的配置文件（sshd_config）里取消 sshd 的反向 DNS 解析。

```plaintext
vi /etc/ssh/sshd_config
找到UseDNS，修改为no
UseDNS no
重启SSH服务
/etc/init.d/sshd restart
```

## ssh-agent

1. `eval "$(ssh-agent -s)"` `[bash环境]`
2. `ssh-add -K ~/.ssh/id_rsa`
3. `~/.ssh/config`

```plaintext
Host 111.111.111.111
    HostName 111.111.111.111
    #Port 22
    User xxxxxx
    IdentityFile ~/.ssh/id_rsa_xxxx
    IdentitiesOnly yes
```

## sshpass命令 – 用于非交互的ssh 密码验证

sshpass命令用于非交互的 ssh 密码验证。

```bash
sshpass -p "password" ssh username@ip
sshpass -p "password" ssh -p 8443 username@ip
sshpass -f xxx.txt ssh root@192.168.11.11
sshpass -p '123456' scp root@host_ip:/home/test/t ./tmp/
```