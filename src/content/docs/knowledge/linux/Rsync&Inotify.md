---
title: rsync & inotify
---
## rsync 监控脚本:

```bash
#!/bin/bash
#
echo 30000000 > /proc/sys/fs/inotify/max_user_watches
echo 327679 > /proc/sys/fs/inotify/max_queued_events
/path/to/inotify-rsync.sh > /path/to/log/inotify.log 2>&1

base_dir=/opt/projects/release
passwd_file=/path/to/rsync.secrets
passwd_cmd=
if [ -f ${passwd_file} ]; then
    passwd_cmd="--password-file=${passwd_file}"
fi

###########################
dir,name
dirs[0]='/opt/projects/release/task/,sync_task'
dirs[1]='/opt/projects/release/msite/,sync_msite'
dirs[2]='/opt/projects/release/tomato/,sync_tomato'
dirs[3]='/opt/projects/release/pmis/sandbox/,sync_sandbox'
#dirs[4]='/opt/projects/release/test/,sync_test'

task
sync_task[0]='/opt/projects/release/task/,host1,task'
sync_task[1]='/opt/projects/release/task/,host2,task'
sync_task[2]='/opt/projects/release/task/,host3,task'
sync_task[3]='/opt/projects/release/task/,host4,task'
sync_task[4]='/opt/projects/release/task/,host5,task'
sync_task[5]='/opt/projects/release/task/,host6,task'
sync_task[6]='/opt/projects/release/task/,host7,task'
sync_task[7]='/opt/projects/release/task/,host8,task'
sync_task[8]='/opt/projects/release/task/,host9,task'
sync_task[9]='/opt/projects/release/task/,host10,task'

msite
sync_msite[0]='/opt/projects/release/msite/,host1,msite'
sync_msite[1]='/opt/projects/release/msite/,host2,msite'
sync_msite[2]='/opt/projects/release/msite/,host3,msite'
sync_msite[3]='/opt/projects/release/msite/,host4,msite'
sync_msite[4]='/opt/projects/release/msite/,host5,msite'
sync_msite[5]='/opt/projects/release/msite/,host6,msite'
sync_msite[6]='/opt/projects/release/msite/,host7,msite'
sync_msite[7]='/opt/projects/release/msite/,host8,msite'
sync_msite[8]='/opt/projects/release/msite/,host9,msite'
sync_msite[9]='/opt/projects/release/msite/,host10,msite'

tomato
sync_tomato[0]='/opt/projects/release/framework/tomato/,host1,tomato'
sync_tomato[1]='/opt/projects/release/framework/tomato/,host2,tomato'
sync_tomato[2]='/opt/projects/release/framework/tomato/,host3,tomato'
sync_tomato[3]='/opt/projects/release/framework/tomato/,host4,tomato'
sync_tomato[4]='/opt/projects/release/framework/tomato/,host5,tomato'
sync_tomato[5]='/opt/projects/release/framework/tomato/,host6,tomato'
sync_tomato[6]='/opt/projects/release/framework/tomato/,host7,tomato'
sync_tomato[7]='/opt/projects/release/framework/tomato/,host8,tomato'
sync_tomato[8]='/opt/projects/release/framework/tomato/,host9,tomato'
sync_tomato[9]='/opt/projects/release/framework/tomato/,host10,tomato'
sync_tomato[10]='/opt/projects/release/framework/tomato/,host11,tomato'
sync_tomato[11]='/opt/projects/release/framework/tomato/,host12,tomato'
sync_tomato[12]='/opt/projects/release/framework/tomato/,host13,tomato'

pmissandbox
sync_sandbox[0]='/opt/projects/release/pmis/sandbox/,host1,pmissandbox'

test
sync_test[0]='/opt/projects/release/test/,host1,test'
sync_test[1]='/opt/projects/release/test/,host2,test'
sync_test[2]='/opt/projects/release/test/,host3,test'
sync_name[0]='/path/to/local/dir,host,rsync_module'
###########################

for dirval in ${dirs[@]}; do {

dir=`echo ${dirval} | awk -F"," '{print $1}'`
name=`echo ${dirval} | awk -F"," '{print $2}'`
length=`echo ${dirval} | awk -F"," '{print $3}'`

declare -a 'sync=("${'"$name"'[@]}")'

inotifywait --exclude '(.*/*\.log|.*/*\.swp|.*/*\.swx|.*/*~$|.*data/.*cache/.*|.*data/sessions/.*)' \
 -mrq --timefmt '%d/%m/%y %H:%M' --format  '%T %w%f %e' \
 --event CLOSE_WRITE,create,move,delete $dir | while read date time file event
    do {
        d1=`date '+%Y%m'`
        d2=`date '+%Y%m%d'`
        d3=`date '+%Y-%m-%d:%H:%M:%S'`

        logdir=${base_dir}/log/${d1}
        mkdir -p ${logdir}
        #echo "[$d3] [$event] $file" >> ${logdir}/tasksh-${d2}.log
        case $event in
            CLOSE_WRITE,CLOSE|MODIFY|CREATE|MOVE|MOVED_TO|MOVED_TO,ISDIR|MOVE,ISDIR|CREATE,ISDIR|MODIFY,ISDIR)
                if [ "${file: -4}" != '4913' ]  && [ "${file: -1}" != '~' ]; then
                    echo "[$d3] [$event] $file" >> ${logdir}/tasksh-${d2}.log
                    for item in ${sync[@]}; do {
                        src=`echo $item | awk -F"," '{print $1}'`
                        dest=`echo $item | awk -F"," '{print $2}'`
                        module=`echo $item | awk -F"," '{print $3}'`

                        replace="${src//\//\\/}"
                        relfile=`echo ${file} | sed -e "s/${replace}//"`
                        if [ -d ${file} ]; then
                            params=az
                            relfile=${relfile}/
                            file=${file}/
                        else
                            params=lptgoDz
                        fi

                        exfile=${base_dir}/task/exfile-${module}
                        exfile_cmd=
                        if [ -f ${exfile} ]; then
                            exfile_cmd="--exclude-from=${exfile}"
                        fi
                        #cmd="rsync -az ${exfile_cmd} --exclude=* --include='$file' ${passwd_cmd} $src $dest::$module"
                        cmd="rsync -${params} ${exfile_cmd} --include='$file' ${passwd_cmd} $file $dest::$module/${relfile}"
                        echo "[$d3] [$event] sync to $dest::$module" >> ${logdir}/tasksh-${d2}.log
                        #echo "[$d3] [$event] $cmd" >> ${logdir}/tasksh-${d2}.log
                        $cmd
                    } & done
                fi
                ;;

            MOVED_FROM|MOVED_FROM,ISDIR|DELETE|DELETE,ISDIR)
                if [ "${file: -4}" != '4913' ]  && [ "${file: -1}" != '~' ]; then
                    echo "[$d3] [$event] $file" >> ${logdir}/tasksh-${d2}.log
                    for item in ${sync[@]}; do {
                        src=`echo $item | awk -F"," '{print $1}'`
                        dest=`echo $item | awk -F"," '{print $2}'`
                        module=`echo $item | awk -F"," '{print $3}'`

                        replace="${src//\//\\/}"
                        pdir=`dirname ${file}`
                        pdir=${pdir}/
                        reldir=`echo ${pdir} | sed -e "s/${replace}//"`
                        params=az


                        exfile=${base_dir}/task/exfile-${module}
                        exfile_cmd=
                        if [ -f ${exfile} ]; then
                            exfile_cmd="--exclude-from=${exfile}"
                        fi
                        #cmd="rsync -az --delete-delay ${exfile_cmd} ${passwd_cmd} $src $dest::$module"
                        cmd="rsync -${params} --del ${exfile_cmd} --exclude='$file' ${passwd_cmd} $pdir $dest::$module/${reldir}"
                        echo "[$d3] [$event] sync to $dest::$module" >> ${logdir}/tasksh-${d2}.log
                        #echo "[$d3] [$event] $cmd" >> ${logdir}/tasksh-${d2}.log
                        $cmd
                    } & done
                fi
                ;;
        esac } &
    done } &
done

WAITPIDS="$WAITPIDS "$!;
wait $WAITPIDS
```

同步端配置:

```
[@xx_83_98 ~]$ cat /etc/rsyncd.conf 
rsyncd
uid=root
gid=root
read only=no
log file=/var/log/rsyncd.log
# 这个test就是上面脚本中用到的rsync_module名
# path指定同步过来的文件存放的路径
# 如果只允许部分ip的机器进行同步的话，设置allow为 192.168.1.1/100 类似的格式
task
path=/opt/projects/task
hosts allow=host

msite
path=/opt/projects/msite
hosts allow=host

tomato
path=/opt/projects/framework/tomato
hosts allow=host
```
