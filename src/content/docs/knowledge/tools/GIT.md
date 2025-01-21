---
title: GIT日常
---

## 拉取远程分支

1. **git fetch origin dev（dev为远程仓库的分支名）**
2. **git checkout -b dev(本地分支名称) origin/dev(远程分支名称)**

## Tips

* 初始化
  * 新建仓库: `git init `
  * 从现有仓库克隆: `git clone git://github.com/schacon/grit.git`
* 查看状态: `git status`
* 隐藏文件或者目录:
  ```
   vim .git/info/exclude
   *.log
   *.bak
  ```
* 查看已暂存与未暂存的区别: `git diff`
* 查看已暂存与上次提交的文件区别: `git diff --cached filename`
* 添加新文件或已暂存文件: `git add`
* 提交更新: `git commit -m 'update message'`
* 跳过暂存直接更新: `git commit -a -m 'xxxxx'` (Git 就会自动把所有已经跟踪过的文件暂存起来一并提交)
* 移除文件: `git rm filename`
  * 将文件从跟踪列表中删除: `git rm --cached filename`
* 移动文件: `git mv name_a name_b`
* git 获取其他分支的单个文件或目录
  * ```bash
      git checkout dev -- dir2/f2.txt
      // 复制 dev 分支的 dir2/f2.txt 文件到当前分支。
      // 命令中的 dev 是分支名，也可以是任意一次 commit 的 hash，或者其他 tree-ish。
    
      // 在 git 的文档里，git checkout 的功能描述：「Switch branches or restore working tree 
      // files」。它做的事情太多了，所以在 git2.23 以及之后的版本，它被「拆分」了：切换分支的工作由 git switch 命令来做，恢复文件的工作由 git restore 来做。
    ```
* 查看提交历史: `git log`
  ```
  我们常用 -p 选项展开显示每次提交的内容差异，用 -2 则仅显示最近的两次更新
  ```
* 某些时候，单词层面的对比，比行层面的对比，更加容易观察:   `git log -U1 --word-diff`
* 撤消操作:
  * 修改最后一次提交
    ```
    $ git commit -m 'initial commit'
    $ git add forgotten_file
    $ git commit --amend
    ```
  * 取消已经暂存的文件 : `git reset HEAD <file>...`
  * 取消对文件的修改: `git checkout -- <file>...`
* 查看或恢复本地某个版本: `git reset HEAD^ (or git reset HEAD ch1版本号)`
* 恢复git服务器上某个版本: `git revert 版本号 (会自动生成commit用于修改版本历史用于提交)`

## 远程仓库

* 查看: `git remote -v`
* 添加远程仓库: `git remote add (shortname) (url)`
* 从远程仓库抓取数据: `git fetch (remote-name)`
```
实际上，默认情况下 git clone 命令本质上就是自动创建了本地的 master 分支用于跟踪远程仓库中的 master 分支（假设远程仓库确实有 master 分支）。所以一般我们运行 git pull，目的都是要从原始克隆的远端仓库中抓取数据后，合并到工作目录中的当前分支。
```
* 推送数据到远程仓库: `git push (remote-name) (branch-name)`
* 远程仓库的删除和重命名: `git remote rename (a) (b) | git remote rm (a)`
* 获取远程分支数据:
```bash
git remote show origin;
git remote update;
git fetch;
git checkout --track origin/serverfix;
```

## 打标签

* 列出已有标签: `git tag`
* 查看相应标签的版本: `git show v1.0`
* 新建标签: 
  * 含附注的标签: `git tag -a v1.0 -m 'xxxxxxoooooo'`
  * 签署标签(如果你有自己的私钥，还可以用 GPG 来签署标签，只需要把之前的 -a 改为 -s): `git tag -s v1.0 -m 'xxxxoooo'`
  * 轻量级标签: `git tag v1.0`  不使用任何参数
  * 验证标签: `git tag -v (tag-name)` (此命令会调用 GPG 来验证签名，所以你需要有签署者的公钥，存放在 keyring 中，才能验证)
  * 后期加注标签:

```
    $ git log --pretty=oneline
166ae0c4d3f420721acbb115cc33848dfcc2121a started write support
9fceb02d0ae598e95dc970b74767f19372d61af8 updated rakefile
964f16d36dfccde844893cac5b347e7b3d44abbc commit the todo
8a5cbc430f1a9c3d00faaeffd07798508422908a updated readme
    // 我们忘了在提交 “updated rakefile” 后为此项目打上版本号 v1.2，没关系，现在也能做。只要在打标签的时候跟上对应提交对象的校验和（或前几位字符）即可
    $ git tag -a v1.2 9fceb02
```

* 分享标签: git push origin v1.0
  * 推送所有本地标签: git push origin --tags

### 技巧和窍门

* git命令别名

```
$ git config --global alias.co checkout
$ git config --global alias.br branch
$ git config --global alias.ci commit
$ git config --global alias.st status
```

* git stash

