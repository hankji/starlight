---
title: screen
---

## Screen 使用指南

### 同时登录系统

1. 双方同时登陆系统
2. 演示方运行：
    ```sh
    screen -S xxxx
    ```
3. 观看方运行：
    ```sh
    screen -x xxxx
    ```
    备注：`xxxx` 设置为同一名称即可，例如：`screen -S foo` 和 `screen -x foo`

### Screen 简介

`screen` 是一个终端的多路复用器。借助 `screen`，你可以在单个终端内运行任意数量的基于终端的应用程序，如交互的命令 shell，基于 curses 的应用程序，文本编辑器等等。

`screen` 的另一个很酷的主要特性是它能使运行着的程序脱离终端模拟器。即使你不小心关闭终端模拟器，`screen` 也能让程序继续运行；甚至在你注销之后，它也能让程序在你下次登录后从上次中断处继续执行。

### 有用的配置

在 `testServer:~` 目录下创建或编辑 `.screenrc` 文件，添加以下配置：
```sh
defscrollback 10000
hardstatus on 
hardstatus alwayslastline 
hardstatus string "%{.bW}%-w%{.rY}%n %t%{-}%+w %=%{..G} %H(%l) %{..Y} %Y/%m/%d %c:%s "
```
替代软件: `tmux`

### Screen 命令参数

```sh
screen [-AmRvx -ls -wipe][-d <作业名称>][-h <行数>][-r <作业名称>][-s ][-S <作业名称>]
```

#### 参数说明

- `-A` 　将所有的视窗都调整为目前终端机的大小。
- `-d <作业名称>` 　将指定的 screen 作业离线。
- `-h <行数>` 　指定视窗的缓冲区行数。
- `-m` 　即使目前已在作业中的 screen 作业，仍强制建立新的 screen 作业。
- `-r <作业名称>` 　恢复离线的 screen 作业。
- `-R` 　先试图恢复离线的作业。若找不到离线的作业，即建立新的 screen 作业。
- `-s` 　指定建立新视窗时，所要执行的 shell。
- `-S <作业名称>` 　指定 screen 作业的名称。
- `-v` 　显示版本信息。
- `-x` 　恢复之前离线的 screen 作业。
- `-ls` 或 `--list` 　显示目前所有的 screen 作业。
- `-wipe` 　检查目前所有的 screen 作业，并删除已经无法使用的 screen 作业。

### 常用快捷键

在每个 screen session 下，所有命令都以 `ctrl+a (C-a)` 开始。

- `C-a ?` -> 显示所有键绑定信息
- `C-a c` -> 创建一个新的运行 shell 的窗口并切换到该窗口
- `C-a n` -> Next，切换到下一个 window 
- `C-a p` -> Previous，切换到前一个 window 
- `C-a 0..9` -> 切换到第 0..9 个 window
- `C-a C-a` -> 在两个最近使用的 window 间切换 
- `C-a x` -> 锁住当前的 window，需用用户密码解锁
- `C-a d` -> detach，暂时离开当前 session，将目前的 screen session (可能含有多个 windows) 丢到后台执行，并会回到还没进 screen 时的状态，此时在 screen session 里，每个 window 内运行的 process (无论是前台/后台)都在继续执行，即使 logout 也不影响。 
- `C-a z` -> 把当前 session 放到后台执行，用 shell 的 `fg` 命令则可回去。
- `C-a w` -> 显示所有窗口列表
- `C-a t` -> Time，显示当前时间，和系统的 load 
- `C-a k` -> kill window，强行关闭当前的 window
- `C-a [` -> 进入 copy mode，在 copy mode 下可以回滚、搜索、复制就像用使用 vi 一样
  - `C-b` Backward，PageUp 
  - `C-f` Forward，PageDown 
  - `H` (大写) High，将光标移至左上角 
  - `L` Low，将光标移至左下角 
  - `0` 移到行首 
  - `$` 行末 
  - `w` forward one word，以字为单位往前移 
  - `b` backward one word，以字为单位往后移 
  - `Space` 第一次按为标记区起点，第二次按为终点 
  - `Esc` 结束 copy mode 
- `C-a ]` -> Paste，把刚刚在 copy mode 选定的内容贴上
