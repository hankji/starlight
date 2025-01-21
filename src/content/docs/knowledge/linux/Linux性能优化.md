---
title: Linux性能排查
---

## stress 命令使用

`stress`是一个施加系统压力和压力测试系统的工具，我们可以使用`stress`工具压测试 CPU，以便方便我们定位和排查 CPU 问题。

```text
yum install stress // 安装stress工具
```

### **stress 命令使用**

```text
// --cpu 8：8个进程不停的执行sqrt()计算操作 
// --io 4：4个进程不同的执行sync()io操作（刷盘）
// --vm 2：2个进程不停的执行malloc()内存申请操作 
// --vm-bytes 128M：限制1个执行malloc的进程申请内存大小 
stress --cpu 8 --io 4 --vm 2 --vm-bytes 128M --timeout 10s
// stress -c 1模拟 CPU 高负载情况
// stress -i 1来模拟 IO 瓶颈问题
// stress 的下一代 stress-ng，它支持更丰富的选项，比如stress-ng -i 1 --hdd 1 --timeout 600（--hdd 表示读写临时文件）。
```

### **总结**

通过以上问题现象及解决思路可以总结出：

1. 平均负载高有可能是 CPU 密集型进程导致的
2. 平均负载高并不一定代表 CPU 使用率高，还有可能是 I/O 更繁忙了
3. 当发现负载高的时候，你可以使用 mpstat、pidstat 等工具，辅助分析负载的来源
4. 系统平均负载阈值建议0.7(单核)，多核时乘以CPU数。即"负载"/CPU数<=0.7

总结工具：`mpstat`、`pidstat`、`iostat`、`dstat`、`top`和`uptime` ( `sar`可查看历史数据/var/log/sysstat或/var/log/sa)

## **查看系统上下文切换**

**vmstat**：工具可以查看系统的内存、CPU 上下文切换以及中断次数：

```
cs：则为每秒的上下文切换次数。
in：则为每秒的中断次数。
r：就绪队列长度，正在运行或等待 CPU 的进程。
b：不可中断睡眠状态的进程数，例如正在和硬件交互。
```

**pidstat**：使用`pidstat -w`选项查看具体进程的上下文切换次数：

```
$ pidstat -w -p 3217281 1
10:19:13      UID       PID   cswch/s nvcswch/s  Command
10:19:14        0   3217281      0.00     18.00  stress
10:19:15        0   3217281      0.00     18.00  stress
10:19:16        0   3217281      0.00     28.71  stress

其中cswch/s和nvcswch/s表示自愿上下文切换和非自愿上下文切换。
自愿上下文切换：是指进程无法获取所需资源，导致的上下文切换。比如说， I/O、内存等系统资源不足时，就会发生自愿上下文切换。非自愿上下文切换：则是指进程由于时间片已到等原因，被系统强制调度，进而发生的上下文切换。比如说，大量进程都在争抢 CPU 时，就容易发生非自愿上下文切换
```

### **分析 in 中断问题**

我们可以查看系统的`watch -d cat /proc/softirqs`以及`watch -d cat /proc/interrupts`来查看系统的软中断和硬中断（内核中断）。我们这里主要观察`/proc/interrupts`即可。

```text
$ watch -d cat /proc/interrupts
RES:  900997016  912023527  904378994  902594579  899800739  897500263  895024925  895452133   Rescheduling interrupts
```

这里明显看出重调度中断（RES）增多，这个中断表示唤醒空闲状态 CPU 来调度新任务执行，

分析

```
watch -d "/bin/cat /proc/softirqs | /usr/bin/awk 'NR == 1{printf \"%-15s %-15s %-15s\n\",\" \",\$1,\$2}; NR > 1{printf \"%-15s %-15s %-15s\n\",\$1,\$2,\$3}'"
```

**总结**

1. 自愿上下文切换变多了，说明进程都在等待资源，有可能发生了 I/O 等其他问题。
2. 非自愿上下文切换变多了，说明进程都在被强制调度，也就是都在争抢 CPU，说明 CPU 的确成了瓶颈。
3. 中断次数变多了，说明 CPU 被中断处理程序占用，还需要通过查看`/proc/interrupts`文件来分析具体的中断类型。

