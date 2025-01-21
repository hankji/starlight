---
title: Sublime配置
---

### 基本配置

#### Global Settings - User

```json
{
    "ignored_packages": [],
    "tab_completion": true
}
```

#### File Settings - User

```json
{
    "color_scheme": "Packages/Color Scheme - Default/Monokai.tmTheme",
    "translate_tabs_to_spaces": true,
    "auto_complete_commit_on_tab": true,
    "font_face": "Monaco",
    "vintage_start_in_command_mode": true,
    "vintage_ctrl_keys": true,
    "font_size": 11
}
```

### 备注

```json
// 全局设置
"highlight_modified_tabs": true // 变更文件所属的tab高亮

// 折叠
ctrl+shift+[    // 折叠代码（光标所在块）
ctrl+shift+]    // 展开折叠的代码（光标所在块）
ctrl+k,t        // 折叠所有元素属性
ctrl+k,0        // 取消所有折叠
ctrl+k,ctrl+1~9 // 折叠第1~第9级块（第2级最有用）

// 选择
ctrl+shift+j    // 选择当前块，并且包含缩进（再也不用鼠标去拖选了）

// 全局设置 [Global Settings - User]
"ignored_packages": ["Vintage"] // vi 模式

// 文件设置 [File Settings - User]
"draw_indent_guides": true // 渲染缩进指示线

// 热键
alt+.           // 自动结束标签
ctrl+shift+a    // 扩展选区到标签
ctrl+k+b        // 切换边栏
ctrl+b          // 编译

// 项目设置
// docs: http://www.sublimetext.com/docs/2/projects.html
// 增加项目包含过滤选项：file_exclude_patterns 和 folder_exclude_patterns，分别为文件和文件夹匹配模式。
// 例：
{
    "path": "/D/dev.workspace/foo",
    "folder_exclude_patterns": ["data", "css"],
    "file_exclude_patterns": ["*.png"]
}
```

### 热键

```
Ctrl+L           选择整行（按住-继续选择下行）
Ctrl+KK          从光标处删除至行尾
Ctrl+Shift+K     删除整行
Ctrl+Shift+D     复制光标所在整行，插入在该行之前
Ctrl+J           合并行（已选择需要合并的多行时）
Ctrl+KU          改为大写
Ctrl+KL          改为小写
Ctrl+D           选词（按住-继续选择下个相同的字符串）
Ctrl+M           光标移动至括号内开始或结束的位置
Ctrl+Shift+M     选择括号内的内容（按住-继续选择父括号）
Ctrl+/           注释整行（如已选择内容，同“Ctrl+Shift+/”效果）
Ctrl+Shift+/     注释已选择内容
Ctrl+Space       自动完成（win与系统快捷键冲突，需修改）
Ctrl+Z           撤销
Ctrl+Y           恢复撤销
Ctrl+Shift+V     粘贴并自动缩进（其它兄弟写的，实测win系统自动缩进无效）
Ctrl+M           光标跳至对应的括号
Alt+.            闭合当前标签
Ctrl+Shift+A     选择光标位置父标签对儿
Ctrl+Shift+[     折叠代码
Ctrl+Shift+]     展开代码
Ctrl+KT          折叠属性
Ctrl+K0          展开所有
Ctrl+U           软撤销
Ctrl+T           词互换
Tab              缩进
Shift+Tab        去除缩进
Ctrl+Shift+UP    与上行互换
Ctrl+Shift+DOWN  与下行互换
Ctrl+K Backspace 从光标处删除至行首
Ctrl+Enter       插入行后
Ctrl+Shift Enter 插入行前
F9               行排序（按a-z）
```
