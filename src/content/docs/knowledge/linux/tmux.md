---
title: tmux
---

## 常用指令

1. `tmux -h` 获取帮助信息
2. `tmux new -s foo` - 新建名称为 foo 的会话
3. `tmux [new -s 会话名 -n 窗口名]`
4. `tmux ls` - 列出所有 tmux 会话
5. `tmux a` - 恢复至上一次的会话
6. `tmux a -t foo` - 恢复名称为 foo 的会话，会话默认名称为数字
7. `tmux kill-session -t foo` - 删除名称为 foo 的会话
8. `tmux kill-server` - 删除所有的会话

## 会话（Session）管理

| 前缀     | 指令      | 描述                   |
| ------ | ------- | -------------------- |
| Ctrl+b | ?       | 显示快捷键帮助文档            |
| Ctrl+b | d       | 断开当前会话               |
| Ctrl+b | D       | 选择要断开的会话             |
| Ctrl+b | Ctrl+z  | 挂起当前会话               |
| Ctrl+b | r       | 强制重载当前会话             |
| Ctrl+b | s       | 显示会话列表用于选择并切换        |
| Ctrl+b | :       | 进入命令行模式，此时可直接输入ls等命令 |
| Ctrl+b | [       | 进入复制模式，按q退出          |
| Ctrl+b | ]       | 粘贴复制模式中复制的文本         |
| Ctrl+b | ~       | 列出提示信息缓存             |
| Ctrl+b | new<回车> | 启动新会话                |
| Ctrl+b | $       | 重命名当前会话              |

## 窗口（Window）管理

| 前缀     | 指令                    | 描述                     |
| ------ | --------------------- | ---------------------- |
| Ctrl+b | c                     | 新建窗口                   |
| Ctrl+b | &                     | 关闭当前窗口（关闭前需输入y or n确认） |
| Ctrl+b | 0~9                   | 切换到指定窗口                |
| Ctrl+b | p                     | 切换到上一窗口                |
| Ctrl+b | n                     | 切换到下一窗口                |
| Ctrl+b | w                     | 打开窗口列表，用于且切换窗口         |
| Ctrl+b | ,                     | 重命名当前窗口                |
| Ctrl+b | .                     | 修改当前窗口编号（适用于窗口重新排序）    |
| Ctrl+b | f                     | 快速定位到窗口（输入关键字匹配窗口名称）   |
| Ctrl+b | swap-window -s 3 -t 1 | 交换 3 号和 1 号窗口          |
| Ctrl+b | swap-window -t 1      | 交换当前和 1 号窗口            |
| Ctrl+b | move-window -t 1      | 移动当前窗口到 1 号            |

## 窗格（Pane）管理

| 前缀                  | 指令       | 描述                              |
| ------------------- | -------- | ------------------------------- |
| Ctrl+b              | "        | 当前面板上下一分为二，下侧新建面板               |
| Ctrl+b              | %        | 当前面板左右一分为二，右侧新建面板               |
| Ctrl+b              | x        | 关闭当前面板（关闭前需输入y or n确认）          |
| Ctrl+b              | z        | 最大化当前面板，再重复一次按键后恢复正常（v1.8版本新增）  |
| Ctrl+b              | !        | 将当前面板移动到新的窗口打开（原窗口中存在两个及以上面板有效） |
| Ctrl+b              | ;        | 切换到最后一次使用的面板                    |
| Ctrl+b              | q        | 显示面板编号，在编号消失前输入对应的数字可切换到相应的面板   |
| Ctrl+b              | {        | 向前置换当前面板                        |
| Ctrl+b              | }        | 向后置换当前面板                        |
| Ctrl+b              | Ctrl+o   | 顺时针旋转当前窗口中的所有面板                 |
| Ctrl+b              | 方向键      | 移动光标切换面板                        |
| Ctrl+b              | o        | 选择下一面板                          |
| Ctrl+b              | 空格键      | 在自带的面板布局中循环切换                   |
| Ctrl+b              | Alt+方向键  | 以5个单元格为单位调整当前面板边缘               |
| Ctrl+b              | Ctrl+方向键 | 以1个单元格为单位调整当前面板边缘（Mac下被系统快捷键覆盖） |

## 其他

1. `tmux show -wg mode-keys`
2. `tmux show -g status-keys`
3. `#set -g status-keys vi`
4. `#set -g mode-keys vi`
5. 当tmux创建的socket通信文件被误删除时，可以使用`sudo kill -SIGUSR1 5612`进行重建通信文件

## Linux/mac链接重用

如果你用mac本的话，很不方便的是没有clone功能，新窗口时需要重新输入繁琐的用户名和密码，对于经常排查线上问题的程序猿来说是一件很悲催的事情，同样幸运的是ssh提供了连接重用功能，这个功能的原理很简单，开一个ssh连接放在后台，以后再需要用ssh到同样的远程主机时，ssh会直接用这个连接的socket文件，不再创建新的连接了，同理，也不需要进行用户身份验证了，只需要在本地新建文件`~/.ssh/config`并输入如下命令即可：

```
Host *
ControlMaster auto
ControlPath ~/.ssh/master-%r@%h:%p
```

### 自定义配置

```bash
# tmux.conf
bind - split-window -v -c "#{pane_current_path}"
bind c new-window -c "#{pane_current_path}"
set -g default-terminal screen-256color
set-option -ga terminal-overrides ",*256col*:Tc"
setw -g mode-keys vi # 开启vi风格后，支持vi的C-d、C-u、hjkl等快捷键

# Use Alt-arrow keys to switch panes
bind -n M-Left select-pane -L
bind -n M-Right select-pane -R
bind -n M-Up select-pane -U
bind -n M-Down select-pane -D

# Shift arrow to switch windows
bind -n S-Left previous-window
bind -n S-Right next-window

# Mouse mode
set -g mouse on

# Easy config reload
bind-key r source-file ~/.tmux.conf \; display-message "tmux.conf reloaded"
```

