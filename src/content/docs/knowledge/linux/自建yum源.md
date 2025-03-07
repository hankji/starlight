---
title: yum自建源
description: yum自建源.
---

* 安装工具: yum -y install createrepo
* 创建目录: mkdir redhat/6/x86_64 -p
* 创建库: createrepo -p -d -o redhat/6/x86_64  redhat/6/x86_64 (添加新包后使用createrepo --update命令进行刷新列表)
* 更新库列表: yum clean all
* 常用命令:
  
  ```bash
  yum check-update  检查可更新的所有软件包
  yum update  下载更新系统已安装的所有软件包
  yum upgrade  大规模的版本升级,与yum update不同的是,连旧的淘汰的包也升级
  yum install <packages>  安装新软件包
  yum update <packages>  更新指定的软件包
  yum remove <packages>  卸载指定的软件包
  yum groupinstall <groupnames>  安装指定软件组中的软件包
  yum groupupdate <groupnames>  更新指定软件组中的软件包
  yum groupremove <groupnames>  卸载指定软件组中的软件包
  yum grouplist  查看系统中已经安装的和可用的软件组
  yum list  列出资源库中所有可以安装或更新以及已经安装的rpm包
  yum list <regex>  列出资源库中与正则表达式匹配的可以安装或更新以及已经安装的rpm包
  yum list available  列出资源库中所有可以安装的rpm包
  yum list available <regex>  列出资源库中与正则表达式匹配的所有可以安装的rpm包
  yum list updates  列出资源库中所有可以更新的rpm包
  yum list updates <regex>  列出资源库中与正则表达式匹配的所有可以更新的rpm包
  yum list installed  列出资源库中所有已经安装的rpm包
  yum list installed <regex>  列出资源库中与正则表达式匹配的所有已经安装的rpm包
  yum list extras  列出已经安装的但是不包含在资源库中的rpm包
  yum list extras <regex>  列出与正则表达式匹配的已经安装的但是不包含在资源库中的rpm包
  yum list recent  列出最近被添加到资源库中的软件包
  yum search <regex>  检测所有可用的软件的名称、描述、概述和已列出的维护者，查找与正则表达式匹配的值
  yum provides <regex>  检测软件包中包含的文件以及软件提供的功能，查找与正则表达式匹配的值
  yum clean headers  清除缓存中的rpm头文件
  yum clean packages  清除缓存中rpm包文件
  yum clean all  清除缓存中的rpm头文件和包文件
  yum deplist <packages>  显示软件包的依赖信息
  ```
