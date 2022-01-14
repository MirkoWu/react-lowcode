# react-lowcode
React  lowcode 低代码平台


### 配置  


添加路由组件
```
npm install react-router-dom -S
// 或者
yarn add react-router-dom  
```

添加antd
```
yarn add antd
import './App.css';
改为
import 'antd/dist/antd.css';
```

添加antd-mobile
```
$ npm install --save antd-mobile@next
# or
$ yarn add antd-mobile@next
```

添加sortablejs react版本要注意修改"react-sortablejs": "1.5.1",
```
npm install --save react-sortablejs sortablejs
npm install --save-dev @types/sortablejs
或
yarn add react-sortablejs sortablejs
yarn add -D @types/sortablejs
```

添加其他组件
```
npm install find-process --save

npm install immutability-helper --save
```

```
npm i --save lodash.uniqueid
Lodash ReferenceError: _ is not defined
解决方法：
import _ from 'lodash';
"eslintConfig"{
"globals": { "_": true }
}
```

添加axios，并解决跨域问题
```
1.在项目目录下输入以下命令:
  npm i axios
2.在需要使用的页面引入
import axios from 'axios'

"proxy": "http://localhost:8000"


另一种：
1、安装http-proxy-middleware
npm install http-proxy-middleware
2、在src目录下创建setupProxy.js,加入以下代码
const proxy = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(proxy('/baidu', {
        target: "https://news.baidu.com/",
        pathRewrite: {'^/baidu': ''},
        changeOrigin: true
    }));
    app.use(proxy('/api', {
        target: "https://www.fakin.cn/",
        pathRewrite: {'^/api': ''},
        changeOrigin: true
    }));
};

此处需要注意的是 setupProxy.js 文件是在src目录，而不是在根目录
```