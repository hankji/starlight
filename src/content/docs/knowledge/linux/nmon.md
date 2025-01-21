---
title: nmon
---
下载地址: [http://nmon.sourceforge.net/](http://www.ibm.com/developerworks/wikis/display/WikiPtype/nmon)

服务器版本确认: (http://www.ibm.com/developerworks/wikis/display/WikiPtype/Linux+startup)

----

## 脚本

```
plat=power * not tested
[ `expr \`uname -m\` : ".*\(86\)"` = "86" ] && plat=x86

os=`head -1 /etc/issue`
required=no_nmon_found
case $os in
   *Debian*)    required=nmon_"$plat"_debian3 ;; * not tested
   *Fedora*)    required=nmon_"$plat"_fedora3 ;; * not tested
   *Shrike*)    required=nmon_"$plat"_redhat9 ;;
   *Red\ Hat*release\ 2*)       required=nmon_"$plat"_rhel2 ;;
   *Red\ Hat*release\ 3*)       required=nmon_"$plat"_rhel3 ;;
   *Red\ Hat*release\ 4*)       required=nmon_"$plat"_rhel4 ;;
   *Red\ Hat*release\ 5*)       required=nmon_"$plat"_rhel52 ;;
   *SUSE*8\.*)  required=nmon_"$plat"_sles8 ;; * not tested
   *SUSE*9\.*)  required=nmon_"$plat"_sles9 ;;
   *SUSE*10\.*) required=nmon_"$plat"_sles9 ;;
esac
echo Linux version $os and starting up nmon $required
* Try current directory
if [ -e $required ]( -e $required .md)
then
        echo $required $*
        exec $required $*
fi
* Try current directory with ./
if [ -e ./$required ]( -e ./$required .md)
then
        echo ./$required $*
        exec ./$required $*
fi
* Try same directory as this script
if [ -e `dirname $0`/$required ]( -e `dirname $0`/$required .md)
then
        echo `dirname $0`/$required $*
        exec `dirname $0`/$required $*
fi
echo Giving up - where did you put $required ?
```
