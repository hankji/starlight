---
title: php安装
---

* useradd www
* yum install gcc gcc-c++ gcc-g77
* 安装libxml2-devel
* 安装yum install openssl-devel
* yum install bzip2-devel
* yum install libcurl-devel
* yum install libjpeg-devel
* yum install libpng-devel
  ```
    cd /usr/lib/
    ln -s ../lib64/libjpeg.so .
    ln -s ../lib64/libjpeg.so.62 .
    ln -s ../lib64/libjpeg.so.62.0.0 .
  ```
* 创建软链接ldap
* yum install libXpm-devel
  ```
    cd /usr/lib/
    ln -s ../lib64/libXpm.so .
    ln -s ../lib64/libXpm.so.4 .
    ln -s ../lib64/libXpm.so.4.11.0 .
  ```
* yum install freetype-devel 
* yum install openldap-devel
* 手动安装libmcrypt
  ```
    wget http://mirrors.wiztear.com/libs/libmcrypt-2.5.8.tar.gz
    tar -xzvf libmcrypt-2.5.7.tar.gz
    cd libmcrypt-2.5.7
    ./configure prefix=/usr/local/libmcrytp/
    make && make install
  ```
* 手动安装libiconv
  ```
    wget http://ftp.gnu.org/pub/gnu/libiconv/libiconv-1.13.1.tar.gz
    tar -xzvf libiconv-1.13.1.tar.gz
    cd libiconv-1.13.1
    ./configure --prefix=/usr/local
    make && make install
    ldconfig /usr/local/lib/
  ```
* 执行php安装脚本
* 安装magicwand扩展
  ```
  wget http://mirrors.wiztear.com/packages/ImageMagick-6.7.8-7.tar.gz
  tar -xzvf ImageMagick-6.7.8-7.tar.gz
  cd ImageMagick-6.7.8-7
  ./configure --with-php-config=/usr/local/php-5.3/bin/php-config
  make && make install
  ```

export PKG_CONFIG_PATH=//usr/local/lib/pkgconfig
wget http://mirrors.wiztear.com/php/exts/imagick-3.1.0RC2.tgz
tar xzvf imagick-3.1.0RC2.tgz
cd imagick-3.1.0RC2
/usr/local/php-5.3/bin/phpize
./configure  --enable-shared --enable-static --with-php-config=/usr/local/php-5.3/bin/php-config --with-imagick=/usr/local/
export PKG_CONFIG_PATH=//usr/local/lib/pkgconfig
make && make install

上传MagickWandforphp压缩包
/usr/local/php-5.3/bin/phpize
./configure  --enable-shared --enable-static --with-php-config=/usr/local/php-5.3/bin/php-config --with-imagick=/usr/local/
make
make install

```
* 增加动态库目录: 
```

[@zw_85_50 weblogs]* cat /etc/ld.so.conf.d/libiconv.conf 
/usr/local/lib/

```
=== nginx安装 ===
* yum -y install pcre-devel
* yum -y install openssl-devel
* dos2unix /opt/soft/passport_nginx/config
* 配置参数
```

[@zw_85_50 soft]* /usr/local/nginx/sbin/nginx -V
nginx version: nginx/1.3.14
built by gcc 4.4.7 20120313 (Red Hat 4.4.7-3) (GCC) 
TLS SNI support enabled
configure arguments: --user=www --group=www --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module --http-log-path=/opt/weblogs/access.log --error-log-path=/opt/weblogs/error.log --add-module=/opt/soft/passport_nginx/ --with-http_realip_module

