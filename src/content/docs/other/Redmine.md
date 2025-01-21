---
title: Redmine
---

## 安装

### 安装软件准备

所需软件：
- `redmine-0.9.6.tar.gz`
- `ruby-1.8.7-p302.tar.gz`
- `rubygems-1.3.7.zip` (ruby安装时需要`openssl-devel` rpm包)

所需其它插件等可通过`rubygems`来进行获取和配置，方便安装。
(其它所需如`mysql`数据库等部分不作介绍)

### 1. 安装ruby

```sh
tar xzvf ruby-1.8.7-p302.tar.gz
cd ruby-1.8.7-p302
./configure --prefix=/usr/local/ruby
make
make install
```

### 2. 安装rubygems

```sh
unzip rubygems-1.3.7.zip
cd rubygems-1.3.7
ruby setup.rb
```

### 3. 安装rails

```sh
gem install rails -v=2.3.5
```

### 4. 安装rack

```sh
gem install rack -v=1.0.1
```

### 5. 安装mysql

需要`mysql`和`mysql-devel`包：

```sh
gem install mysql
```

解决`No definition for next_result`等问题：

```sh
gem install ri rdoc
gem install mysql
```

### 6. 安装redmine

```sh
tar xzvf redmine-0.9.6.tar.gz
cd redmine-0.9.6
mysql
```

在mysql中执行以下命令：

```sql
create database redmine character set utf8;
create user 'redmine'@'localhost' identified by 'my_password';
grant all privileges on redmine.* to 'redmine'@'localhost';
grant all privileges on redmine.* to 'redmine'@'localhost' identified by 'my_password';
exit
```

配置`database.yml`：

```sh
cp config/database.yml.example config/database.yml
vi config/database.yml
```

在`database.yml`中添加以下内容：

```yaml
production:
    adapter: mysql
    database: redmine
    host: localhost
    username: redmine
    password: my_password
```

生成会话存储和迁移数据库：

```sh
rake generate_session_store
RAILS_ENV=production rake db:migrate
RAILS_ENV=production rake redmine:load_default_data
```

如果非root用户，执行以下命令：

```sh
mkdir tmp public/plugin_assets
sudo chown -R redmine:redmine files log tmp public/plugin_assets
sudo chmod -R 755 files log tmp public/plugin_assets
```

启动服务器：

```sh
ruby script/server -e production
```

访问本地3000端口，默认管理员：`admin/admin`

## Apache集成

Redmine与Apache集成时，`mod_cgi`模式报错，需要使用`mod_passenger`模式。

### 安装Passenger

```sh
gem install passenger
yum install httpd-devel
yum install apr-devel
passenger-install-apache2-module
```

### 配置httpd.conf

在`httpd.conf`中添加Passenger的配置：

```apache
LoadModule passenger_module modules/mod_passenger.so
PassengerRoot /usr/local/lib/ruby/gems/1.8/gems/passenger-2.2.15
PassengerRuby /usr/local/bin/ruby
```

### 添加虚拟主机

在`httpd.conf`中添加虚拟主机：

```apache
<VirtualHost *:80>
    ServerName 192.168.137.1
    ServerAdmin webmaster@xxxxxx.com
    DocumentRoot /usr/local/redmine/redmine-0.9.6/public
    ErrorLog logs/redmine_error_log 

    <Directory "/usr/local/redmine/redmine-0.9.6/public">
        Options Indexes ExecCGI FollowSymLinks
        Order allow,deny
        Allow from all
        AllowOverride all
    </Directory>
</VirtualHost>
```

### 重启Apache

```sh
/etc/init.d/httpd restart
```

## 插件安装

插件安装一般过程：

```sh
将插件拷贝到vendor/plugins目录下
rake db:migrate_plugins RAILS_ENV=production
```
