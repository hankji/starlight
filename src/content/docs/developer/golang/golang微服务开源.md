---
title: golang开源工具
---

## golang微服务开源

- Træfɪk（发音像流量）是现代的HTTP反向代理和负载平衡器，轻松部署微服务器 https://github.com/containous/traefik
- go微服务设计模式
  https://github.com/tmrts/go-patterns
- go微服务
  https://github.com/peterbourgon/go-microservices
- go熔断
  https://github.com/gocircuit/circuit
- go实现微服务
  - https://github.com/micro/micro
  - https://github.com/micro/go-micro
  - https://github.com/micro/go-plugins
- fabio是一款快速，现代，零兼容的负载均衡HTTP（S）路由器，用于部署由领事管理的应用程序。
  在领事馆注册您的服务，提供健康检查，fabio将开始向他们发送流量。不需要配置 部署，升级和重构从未如此简单。
  https://github.com/eBay/fabio
- Go Kit是用于在大型组织中构建微服务的分布式编程工具包。我们解决了分布式系统中的常见问题，因此您可以专注于业务逻辑。
  https://github.com/go-kit/kit

## 服务框架

- Gizmo，“纽约时报”的微服务工具包★
- 微软，微服务客户端/服务器库★
- h2，微服务框架★
- 聊天，异步对等通信协议和库
- 风筝，微服务框架
- gocircuit，动态云编排

## 个别组件

- afex/hystrix-go，客户端延迟和容错库
- armon/go指标，用于将性能和运行时指标导出到外部指标系统的库
- codahale/lunk，结构化日志记录在谷歌的Dapper或Twitter的Zipkin的风格
- eapache/弹性，弹性模式
- sasbury/logging，标记的日志记录样式
- grpc/grpc-go，基于HTTP / 2的RPC
- 不及格/log15，简单，强大的日志记录为Go★
- mailgun/vulcand，由etcd支持的编程负载均衡器
- mattheath/磷光体，分布式系统跟踪
- 关键 - 高隆/ager ager，一个舆论记录库
- 红宝石/断路器，断路器库
- Sirupsen/logrus，结构化，可插拔记录为Go★
- sourcegraph/appdash，基于Google Dapper的应用程序跟踪系统
- spacemonkeygo/monitor，数据采集，监控，仪器和Zipkin客户端库
- streadway/handy，net / http处理程序过滤器
- vitess/rpcplus，包rpc + context.Context
- gambore/mangos，nanomsg实现在纯Go

## go最佳实践

- https://peter.bourgon.org/go-best-practices-2016/
- https://micro.mu/docs/writing-a-go-service.html
- https://github.com/goadesign/goa

## web框架

- [大猩猩](http://www.gorillatoolkit.org/)
- [杜松子酒](https://gin-gonic.github.io/gin/)
- [Negroni](https://github.com/codegangsta/negroni)
- [Goji](https://github.com/zenazn/goji)
- [马蒂尼](https://github.com/go-martini/martini)
- [蜜蜂](http://beego.me/)
- [狂欢](https://revel.github.io/) 

## go libs

- YoungPioneers/blog4go (基准测试来看是最快的)
- https://github.com/sirupsen/logrus (json格式日志,可定制,灵活性高)
- [go.uuid](https://github.com/satori/go.uuid) +
- [goSnowFlake](https://github.com/zheng-ji/goSnowFlake) +
- [goSnowFlake](https://github.com/bwmarrin/snowflake) ++
- [bleve](https://github.com/blevesearch/bleve) +++ (搜索引擎)

## 收集

1. Golang 中的连续栈 http://blog.shiwuliang.com/2017/02/25/Go%E8%AF%AD%E8%A8%80%E4%B8%AD%E7%9A%84Continuous%20Stack(%E8%BF%9E%E7%BB%AD%E6%A0%88)/
2. goroutine,channel和CSP http://www.moye.me/2017/05/05/go-concurrency-patterns/
3. NSQ 作为微服务的消息总线 https://yami.io/golang-nsq/
4. 使用 docker 部署 Golang web app 与 couchbase https://blog.couchbase.com/deploy-golang-web-application-couchbase-docker-containers/
5. 一款 Go 的大数据 Query 框架 https://github.com/pilosa
6. 协程视图化 http://divan.github.io/posts/go_concurrency_visualize/ 
7. http://www.aerospike.com 高性能数据库
8. https://www.graylog.org 监控工具
9. https://go.wavefront.com/grafana/ metrics监控工具
10. chatops 更好的运维方式
11. https://github.com/cweill/gotests 自动生成测试用例