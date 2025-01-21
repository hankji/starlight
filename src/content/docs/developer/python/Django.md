---
title: django
---
## myapp

* 创建工程:   django-admin.py startproject mysite
* 创建应用:   python manage.py startapp blog
* 启动开发环境(在项目目录里执行): python manage.py runserver
* 校验数据模型的有效性: python manage.py validate
* 查看建库语句: python manage.py sqlall mysite(创建某个应用的数据库, sqlall 命令并没有在数据库中真正创建数据表，只是把SQL语句段打印出来)
* 执行建库语句: python manage.py syncdb
  ```
  syncdb 命令是同步你的模型到数据库的一个简单方法。 它会根据 INSTALLED_APPS 里设置的app来检查数据库， 如果表不存在，它就会创建它。 需要注意的是， syncdb 并 不能将模型的修改或删除同步到数据库；如果你修改或删除了一个模型，并想把它提交到数据库，syncdb并不会做出任何处理。需要手动去数据库进行修改
  ```
* 使用admin时, 使用: `python manage.py createsuperuser` 来创建管理员用户
  ```
  提醒一句: 只有当INSTALLED_APPS包含'django.contrib.auth'时，python manage.py createsuperuser这个命令才可用
  ```
* 如果用admin模块管理数据时,可参考如下操作:
```
    创建admin.py:
    from django.contrib import admin
    from mysite.books.models import Publisher, Author, Book
    admin.site.register(Publisher)
    admin.site.register(Author)
    admin.site.register(Book)
```
* 对于少量的共性特征的处理可以放在TEMPLATE_CONTEXT_PROCESSORS设置项中(TEMPLATE_CONTEXT_PROCESSORS 指定了 总是 使用哪些 context processors), `且view函数中需要使用RequestContext对象`:
```
    TEMPLATE_CONTEXT_PROCESSORS = (
        'youflogprocessor.side',
        'django.contrib.auth.context_processors.auth',
        'django.core.context_processors.request', 
        'django.core.context_processors.debug', 
        #'django.core.context_processors.i18n', 
    )
```

## 笔记

* 一个带通配符的 URL ，我们需要一个方法把它传递到视图函数里去，这样 我们只用一个视图函数就可以处理所有的时间段了。 我们使用圆括号把参数在 URL 模式里标识 出来。 在这个例子中，我们想要把这些数字作为参数，用圆括号把 \ d {1, 2}  包围起来：
  (r'^time/plus/(\d{1,2})/$',hours_ahead),
* 用两个大括号括起来的文字（例如 {{ person_name }} ）称为 变量(variable) 。
```
    被大括号和百分号包围的文本(例如 {% if ordered_warranty %} )是 模板标签(template tag) 。标签(tag)定义比较明确，即： 仅通知模板系统完成某些工作的标签。
    句点也可用于访问列表索引，例如：
    >>> from django.template import Template, Context
    >>> t = Template('Item 2 is {{ items.2 }}.')
    >>> c = Context({'items': ['apples', 'bananas', 'carrots']})
    >>> t.render(c)
    u'Item 2 is carrots.'
```
* 模板中没有 {% elif %} 标签
* 在执行循环之前先检测列表的大小是一个通常的做法，当列表为空时输出一些特别的提示。
```
    {% if athlete_list %}
        {% for athlete in athlete_list %}
            <p>{{ athlete.name }}</p>
        {% endfor %}
    {% else %}
        <p>There are no athletes. Only computer programmers.</p>
    {% endif %}

    因为这种做法十分常见，所以`` for`` 标签支持一个可选的`` {% empty %}`` 分句，通过它我们可以定义当列表为空时的输出内容 下面的例子与之前那个等价：
    {% for athlete in athlete_list %}
        <p>{{ athlete.name }}</p>
    {% empty %}
        <p>There are no athletes. Only computer programmers.</p>
    {% endfor %}
    ```
