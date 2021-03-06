项目结构：
```
├── README.md
├── bin
│   └── index.js
├── doc            // 文档
│   ├── CONTRIBUTE.md
│   └── IDE.md
├── logs
├── package.json
├── server.babel.js
├── src
│   ├── blockchain // 区块链相关
│   │   ├── api.js
│   │   ├── index.js
│   │   ├── model.js
│   │   └── test.js
│   ├── config    // 配置
│   │   ├── development.js
│   │   ├── index.js
│   │   └── production.js
│   ├── database  // leveldb数据库接口
│   │   ├── index.js
│   │   ├── model.js
│   │   └── test.js
│   ├── index.js
│   ├── lib       // 工具库
│   │   ├── polyfill.js
│   │   └── test.js
│   ├── mine     // 挖矿
│   │   ├── index.js
│   │   └── test.js
│   ├── p2p      // 基于grpc的数据同步
│   │   ├── api.js
│   │   ├── index.js
│   │   └── test.js
│   ├── transaction // 交易
│   │   ├── api.js
│   │   ├── index.js
│   │   ├── model.js
│   │   └── test.js
│   └── wallet // 钱包
│       ├── api.js
│       ├── index.js
│       ├── model.js
│       └── test.js
└── yarn.lock
```

单个模块结构：
```
wallet // 模块名
├── api.js // 包含导出在express中的接口
├── index.js // 模块出口
└── test.js  // 单元测试
```

导出路由的写法：
以HTTP的小写method开始, 空格后写路由路径，支持的method为：`get`, `post`, `put`, `delete`举例如下：
```js
'post /wallet/create'
```
完整的例子：
```js
{
  'post /wallet/create': (req, res, next) => {
    res.send(200)
  },
  'get /wallet/detail': (req, res) => {
    res.send('detail')
  }
}
```
