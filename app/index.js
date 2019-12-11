const Koa = require('koa')
const _ = require('lodash');
const koaBody = require('koa-body')
const koaStatic = require('koa-static')
const parameter = require('koa-parameter')
const error = require('koa-json-error')
const path = require('path')
const app = new Koa()
const routing = require('./routes')
const {connectionStr} = require('./config')

const mongoose = require('mongoose')

// 连接数据库
mongoose.connect(connectionStr, { useNewUrlParser: true, useUnifiedTopology: true  })
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('连接成功')
});

// 上传中间件
app.use(koaBody({
  multipart: true, // 是否允许上传图片
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'), // 上传路径设置
    keepExtensions: true // 保留中间件
  }
}))
// 静态资源托管, 访问所有静态资源默认在 public 下去找
app.use(koaStatic(path.join(__dirname, 'public')))

// koa-json-error 判断当前环境, 生产环境错误信息不包含 stack 信息
const options = {
  postFormat: (e, obj) => process.env.NODE_ENV === 'production' ? _.omit(obj, 'stack') : obj
};
app.use(error(options))

// 验证参数是否合法, 给 ctx 添加 verifyParams 方法
app.use(parameter(app))

// 加载路由, coutes/index.js 脚本自动获取路由
routing(app)

app.listen(3001, () => console.log('程序启动在3001端口...'))