```
git stash: 备份当前的工作区的内容，从最近的一次提交中读取相关内容，让工作区保证和上次提交的内容一致。同时，将当前的工作区内容保存到Git栈中。
git stash apply: 恢复最近一次stash
git stash pop: 从Git栈中读取最近一次保存的内容，恢复工作区的相关内容。由于可能存在多个Stash的内容，所以用栈来管理，pop会从最近的一个stash中读取内容并恢复。
git stash list: 显示Git栈内的所有备份，可以利用这个列表来决定从那个地方恢复。
git stash clear: 清空Git栈。此时使用gitg等图形化工具会发现，原来stash的哪些节点都消失了。
git stash show -p stash@\{0\}: 显示Stash栈内文本内容
```bash
$ git checkout stash@{0} -- <filename>    //从Stash中提取指定文件
$ git show stash@{0}:<full filename>  >  <newfile>  // 另存指定新文件中
```

```
* git 分支上合并其它分支的某些次提交
```

git cherry-pick <commit id>

```
### 分支 
* 创建分支: `git branch  (name)`
* 切换分支: `git checkout (name)  (git checkout -b (name): 创建并切换至name分支上)`
* 合并分支: `git checkout master; git merge (hotfix)`
```

git merge --no-ff xxx 比较好

```
* 删除分支: `git branch -d (name)`
* 查看分支:
```

git branch
git branch -v
git branch --merged
git branch --no-merged

```
* 更新本地分支: `git fetch origin`
* 推送本地分支: `git push (远程仓库名) (分支名)`
* 查看分支tracking: `cat .git/config`
```

[branch "master"]
  remote=origin
  rebase=true
  merge =refs/heads/master

```
* 冲突解决: the following untracked file will be overwrite...
```

git clean -d -fx

```
### 单个文件恢复 
* 恢复到最后一次提交的改动：git checkout -- + 需要恢复的文件名
```

但是，需要注意的是，如果该文件已经 add 到暂存队列中，上面的命令就不灵光喽
需要先让这个文件取消暂存：
git reset HEAD -- + 需要取消暂存的文件名
然后再使用第一条命令。
如果感觉命令多了记不住，那就做一两个匿名呗，比如：
git config --global alias.unstage 'reset HEAD --'
git config --global alias.restore 'checkout --'
我们拿 README.md 这个文件举例，比如修改了一段文字描述，想恢复回原来的样子：
git restore README.md
即可，如果修改已经被 git add README.md 放入暂存队列，那就要
git unstage README.md
git restore README.md
才能恢复成功哦。

```
### 整体恢复 
```

正确的做法应该是：
git fetch --all
git reset --hard origin/master
git fetch 
只是下载远程的库的内容，不做任何的合并git reset 把HEAD指向刚刚下载的最新的版本

```
- 撤消上一次commit: `git reset –soft HEAD~1`

### 导出
使用 git archive 可以导出干净的代码，具体可以看 git help archive，简单使用如下：
```

$git archive --format zip --output "./output.zip" master -0  
将代码导出并 zip 打包后放在当前目录下，`output.zip`就是需要的文件，`-0`的意思是不压缩

```
### 历史版本
1. git checkout -b name-of-new-branch current-branch

### zsh-git-plug常用快捷键
~~~
alias g='git'
alias ga='git add'
alias gb='git branch'
alias gc='git commit -v'
alias gcmsg='git commit -m'
alias gco='git checkout'
alias gd='git diff'
alias gl='git pull'
alias gp='git push'
alias glg='git log --stat'
alias glgp='git log --stat -p'
alias glgg='git log --graph'
alias gm='git merge'
alias gst='git status'
alias ggpush='git push origin $(git_current_branch)'
~~~
```

git commit 新修改的内容 添加到上次提交中 减少提交的日志

```bash
git commit --amend  # 会通过 core.editor 指定的编辑器进行编辑
git commit --amend --no-edit   # 不会进入编辑器，直接进行提交
```

 合并多个commit

```bash
commit 3ca6ec340edc66df13423f36f52919dfa3......
commit 1b4056686d1b494a5c86757f9eaed844......
commit 53f244ac8730d33b353bee3b24210b07......
commit 3a4226b4a0b6fa68783b07f1cee7b688.......

1.从HEAD版本开始往过去数3个版本
git rebase -i HEAD~3
2.指名要合并的版本之前的版本号(请注意3a4226b这个版本是不参与合并的，可以把它当做一个坐标)
git rebase -i 3a4226b

执行了rebase命令之后，会弹出一个窗口,将pick改为squash或者s,保留一个pick
```

### 如何使用git worktree?

当然！`git worktree` 是一个非常有用的 Git 命令，它允许你在同一个仓库中同时管理多个工作目录。这对于需要在不同分支或提交之间进行切换，或者需要同时处理多个任务的开发者来说非常方便。下面是一些使用 `git worktree` 的常见操作和示例：

1. 创建一个工作目录：
   
   ```
   git worktree add <path> <branch>
   ```
   
   这会在 `<path>` 指定的位置创建一个新的工作目录，并将其关联到 `<branch>` 指定的分支。例如，如果你想在当前仓库中创建一个名为 `my-worktree` 的工作目录，并关联到 `feature` 分支，可以运行以下命令：
   
   ```
   git worktree add my-worktree feature
   ```

2. 列出当前仓库的所有工作目录：
   
   ```
   git worktree list
   ```
   
   这会显示当前仓库中所有的工作目录列表，以及它们所关联的分支和位置。

3. 切换到工作目录并进行操作：
   
   ```
   cd <path>
   ```
   
   可以使用 `cd` 命令进入指定的工作目录，并在其中进行代码修改、提交等操作。工作目录和主仓库之间是相互独立的，所以你可以在不影响其他工作目录或主仓库的情况下进行修改。

4. 删除一个工作目录：
   
   ```
   git worktree remove <path>
   ```
   
   这会移除 `<path>` 指定的工作目录。在删除工作目录之前，请确保你已经完成了其中的工作并提交了所有更改。

这些是 `git worktree` 命令的一些基本用法。你可以根据自己的需求灵活运用它们。更多详细的用法和选项可以查看 Git 官方文档中关于 `git worktree` 的说明。
