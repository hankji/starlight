---
title: 滚动js示例
---

## 滚动js示例 

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head> 
      <meta charset="UTF-8">
      <title>垂直向上间断循环滚动文字</title>
      <meta name="author" content="bossma,bosma@yeah.net" />
      <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js"></script> 
      <script type="text/javascript">
            var interval = 3000; // 两次滚动之间的时间间隔
            var stepsize = 78; // 滚动一次的长度，必须是行高的倍数，这样滚动的时候才不会断行
            var scrollspeed = "normal"; // 可选("slow", "normal", or "fast")，或者滚动动画时长的毫秒数
            var objInterval = null;

            $(document).ready(function() {
                  // 用上部的内容填充下部
                  $("#bottom").html($("#top").html());

                  // 给显示的区域绑定鼠标事件
                  $("#content").bind("mouseover", function() { StopScroll(); });
                  $("#content").bind("mouseout", function() { StartScroll(); });

                  // 启动定时器
                  StartScroll();
            });

            // 启动定时器，开始滚动
            function StartScroll() {
                  objInterval = setInterval("verticalloop()", interval);
            }

            // 清除定时器，停止滚动
            function StopScroll() {
                  window.clearInterval(objInterval);
            }

            // 控制滚动
            function verticalloop() {
                  // 判断是否上部内容全部移出显示区域
                  // 如果是，从新开始;否则，继续向上移动
                  if ($("#content").scrollTop() >= $("#top").outerHeight()) {
                        $("#content").scrollTop($("#content").scrollTop() - $("#top").outerHeight());
                  }
                  // 使用jquery创建滚动时的动画效果
                  $("#content").animate({ "scrollTop": $("#content").scrollTop() + stepsize + "px" }, scrollspeed, function() {
                        // 这里用于显示滚动区域的scrollTop，实际应用中请删除
                        $("#foot").html("scrollTop:" + $("#content").scrollTop());
                  });
            }
      </script>
      <style type="text/css">
            .infolist { width: 400px; margin: 0; }
            .infolist ul { margin: 0; padding: 0; }
            .infolist ul li { list-style: none; height: 26px; line-height: 26px; }
            .infocontent { width: 400px; height: 130px; overflow: hidden; border: 1px solid #666666; }
      </style>
</head> 
<body> 
      <div id="title" style="width: 100%; height: 40px;">看看间断滚动文字</div>
      <!-- 使用overflow:hidden隐藏超出的部分 -->
      <div id="content" class="infocontent"> 
            <div id="top" class="infolist">
                  <ul>
                        <li>全国政协首次公布去年会议花销 共5900万 1</li>
                        <li>全国政协首次公布去年会议花销 共5900万 2</li>
                        <li>全国政协首次公布去年会议花销 共5900万 3</li>
                        <li>全国政协首次公布去年会议花销 共5900万 4</li>
                        <li>全国政协首次公布去年会议花销 共5900万 5</li>
                        <li>全国政协首次公布去年会议花销 共5900万 6</li>
                        <li>全国政协首次公布去年会议花销 共5900万 7</li>
                        <li>全国政协首次公布去年会议花销 共5900万 8</li>
                        <li>全国政协首次公布去年会议花销 共5900万 9</li>
                        <li>全国政协首次公布去年会议花销 共5900万 10</li>
                        <li>全国政协首次公布去年会议花销 共5900万 11</li>
                        <li>全国政协首次公布去年会议花销 共5900万 12</li>
                        <li>全国政协首次公布去年会议花销 共5900万 13</li>
                        <li>全国政协首次公布去年会议花销 共5900万 14</li>
                        <li>全国政协首次公布去年会议花销 共5900万 15</li>
                  </ul>
            </div>
            <div id="bottom" class="infolist"></div> 
      </div>
      <div id="foot"></div> 
</body>
</html>
```
