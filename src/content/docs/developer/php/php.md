---
title: 学习php
---

## 配置问题

* register_globals问题

```
当register_globals=Off的时候，下一个程序接收的时候应该用$_GET('user_name')和$_GET('user_pass')来接受传递过来的值。（注:当\<form\>的method属性为post的时候应该用$_POST('user_name')和$_POST('user_pass')） 

 当register_globals=On的时候，下一个程序可以直接使用$user_name和$user_pass来接受值。 

 顾名思义，register_globals的意思就是注册为全局变量，所以当On的时候，传递过来的值会被直接的注册为全局变量直接使用，而Off的时候，我们需要到特定的数组里去得到它。所以，碰到上边那些无法得到值的问题的朋友应该首先检查一下你的register_globals的设置和你获取值的方法是否匹配。（查看可以用phpinfo()函数或者直接查看php.ini）
```

* 单引号与双引号的区别
  
  - ' '引号中的内容不进行解释,直接输出
  - " "引号中经内容会经过编译器解释,然后再输出
  - " "引号中的数组变量使用时不加''引号, 如$str="select * from $_SERVER(HTTP_HOST)" (php允许在" "中直接包含`字符串`变量)
  - 在一些函数的调用时最好使用双引号如: ```str_replace("\n","<`br /`>",$str)```

* mysqli类对象使用方法:

```
$db=new mysqli("localhost",'jihm','passjhm') or die("can not connect to db ");
if (!$db->select_db("jihm")) {
    echo "can not select db";
    exit;
}
$db->query("set names 'GBK'");
```

* php在上传时, 会将所有的文件上传后再做相应的处理. 需要在浏览器中进行限制. (文件上传大小由两个参数: file_uploads = On,upload_max_filesize,post_max_size)
* php设置打开告警

```
ini_set("display_errors","on"); 
error_reporting(E_ALL);
```

* 一般而言，所有的样式会根据下面的规则层叠于一个新的虚拟样式表中，其中数字 4 拥有最高的优先权。
  * 浏览器缺省设置
  * 外部样式表
  * 内部样式表（位于 <head> 标签内部）
  * 内联样式（在 HTML 元素内部
* 在JQuery中, 设置元素的属性时最好使用以下几种, attr方法在获取时会有些不同:
  * if ( elem.checked )
  * if ( $(elem).prop("checked") )
  * if ( $(elem).is(":checked") )
  * $(elem).attr("checked") `在ajax请求时属性没有变化`
* 在JQuery中, 使用ajax后加载的元素对于一些事件是不能触发(即不能被JQuery范围覆盖的), 可以使用live方法进行绑定.

```
$('.clickme').bind('click', function() {
  // Bound handler called.
});
When the element is clicked, the handler is called. However, suppose that after this, another element is added: 
$('body').append('
Another target
');

This new element also matches the selector .clickme, but since it was added after the call to .bind(), clicks on it will do nothing.

The .live() method provides an alternative to this behavior. To bind a click handler to the target element using this method:
$('.clickme').live('click', function() {
  // Live handler called.
});

And then later add a new element:
$('body').append('
Another target
');

Then clicks on the new element will also trigger the handler.
```

* 使用jquery的时候，如果要动态修改某一元素的属性，比如一个image的onclick属性, 在FF中正常, 但IE是不支持的. 解决方法

```
$(listbb_selectflag+inum+'-4').attr('style','cursor:pointer');
$(listbb_selectflag+inum+'-4').unbind('click').removeAttr('onclick').click(function(){
     csvote(id,inum);
});
```

* php的stdclass, 可以如下使用, 但stdclass对象定义后只能拥有属性, 不能加入或使用方法. 本身是个抽象基类

```
$obj = new stdclass();  //这句可以忽略直接使用下面的语句
$obj->name="test";
$obj->title="title";
var_dump($obj);
```

* php查看对象方法及属性

```
var_dump(get_class_methods(get_class($form)))
```

* php脚本运行时间

```
function getmicrotime(){ 
    list($usec, $sec) = explode(" ",microtime()); 
    return ((float)$usec + (float)$sec); 
    }
$time_start = getmicrotime();
....
$time_end = getmicrotime();
$time = $time_end - $time_start;

echo "Did it in $time seconds";
分段计时:
function runtime($mode = 0) { 
    static $t; 
    if(!$mode) { 
        $t = microtime(); 
        return; 
    } 
    $t1 = microtime(); 
    list($m0,$s0) = split(" ",$t);
    list($m1,$s1) = split(" ",$t1);
    return sprintf("%.3f ms",($s1+$m1-$s0-$m0)*1000); 
} 
runtime(); //计时开始 
/*
// 要计算的PHP脚本
$result = 0;
for($i = 0; $i < 100; $i++)
{
    $result += $i;
}
echo $result;
*/
echo runtime(1); //计时结束并输出计时结果
runtime(); //计时开始 
/*
// 要计算的PHP脚本
$result = 0;
for($i = 0; $i < 100; $i++)
{
    $result += $i;
}
echo $result;
*/
echo runtime(2); //计时结束并输出计时结果  
```