## **CPU 使用率问题排查**

这里总结一下 CPU 使用率问题及排查思路：

1. 用户 CPU 和 Nice CPU 高，说明用户态进程占用了较多的 CPU，所以应该着重排查进程的性能问题。
2. 系统 CPU 高，说明内核态占用了较多的 CPU，所以应该着重排查内核线程或者系统调用的性能问题。
3. I/O 等待 CPU 高，说明等待 I/O 的时间比较长，所以应该着重排查系统存储是不是出现了 I/O 问题。
4. 软中断和硬中断高，说明软中断或硬中断的处理程序占用了较多的 CPU，所以应该着重排查内核中的中断服务程序。

### **CPU 问题排查方向**

- top 系统CPU => vmstat 上下文切换次数 => pidstat 非自愿上下文切换次数 => 各类[进程分析](https://www.zhihu.com/search?q=进程分析&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"article"%2C"sourceId"%3A"180402964"})工具(perf strace ps execsnoop pstack) 
- top 用户CPU => pidstat 用户CPU => 一般是CPU计算型任务 
- top 僵尸进程 =>  各类进程分析工具(perf strace ps execsnoop pstack) 
- top 平均负载 => vmstat 运行状态进程数 =>  pidstat 用户CPU => 各类进程分析工具(perf strace ps execsnoop pstack) 
- top 等待IO CPU => vmstat 不可中断状态进程数  => IO分析工具(dstat、sar -d) 
- top 硬中断 => vmstat 中断次数 => 查看具体中断类型(/proc/interrupts) 
- top 软中断 => 查看具体中断类型(/proc/softirqs) => 网络分析工具(sar -n、tcpdump) 或者 SCHED(pidstat 非自愿上下文切换)

## Perf 命令

- perf record -a -g -p xxxx -o perf.data  sleep 120
- perf report -i perf.data
- sudo perf stat -e irq_vectors:local_timer_entry -a -A sleep 1 
- sudo perf stat -C 1 -e irq_vectors:local_timer_entry sleep 1  //查看一个Cpu的事件次数

## Sar 命令

```
(1) sar -b 5 5        // IO传送速率
(2) sar -B 5 5        // 页交换速率
(3) sar -c 5 5        // 进程创建的速率
(4) sar -d 5 5        // 块设备的活跃信息
(5) sar -n DEV 5 5    // 网路设备的状态信息
(6) sar -n SOCK 5 5   // SOCK的使用情况
(7) sar -n ALL 5 5    // 所有的网络状态信息
(8) sar -P ALL 5 5    // 每颗CPU的使用状态信息和IOWAIT统计状态 
(9) sar -q 5 5        // 队列的长度（等待运行的进程数）和负载的状态
(10) sar -r 5 5       // 内存和swap空间使用情况
(11) sar -R 5 5       //     内存的统计信息（内存页的分配和释放、系统每秒作为BUFFER使用内存页、每秒被cache到的内存页）
(12) sar -u 5 5       // CPU的使用情况和IOWAIT信息（同默认监控）
(13) sar -v 5 5       // inode, file and other kernel tablesd的状态信息
(14) sar -w 5 5       // 每秒上下文交换的数目
(15) sar -W 5 5       // SWAP交换的统计信息(监控状态同iostat 的si so)
(16) sar -x 2906 5 5  // 显示指定进程(2906)的统计信息，信息包括：进程造成的错误、用户级和系统级用户CPU的占用情况、运行在哪颗CPU上
(17) sar -y 5 5       // TTY设备的活动状态
(18) 将输出到文件(-o)和读取记录信息(-f)

sar也可以监控非实时数据，通过cron周期的运行到指定目录下
例如:我们想查看本月27日,从0点到23点的内存资源.
sa27就是本月27日,指定具体的时间可以通过-s(start)和-e(end)来指定.
sar -f /var/log/sysstat/sa27 -s 00:00:00 -e 23:00:00 -r
```
