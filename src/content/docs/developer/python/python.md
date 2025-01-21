---
title: Tips
description: A guide in my new Starlight docs site.
---


* 网络资料
```
http://www.python.org/dev/peps/pep-0008/
http://python.net/~goodger/projects/pycon/2007/idiomatic/handout.html
http://www.python.org/dev/peps/pep-0318/
http://docs.python.org/library/re.html
http://www.python.org/dev/peps/pep-0333/
http://scotdoyle.com/python-epoll-howto.html
```

* 杂项
  * 模块管理 pip *
* [编程规范](../../../other/编程修养)
* [生成随便密码](../生成随便密码)
* easy_install lxml==2.3 (lxml win7 64位时使用)
* ./configure --prefix=/usr/local/python2.7 -with-zlib=/usr/include (自定义安装参数)

* 三元表达式
```
1  result = x if condiction *else* y
2  result = x or y (会对x 转化为Boolean 类型后判断，如果为真则 result 为x 否则为y)
3  result = (y, x)[condition]
```
