## 所使用的工具如下：

## nodejs,babel

> Node 版本 v6.0+

- npm scripts

## 如何使用?

下载项目：

  git clone https://github.com/HiZhaoxiaoyang/easymockJson.git

更新源/所有分支
 - git pull/fetch

执行 npm 安装 cnpm：
  
 - npm install cnpm -g

执行 yarn 安装：

 - cnpm install yarn -g 

更换为淘宝源：

 - yarn config set registry https://registry.npm.taobao.org

### 新建项目（无package）

  初始化项目：

   - yarn init

### 已有项目（package.json）

执行 yarn (当yarn失败时用cnpm保证正常的安装包) 安装：

 - yarn install 
 或(cnpm install)
 - ..generate yarn.lock

### 其它

更新源（无参默认为更新全部）：
 - yarn upgrage [param node_module1 ...node_module2] --save-dev

安装npm源 (eg: npm-pkg)：

 - yarn add npm-pkg

项目启动：
we can using npm scripts `start` `dev` `product` `test`

- yarn start (npm start) 

## 模块化

js使用commonjs/es6/7(babel)模块化规范来组织

## Style Guide

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript/tree/master/es5)

## 基础库

- nodejs
- babel

## Mock模拟数据
- 新增数据访问地址：http://localhost:9801
- 根据与后端约定好的接口（或接口文档），输入新接口路径路由（route - eg: path1/path2/list.json）及json样例数据（content）保存即可生成服务端json数据文件（未做面向用户验证、注意空内容和非法格式）；
- 考虑到模拟数据短期临时性和时效性（介于需求评审、前后单接口约定及与设计图到位空档期），无需easymock、postman（npm版）等接近cms+数据库的整体方案及mock.js语法等跨环境及语言干扰；
- 比较第三方mock系统跨域非同源，支持restful的CRUD（get,post,put,delete）同源策略（默认访问地址及端口 - eg: http://localhost:9801/path1/path2/list.json）；
- 相对路径，利用模拟数据开发完的业务js无需二次改动（联调和接口增改除外）可直接用于测试机和线上；
- 非通用数据或配置根据需要可在版本库忽略；

## 测试方案

## 文档

