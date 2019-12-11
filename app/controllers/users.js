const jsonwebtoken = require('jsonwebtoken')
const Users = require('../models/users')
const {
  secret
} = require('../config')


class UsersCtl {

  // 获取用户列表
  async getList(ctx) {
    ctx.body = await Users.find()
  }

  // 创建用户
  async create(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      }
    })
    const repeatedUser = await Users.findOne({
      name: ctx.request.body.name
    })
    if (repeatedUser) {
      ctx.throw(409, '用户已存在!')
    }
    const user = await new Users(ctx.request.body).save()
    ctx.body = user
  }

  // 查询用户详情
  async getById(ctx) {
    const {
      fields
    } = ctx.query
    const selectFields = fields ? fields.split(';').filter(f => f).map(f => ' +' + f).join('') : null
    const user = await Users.findById(ctx.params.id).select(selectFields)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    ctx.body = user
  }

  // 判断用户是否存在
  async checkUserExist(ctx, next){
    const user = await Users.findById(ctx.params.id)
    if(!user){
      ctx.throw(404, '用户不存在')
    }
    await next()
  }

  // 判断用户是否有权限进行当前操作
  async checkOwner(ctx, next) {
    if (ctx.params.id !== ctx.state.user._id) {
      ctx.throw(404, '没有权限')
    }
    await next()
  }

  // 更新用户信息
  async update(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: false
      },
      password: {
        type: 'string',
        required: false
      },
      avatar_url: {
        type: 'string',
        required: false
      },
      gender: {
        type: 'string',
        required: false
      },
      headline: {
        type: 'string',
        required: false
      },
      locations: {
        type: 'array',
        itemType: 'string',
        required: false
      },
      business: {
        type: 'string',
        required: false
      },
      employments: {
        type: 'array',
        itemType: 'object',
        require: false
      },
      educations: {
        type: 'array',
        itemType: 'object',
        required: false
      }
    })
    const user = await Users.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user
  }

  // 删除用户
  async del(ctx) {
    const user = await Users.findByIdAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404)
    }
    ctx.status = 204
  }

  // 登录
  async login(ctx) {
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      }
    })

    const user = await Users.findOne(ctx.request.body)
    if (!user) {
      ctx.throw(401, '用户名或密码不正确')
    }
    const {
      _id,
      name
    } = user
    const token = jsonwebtoken.sign({
      _id,
      name
    }, secret, {
      expiresIn: '1d'
    })
    ctx.body = {
      token
    }
  }

  // 获取关注列表
  async listFollowing(ctx) {
    const user = await Users.findById(ctx.params.id).select('+following').populate('following')
    if (!user) {
      ctx.throw(404)
    }
    ctx.body = user.following
  }

  // 关注指定用户
  async follow(ctx) {
    const me = await Users.findById(ctx.state.user._id).select('+following')
    const followingId = ctx.params.id
    if (!me.following.map(id => id.toString()).includes(followingId)) {
      me.following.push(followingId)
      me.save()
      ctx.body = '关注成功'
    }else{
      ctx.body = '已关注该用户'
    }
    // ctx.status = 204
  }

  // 获取粉丝列表
  async listFollowers(ctx){
    const users = await Users.find({following: ctx.params.id})
    ctx.body = users
  }

  // 取消关注指定用户
  async unFollow(ctx){
    const me = await Users.findById(ctx.state.user._id).select('+following')
    const followingId = ctx.params.id
    const index = me.following.map(id => id.toString()).indexOf(followingId)
    if(index >= 0){
      me.following.splice(index, 1)
      me.save()
      ctx.body = '取消成功'
    }else{
      ctx.body = '当前没有关注该用户'
    }
  }
}

module.exports = new UsersCtl()