#INeeding平台项目

##项目简介：
```
  “INeeding社区”是一款基于手机APP的产品，主要目标群体为在校大学生，
产品主要有“物品汇”、“服务营”和“梦想秀”三大功能模块。产品立足于校内圈
层，以按需定制为出发点，建立以实名制为核心的专业信用体系，将线上运营与
线下服务相结合从而打造一个互助共享、安全可靠、方便快捷的综合类校园服务
平台。
```
##项目结构(后端)：
```
  /bower_components/： Bower依赖目录  
  /common/:            作为controllers扩展目录  
  /controllers/:       主要业务逻辑实现目录  
  /middlewares/:       中间件目录  
  /models/:            对象Schema定义目录  
  /node_modules/:      Node依赖存放目录  
  /proxys/:            数据库代理目录    
  /public/:            静态文件存放目录  
  /test/:              单元测试脚本存放目录  
  /views/:             前端页面存放目录  

  web_router.js        路由配置文件
  config.js            项目配置文件
  package.json         npm配置文件
  Bower.json           Bower配置文件(Bower目录文件)
  .gitignore           git配置文件
```

##版本(详见package.json文件)： 
``` 
Node.js  ^4.x  
npm 有安全更新，请注意官网  
Express  ^4.x  
MongoDB  ^2.6  
```
##开发
###运行：
**注意**
```note
由于添加了ccap图片验证，只能运行于linux平台，大家可以注释掉sign.js中相关部分后运行程序。
```
```
  1.  安装Node,Express4，推荐安装Nodemon。  
  2.  开启MongoDB服务,Redis数据库服务。  
  3.  命令行进入项目目录，输入npm install -d。  
  4.  输入Node app.js或npm start。  
  5.  浏览器输入localhost:3000。  
```
###调试开发：
```
  1.  符合运行条件，MongoDB，Redis数据库开启。  
  2.  安装Node-inspector。npm install Node-inspector -gd。  
  3.  命令行输入Node-inspector。  
  4.  另打开一个命令行，输入Node[mon] --debug[-brk] app.js //括号内为可选。  
  5.  浏览器输入localhost:8080，打上断点。  
  6.  浏览器另开一个标签,输入localhost:3000。  
```

###测试：  
```
  1.  符合运行条件。  
  2.  确保安装 Mocha, Supertest, Should.js。
  3.  npm install -gd mocha。  
  4.  npm install -d supertest --save。  
  5.  npm install -d should --save。  
  6.  在test/相应目录编写代码。    
  7.  命令行输入mocha --recursive。  
```

##服务器部署
```
  NGINX+PM2  
```
##链接

|名称|地址|
|:---|:---|
|StackOverflow|[StackOverflow](http://stackoverflow.com/)
|npm|[npm](https://www.npmjs.com/)
|Git-scm|[Git-scm](https://git-scm.com/book/zh/v2)
|GitBook|[GitBook](https://www.gitbook.com/explore)
|MongoDB|[MongoDB中文文档(部分)](http://docs.mongoing.com/manual-zh/)
|MarkDown编辑器|[StackEdit](https://stackedit.io/)
|Google搜索|[Lantern](https://github.com/getlantern/lantern) 
|开源协议|[参考知乎](https://www.zhihu.com/question/19568896)
|Notepad++|[Notepad++](https://notepad++-plus-plus.org/)
|Sublime Text 3|[Sublime text 3](http://www.sublimetext.com/3)
|gVim/Vim|[Vim](http://www.vim.org/download.php)

