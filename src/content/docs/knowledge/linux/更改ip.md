---
title: 更改ip
description: 如何更改IP.
---

在 Linux 系统中，修改 IP 地址可以通过以下几种方式进行：

## 1. 临时修改 IP 地址（使用 `ip` 命令）
如果你只需要临时更改 IP 地址，可以使用 `ip` 命令。

### 查看当前网络接口：
```bash
ip addr
```

### 修改 IP 地址：
假设你想将 `eth0` 的 IP 地址修改为 `192.168.1.100`，你可以运行：
```bash
sudo ip addr add 192.168.1.100/24 dev eth0
```

### 删除旧的 IP 地址：
如果你需要删除之前设置的 IP 地址：
```bash
sudo ip addr del 192.168.1.100/24 dev eth0
```

## 2. 永久修改 IP 地址（修改配置文件）

不同的 Linux 发行版可能有所不同。以下是几种常见的方式：

### 在 Ubuntu/Debian 系统上：
1. 打开网络配置文件 `/etc/netplan/*.yaml`，通常是 `00-installer-config.yaml` 或者其他类似名称的文件：
   ```bash
   sudo nano /etc/netplan/00-installer-config.yaml
   ```
2. 修改网络配置，设置新的静态 IP 地址。例如：
   ```yaml
   network:
     version: 2
     renderer: networkd
     ethernets:
       eth0:
         dhcp4: no
         addresses:
           - 192.168.1.100/24
         gateway4: 192.168.1.1
         nameservers:
           addresses:
             - 8.8.8.8
             - 8.8.4.4
   ```
3. 应用更改：
   ```bash
   sudo netplan apply
   ```

### 在 CentOS/RHEL 系统上：
1. 编辑网络配置文件 `/etc/sysconfig/network-scripts/ifcfg-eth0`（根据你的网络接口名称可能有所不同）：
   ```bash
   sudo nano /etc/sysconfig/network-scripts/ifcfg-eth0
   ```
2. 修改文件中的 IP 配置：
   ```ini
   TYPE=Ethernet
   BOOTPROTO=static
   IPADDR=192.168.1.100
   NETMASK=255.255.255.0
   GATEWAY=192.168.1.1
   DNS1=8.8.8.8
   DNS2=8.8.4.4
   ```
3. 重启网络服务以应用更改：
   ```bash
   sudo systemctl restart network
   ```

### 在 Fedora 上：
与 CentOS/RHEL 类似，编辑 `/etc/sysconfig/network-scripts/ifcfg-eth0` 配置文件，并重启网络服务。

## 3. 使用 `nmcli` 命令（适用于 NetworkManager 管理的网络接口）

如果你的系统使用了 NetworkManager（例如 Ubuntu Desktop 或其他桌面发行版），可以使用 `nmcli` 来更改 IP 配置。

### 设置静态 IP：
```bash
sudo nmcli con mod eth0 ipv4.addresses 192.168.1.100/24
sudo nmcli con mod eth0 ipv4.gateway 192.168.1.1
sudo nmcli con mod eth0 ipv4.dns "8.8.8.8 8.8.4.4"
sudo nmcli con mod eth0 ipv4.method manual
sudo nmcli con up eth0
```

### 设置 DHCP：
```bash
sudo nmcli con mod eth0 ipv4.method auto
sudo nmcli con up eth0
```

## 注意：
- 修改 IP 地址后，可能需要重启网络服务或重启机器来确保更改生效。
- 如果系统使用 `NetworkManager` 或 `systemd` 管理网络，某些命令和配置文件路径可能会有所不同。