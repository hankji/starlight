---
title: nginx-conf
description: A guide in my new Starlight docs site.
---

## 配置转发

```
upstream upstreamswoole {
  ip_hash;
  server 10.10.24.151:9501 weight=100 max_fails=10 fail_timeout=30;
  server 10.10.24.151:9501 weight=100 max_fails=10 fail_timeout=30;
  check interval=3000 rise=2 fall=5 timeout=1000;
}

server
{
        listen 80;
        server_name  swf.gg.pftools.xxx.cn;
        root  /home/apache/www/focus/swf.gg.pftools.xxx.cn;
        access_log logs/swf.gg.pftools.xxx.cn.access.log main;
        charset utf-8;
        location / {
        *        if (!-e $request_filename){
         *           proxy_pass http://127.0.0.1:9501;
         *       }
                allow all;
                set $server_profile "product";
                fastcgi_intercept_errors on;
                proxy_set_header    X-Forwarded-For  $proxy_add_x_forwarded_for;
                proxy_pass  http://upstreamswoole;
        }
}
```