* php直接返回json数据, 而不需要用js的eval函数处理方法: header('Content-type: text/json');
* php随机密码函数

```
function generate_password( $length = 8 ) {
    // 密码字符集，可任意添加你需要的字符
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKL
MNOPQRSTUVWXYZ0123456789!@#$%^&*()-_ []{}<>~`+=,.;:/?|';

    $password = '';
    for ( $i = 0; $i < $length; $i++ ) 
    {
        // 这里提供两种字符获取方式
        // 第一种是使用 substr 截取$chars中的任意一位字符；
        // 第二种是取字符数组 $chars 的任意元素
        // $password .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
        $password .= $chars[ mt_rand(0, strlen($chars) - 1) ];
    }

    return $password;
}
```

* php跨域时, ajax请求被阻止, 报:XmlHttpRequest error: Origin xxxx is not allowed by Access-Control-Allow-Origin

```
解决方法：被请求端添加:
    1.请求的url是PHP的，需要PHP中echo：header('Access-Control-Allow-Origin: *');
    2.html的，需要 <meta http-equiv="Access-Control-Allow-Origin" content="*">
```

* explode都可以，只是不能用\r\n只能用双引号，不能用单引号
* php判断中英文

```
function Check_stringType($str1) {
        $strA = trim($str1);
        $lenA = strlen($strA);
        $lenB = mb_strlen($strA, "utf-8");
        if ($lenA === $lenB) {
            return "1"; //全英文
        } else {
            if ($lenA % $lenB == 0) {
                return "2"; //全中文
            } else {
                return "3"; //中英混合
            }
       }
 }
```

* 判断中文

```
if(!preg_match("/^![pic](\x{4e00}-\x{9fa5})+$/u", $datas![pic]('name'))){
    echo json_encode(array('status'=>1,'msg'=>'请填写中文姓名'));
    exit();
}
```

* php捕获所有异常:

```
function   runtimeErrorHandler($level,$string)
{
    throw   new   Exception($level.'|'.$string); 
} 
set_error_handler( "runtimeErrorHandler");

try{
    $magick_wand = '';
    $upload_path = '';
    MagickWriteImage($magick_wand, $upload_path);
}catch(Exception $e){
    echo json_encode(array("i" => 500,"msg"=>$e->getMessage()));
}
```

* WordPress这么一段代码，借鉴如下：

```
    $str = 'Hello，世界！';
preg_match_all('/./us', $str, $match);
echo count($match![pic](0));  // 输出9
```

* getuuid:

```
function guid(){
    if (function_exists('com_create_guid')){
        return com_create_guid();
    }else{
        mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
        $charid = strtoupper(md5(uniqid(rand(), true)));
        $hyphen = chr(45);// "-"
        $uuid = chr(123)// "{"
                .substr($charid, 0, 8).$hyphen
                .substr($charid, 8, 4).$hyphen
                .substr($charid,12, 4).$hyphen
                .substr($charid,16, 4).$hyphen
                .substr($charid,20,12)
                .chr(125);// "}"
        return $uuid;
    }
```

## js笔记

* 变量作用域
  * 过程体(包括方法function,对象Object o ={})外的所有变量不管你有没有加var保留字,他都是全局变量
  * 而在过程体内(包括方法function(){},对象Object o={})内的对象加var保留字则为局部变量,而不加var保留字即为全局变量
  * js的全局作用域应该是在看着办的的范围内,不一定是同一个页面,比如说在一个iframe里就不可以调用嵌入他的页面的JS
* setInterval及setTimeout: setTimeout()是一次性作用,而setInterval()是每隔iMilliSeconds就执行一次, 用法和setTimeout()是一样的:iTimerID = window.setInterval(vCode, iMilliSeconds [, sLanguage])
* javascript IE下不能用 trim函数解决方法

```
在头上加上这一句，上面的就可以在IE和FF下都可以运行了
<script language="javascript">
  String.prototype.trim=function(){return this.replace(/(^\s*)|(\s*$)/g,"");}
  var test1 = "    aa    ";
  test1 = test1.toString();
  test1 = test1.trim();
</script>
```

* 快速安装memcache

```
printf "\n" | /usr/local/php-5.4/bin/pecl install memcache
```
