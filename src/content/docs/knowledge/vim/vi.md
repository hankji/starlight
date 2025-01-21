---
title: Vim 学习
---

## Vim 插件管理

- 管理工具 pathogen

## 生成代码 ctags

```sh
d:\program\Vim\vim74\ctags.exe --languages=PHP --exclude=data -R
```

## 多文件编辑

如果当前行还没有保存（并且 autowrite 未设置），则不能使用 `:e`、`:n` 和 `:rew` 命令。命令后面的 `!` 使得安全特性无效。

```vim
:e foo       # 停止对当前文件的编辑，开始编辑 foo 文件
:e! foo      # 同上，但是取消对当前文件的修改
:e!          # 装入当前文件的最近保存的内容
Ctrl+^       # 返回到最近编辑的文件
:n           # 编辑下一个文件（当用 vi 同时编辑多个文件时）
:set autowrite(aw)  # 在用 :n 切换到下一个文件之前自动保存当前文件
:rew         # 返回到文件列表的第一个文件（当用 vi 同时编辑多个文件时）
:r foo       # 把 foo 文件的内容插入当前行的下面
:set list    # 显示 tab
```

## 多窗口（vim）

```vim
:sq          # 把当前窗口拆分为两个
:new         # 打开一个新的空白窗口
Ctrl+w Ctrl+w  # 在窗口之间切换
:on          # 把当前窗口变为唯一的窗口
:q           # 退出当前窗口
:qa          # 退出所有窗口
:xa          # 保存并退出全部窗口
Ctrl+        # 增大窗口尺寸
Ctrl-        # 减小窗口尺寸
```

## 搜索与重复

搜索模式 `pat` 可以是一个字符串，也可以是一个正则表达式。vi 使用一套专用的字符序列来执行一行内的搜索。

```vim
/pat         # 向前搜索 pat
?pat         # 向后搜索 pat
/printf      # 向前搜索 printf
0-0$         # 向后搜索行尾的数字
/^#          # 向前搜索行首的 #
n            # 按上次搜索方向重复搜索
N            # 按与前次搜索的相反方向重复搜索
:set wrapscan(ws)  # 继续搜索直至达到文件尾
:set ignorecase(ic)  # 搜索时不区分大小写
:set magic    # 保留正则表达式字符的意义
fc           # 在当前行向前搜索字符 c
Fc           # 在当前行向后搜索字符 c
;            # 在当前行重复上次向前搜索
,            # 在当前行重复上次逆向搜索
/.*aa\&.*bb/ # 可搜索到同时包含 aa 和 bb 的字串，aa 和 bb 没有顺序要求
```

## 替换

源模式 `s1` 也可以是正则表达式。使用欧冠地址时，"." 代表当前行，"$" 代表最后一行，"1,$" 代表整个文件。

```vim
:.s/s1/s2     # 把当前行中第一次出现的 s1 替换为 s2
:1,$s/s1/s2   # 把整个文件里的 s1 替换为 s2
:1,$s/echo/printf/g  # 把全部的 echo 替换为 printf
:1,$s/s1/s2/gc  # 按交互方式把全部 s1 替换为 s2
:1,$s/#//g    # 删除文件中所有的 “#”
:3,10s/^/#/g  # 在 3 至 10 行的行首插入 “#”
:$s/$/;/      # 在最后一行的行尾插入 “;”
:1,$s/s1/s2/g # 把所有的 s1 替换为 s2
:1,$s/HEAD/<&>/g  # 把所有的 HEAD 替换为 <HEAD>
:%s/old_word/new_word/g  # 在整个文件中替换特定字符串
```

## 标志与书签

```vim
ma    # 设置一个标签 a 
'a    # 移动到标签 a
"     # 在当前标志与前一个标志位置之间切换
```

## 重做与恢复

```vim
.     # 重复上次命令
u     # 取消上次的编辑命令（在 vim 里取消所有以前的命令）
Ctrl+r  # 重做上次取消的操作(只限于 vim)
U     # 取消所有对当前行的操作
"4p   # 从缓冲区中恢复第 4 次最近的删除操作
```

## 缩写表示

```vim
:ab name stg  # 把 name 缩写为 stg
:unab stg     # 删除 stg 缩写
:ab           # 列出所有的缩写
```

## 映射键

```vim
:map key commands  # 把 key 映射到 commands
:map! key commands  # 在输入模式下把 key 映射到 commands
:unmap key  # 取消命令模式下的 key 映射
:unmap! key  # 取消输入模式下的 key 映射
:map         # 显示命令模式下所有的映射
:map!        # 显示输入模式下的所有映射
```

## 与 UNIX 的接口命令

```vim
:!cmd       # 执行 UNIX 的 cmd 命令
:!%         # 把当前文件作为 shell 或 perl 脚本执行
:r !cmd     # 把 cmd 命令的结果插入到当前行的下面
:r !head -n 3 foo  # 把 foo 文件前三行内容插入到当前行的下面
sh          # 暂时退出 UNIX shell 环境
Ctrl+z      # 暂停编辑（用 fg 命令可以返回 vi 编辑器）
:!cc%       # 编译正在编辑的 C 程序
:!javac %   # 编译正在编辑的 Java 程序
```

## 基础

```vim
:cw         # 替换光标所在位置的一个单词
:e <path/to/file>  # 打开一个文件
:saveas <path/to/file>  # 另存为 <path/to/file>
:x， ZZ 或 :wq  # 保存并退出 (:x 表示仅在需要时保存，ZZ 不需要输入冒号并回车)
:bn 和 :bp  # 你可以同时打开很多文件，使用这两个命令来切换下一个或上一个文件。（我喜欢使用 :n 到下一个文件）
:NG         # 到第 N 行 （注意命令中的 G 是大写的，另我一般使用 : N 到第 N 行，如 :137 到第 137 行）
:gg         # 到第一行。（相当于 1G，或 :1）
:G          # 到最后一行。
:w          # 到下一个单词的开头。
:e          # 到下一个单词的结尾。
:gU         # 变大写
:gu         # 变小写
:dt"        # 删除所有的内容，直到遇到双引号—— "。
```

## 其他

- (Ctrl+G) 显示当前文件名; 1+(Ctrl+G) 显示对于用户 homedir 的全路径; n+(Ctrl+G) 显示绝对路径 (but also with buffer number 不理解)
- 检查文件格式及编码时可以使用: `file *` (另外一种方法: `xxd file|head`)
- 去除 BOM 时可以在 VIM 中使用: `:set nobomb`
- vim 中，用 `\c` 和 `\C` 来控制搜索大小写是否敏感。如果想搜索一个词 `abc`，要求大小写敏感，用 `/\Cabc`，如果要求大小写不敏感，则用 `/\cabc`
- 今天看到有同事看 Log，他用 `/` 然后按 `n` 逐个找某个关键字。其实，Vim 可以使用 `:vim /pattern/ %` 在当前文件查找所有符合 pattern 的，然后用 `:copen` 就可以列出所有符合 pattern 的行了。
- 指定文件或目录内进行搜索

```vim
:vimgrep /{pattern}/g {file} ...
:copen   # 打开 quickfix 窗口
```
