# 开发笔记

### 1.引入 antd (3.x)
配合对应版本进行按需加载、替换主题颜色操作。
新版本 antd 文档只提供了更改主题操作，详细内容可查阅文档。

### 2.react-router引入
在 App.jsx 的模板中配置好相应的页面主路由 `/login` `/admin`。

### 3.页面编写

#### 3.1 Login
引入图片的方式：import logo from './img/logo.png',然后在模板中调用logo这个变量。
引入 antd 的 form 表单组件完成登录的静态样式。


### 4.配置api地址
第一次尝试在 .env 文件中写入后台接口的地址，然后用环境变量进行读取。
> `npm start`: `.env.development.local`, `.env.development`, `.env.local`, `.env`
> `npm run build`: `.env.production.local`, `.env.production`, `.env.local`, `.env`
> `npm test`: `.env.test.local`, `.env.test`, `.env (note .env.local is missing)`

以上是各个命令读取 .env 文件的优先级
在项目中，只需要调用 process.env 即可读取到需要的环境变量。
最后在git的忽略文件中配置就可以将接口地址隐藏。