* 网站的base.html页中变量可以在setting.py中指定, 如
```
TEMPLATE_CONTEXT_PROCESSORS = (
    'youflogprocessor.side',
    'django.contrib.auth.context_processors.auth',
    'django.core.context_processors.request', 
    'django.core.context_processors.debug', 
    #'django.core.context_processors.i18n', 
)

```
* 在每个``{% for %}``循环里有一个称为``forloop`` 的模板变量。这个变量有一些提示循环进度信息的属性。forloop 变量仅仅能够在循环中使用。 在模板解析器碰到`{% endfor %}`标签后，forloop就不可访问了。
* 就像HTML或者Python，Django模板语言同样提供代码注释。 注释使用 {# #} 多行注释，可以使用``{% comment %}`` 模板标签
* locals()用法: 
```
    def current_datetime(request):
    current_date = datetime.datetime.now()
    return render_to_response('current_datetime.html', locals())
    locals() 的值，它囊括了函数执行到该时间点时所定义的一切变量。

```
* 如果在模板中使用 `{% extends %}` ，必须保证其为模板中的第一个模板标记。 否则，模板继承将不起作用。
* 系统对app有一个约定： 如果你使用了Django的数据库层（模型），你 必须创建一个Django app。 模型必须存放在apps中
* Django的save()方法更新了不仅仅是name列的值，还有更新了所有的列。 若name以外的列有可能会被其他的进程所改动的情况下，只更改name列显然是更加明智的。 更改某一指定的列，我们可以调用结果集（QuerySet）对象的update()方法： 示例如下：
```

> > > Publisher.objects.filter(id=52).update(name='Apress Publishing')

```
* Django 还提供了另一种方法可以在 URLconf 中为某个特别的模式指定视图函数： 你可以传入一个包含模块名和函数名的字符串，而不是函数对象本身。 继续示例:2
* 
```
from django.conf.urls.defaults import *
urlpatterns = patterns('',
    (r'^hello/$', **'mysite.views.hello'** ),
    (r'^time/$', **'mysite.views.current_datetime'** ),
    (r'^time/plus/(d{1,2})/$', **'mysite.views.hours_ahead'** ),
)(注意视图名前后的引号。 应该使用带引号的 'mysite.views.current_datetime' 而不是 mysite.views.current_datetime 。)

```
* Django报错UnicodeEncodeError: 'ascii' codec can't encode characters 之解决方法:
* 
```
    Python中有两种字符串，分别是一般的字符串（每个字符用8 bits表示）和Unicode字符串（每个字符用一个或者多个字节表示），它们可以相互转换。从错误提示来看同由于Python遇到了编码问题，也就是说，后台输入的数据在默认情况下是ascii编码的，那么在存入数据库的时候，Python便会报错，即使返回去看，数据库中已经插入了该条信息！

　　解决方法：　　因为原先写的模型代码中的方法用提　def __str__(self): 这个是旧版本中用的方法，在Django　0.96以后的版本中，应该换成　def __unicode__(self):，　这样就解决了字符串传递时出错的问题，统一编码为Unicode字符串。

```
* Django报错: "login到admin显示You don't have permission to edit anything":
* 
```
admin.autodiscover()   去掉前面的注释
```
### Django Manager 
* Manager用于操作表级别的数据,可以用来对表中的多个项进行操作. (在model类中添加属于如objects=EntryPublishManager(), class EntryPublishManager(models.Manager))
* Model方法是行级别的方法,用于对行进行操作
* Signals这个东西是非常有用的一个机制,但这个东西还没有正式的文档.
### django安装初始化
Any handlers that listen to this signal need to be written in a particular place: a management module in one of your INSTALLED_APPS. If handlers are registered anywhere else they may not be loaded by syncdb. It is important that handlers of this signal perform idempotent changes (e.g. no database alterations) as this may cause the flush management command to fail if it also ran during the syncdb command.
```