### Awesome-cheatsheets

```shell
##############################################################################
# TMUX CHEATSHEET (中文速查表)  -  by ziyenano (created on 2018/03/15)
# Version: 1, Last Modified: 2018/03/15 00:30
# https://github.com/skywind3000/awesome-cheatsheets
##############################################################################


##############################################################################
# session
##############################################################################

tmux                      # 创建新的 session
tmux new -S name          # 创建新的 session 并指定一个name
tmux ls                   # 查看多少个后台工作的 session
tmux a/at/attach          # 重新连接 session 
tmux a/at/attach -t num   # 如果有多个 session, 指定 session num 连接
tmux kill-ses -t myses    # kill 某个 session
tmux kill-ses -a          # kill 所有 session, 除了当前的 session
tmux kill-ses -a -t myses # kill 所有 session, 除了 myses


##############################################################################
# 操作方式 
##############################################################################

<prefix> + key            # <prefix> 默认为 ctrl + b
<prefix> + c              # 表示先按 ctrl + b 再按 c 键


##############################################################################
# 帮助信息
##############################################################################

<prefix> + ?              # 查看所有的 key map


##############################################################################
# window 操作 
##############################################################################

<prefix> + c              # 新建一个 window
<prefix> + n              # 下一个 window
<prefix> + p              # 上一个 window
<prefix> + w              # 列出 window
<prefix> + &              # 关闭当前 window
<prefix> + num[1-9]       # 选定特定 num 的 window
<prefix> + f              # 查找 window 
<prefix> + ,              # 重命名 window 
<prefix> + .              # 移动 window 



##############################################################################
# pane 操作 
##############################################################################

<prefix> + %              # 横向分裂 
<prefix> + "              # 纵向分裂 
<prefix> + 方向键         # 在一个 window 中切换 pane 
<prefix> + ctrl-方向键    # 调整 pane 大小
<prefix> + z              # 全屏化当前 pane, 再次执行退出全屏 
<prefix> + x              # 关闭当前 pane
<prefix> + q              # 显示 pane 编号
<prefix> + o              # 跳到下一个 pane 
<prefix> + {              # 跟前一个编号的 pane 交换
<prefix> + }              # 跟后一个编号的 pane 交换
<prefix> + ;              # 跳转到上一个活跃的 pane 
<prefix> + !              # 将 pane 转化为 window 
<prefix> + <Space>        # 改变 pane 的布局 


##############################################################################
# session 
##############################################################################

<prefix> + d              # detach 整个session, 后续可以重新连接
<prefix> + s              # 列出 session
<prefix> + $              # 重命名 session
<prefix> + (              # 跳到上一个 seesion 
<prefix> + )              # 跳到下一个 seesion 


##############################################################################
# Misc 
##############################################################################
<prefix> + t              # 显示时钟 
<prefix> + :              # 命令行 

##############################################################################
# pane 同步
##############################################################################

:setw synchronize-panes  # 打开(关闭) pane 同步模式, 发送命令到所有的 pane 中
                         # 只影响当前 window 的 pane

##############################################################################
# 复制模式 (copy-mode) 
##############################################################################

添加下面一行到 $HOME/.tmux.conf, 通过 vim 的快捷键实现浏览, 复制等操作;

setw -g mode-keys vi 

更多 vim 快捷键可参考 ../editors/vim.txt, 以下列出一些常用快捷键. 

<prefix> + [              # 进入 copy mode 

vi             emacs      功能
^              M-m        # 跳转到一行开头
Escape         C-g        # 放弃选择
k              Up         # 上移
j              Down       # 下移 
h              Left       # 左移
l              Right      # 右移
L                         # 最后一行
M              M-r        # 中间一行
H              M-R        # 第一行    
$              C-e        # 跳转到行尾
:              g          # 跳转至某一行
C-d            M-Down     # 下翻半页
C-u            M-Up       # 上翻半页
C-f            Page down  # 下翻一页
C-b            Page up    # 上翻一页
w              M-f        # 下一个字符     
b              M-b        # 前一个字符
q              Escape     # 退出        
?              C-r        # 往上查找
/              C-s        # 往下查找
n              n          # 查找下一个

Space          C-Space    # 进入选择模式
Enter          M-w        # 确认选择内容, 并退出 

<prefix> + ]              # 粘贴选择内容(粘贴 buffer_0 的内容) 

:show-buffer              # 显示 buffer_0 的内容
:capture-buffer           # 复制整个能见的内容到当前的 buffer
:list-buffers             # 列出所有的 buffer 
:choose-buffer            # 列出所有的 buffer, 并选择用于粘贴的 buffer
:save-buffer buf.txt      # 将 buffer 的内容复制到 buf.txt
:delete-buffer -b 1       # 删除 buffer_1


##############################################################################
# mouse-mode 
##############################################################################

:set -g mouse on           # 打开鼠标模式


##############################################################################
# References
##############################################################################

https://gist.github.com/MohamedAlaa/2961058
https://tmuxcheatsheet.com/

所有的快捷键都有对应的 command, 参考:
http://man.openbsd.org/OpenBSD-current/man1/tmux.1

可以通过 $HOME/.tmux.conf 更改配置, 参考一些比较好的 tmux 配置:
https://github.com/gpakosz/.tmux
```