# MockSys-server
[MockSys](https://www.mocksys.com/)是一个数据接口模拟平台，旨在为大前端开发者提供可用、高效的接口数据模拟服务，方便在服务端还未产出接口的情况下开发、调试以及效果演示，进而提高前后端分离开发的生产效率。

本项目分为前台和服务端2个子项目：
* MockSys-client：前台基于Vue [传送门](https://github.com/cfz1005/vue-element-mocksys)
* MockSys-server：服务端基于Koa2 + Mysql + Redis [传送门](https://github.com/cfz1005/vue-element-mocksys-server)

本项目开源 & 完全免费~

目前[MockSys](https://www.mocksys.com/)平台由个人开发和维护，当前还较为粗糙，使用过程如有问题欢迎沟通交流，提供宝贵意见，谢谢！

**注意：本项目接口没有做任何的XSS等安全性检测，请勿在生产环境下使用！！**

|加我微信|
|:--:|
|<img src="https://www.mocksys.com/docs/assets/img/wx.jpg" alt="" width="150">|


# 部署相关
## 环境要求
* Node.js v10.0+
* Mysql v5.7+
* Redis v5.0+

## 配置说明
* 整个服务的相关配置都在/src/config/index.js里头，比如端口、token、session、mysql、redis等，请自行修改~
* 根目录sql文件夹下为mysql脚本，可执行导入~


## 初始化 安装项目依赖
```
npm install
```

### 开启项目
```
npm run serve
```


### 状态码
|状态码|描述|
|--|--|
|401|客户端参数错误 或 非法操作提示|
|402|没有提供token|
|403|token过期|
|404|找不到相关数据 或 没有权限访问|
|50x|服务端错误|