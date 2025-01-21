---
title: selenium安装过程
---

## CentOS selenium安装过程

1. 系统需要安装图形化界面&&Firefox&&FlashPlugin
1. 安装zlib: yum -y install zlib zlib-devel openssl libjpeg-devel libpng-devel
1. 安装Python27: ./configure --prefix=/usr/local/python2.7 -with-zlib=/usr/include --with-ssl
1. make && make install
1. 安装setuptools: wget https://bootstrap.pypa.io/ez_setup.py -O - | /usr/local/python2.7/bin/python
1. 安装pip: /usr/local/python2.7/bin/easy_install pip
1. 安装selenium: /usr/local/python2.7/bin/pip install -U selenium
1. 安装PIL: /usr/local/python2.7/bin/pip install pillow (pillow is an installer for PIL)
1. yum install ImageMagick
1. 安装pyscreenshot: /usr/local/python2.7/bin/pip install pyscreenshot
1. Firefox需要安装Flash插件
1. 安装stompy : pip install stomppy

CentOS命令行下:

* yum install xorg-x11-server-Xvfb
* pip --proxy 192.168.163.1:1088 install -U  pyvirtualdisplay
  ==== 参考资料 ====
* http://docs.seleniumhq.org/docs/03_webdriver.jsp
* http://effbot.org/imagingbook/
* https://github.com/ponty/pyscreenshot
* http://pillow.readthedocs.org/en/latest/reference/ImageDraw.html
* http://seleniumhq.github.io/selenium/docs/api/py/index.html
