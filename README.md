
### 状态码
|状态码|描述|
|--|--|
|401|客户端参数错误 或 非法操作提示|
|402|没有提供token|
|403|token过期|
|404|找不到相关数据 或 没有权限访问|
|500|服务端错误|

### SQL

#### insert response
```
{
fieldCount: 0,
affectedRows: 1,
insertId: 85, ------ 程序判断该字段
serverStatus: 2,
warningCount: 0,
message: "",
protocol41: true,
changedRows: 0
}
```


#### update response
```
{
fieldCount: 0,
affectedRows: 1,------ 程序判断该字段
insertId: 0,
serverStatus: 2,
warningCount: 0,
message: "(Rows matched: 1 Changed: 1 Warnings: 0",
protocol41: true,
changedRows: 1
}
```


#### delete response
```
{
fieldCount: 0,
affectedRows: 1,------ 程序判断该字段
insertId: 0,
serverStatus: 2,
warningCount: 0,
message: "",
protocol41: true,
changedRows: 0
}
```

#### 发送邮件
```
{
accepted: [
"563277464@qq.com"
],
rejected: [ ],
envelopeTime: 184,
messageTime: 1293,
messageSize: 341,
response: "250 Ok: queued as ",
envelope: {
from: "chenfanzhang@4399inc.com",
to: [
"563277464@qq.com"
]
},
messageId: "<6615d317-6e41-5244-c992-85fe423487cd@4399inc.com>"
}
```