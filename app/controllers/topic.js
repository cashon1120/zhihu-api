
const Topic = require('../models/topic')

class TopicCtl {
  async find(ctx){
    ctx.body = await Topic.find()
  }

  async findById(ctx){
    const {fields} = ctx.query
    const selectFields = fields ? fields.split(';').filter(f => f).map(f => ' +' + f).join('') : null
    const topic = await Topic.findById(ctx.params.id).select(selectFields)
    if(!topic){
      ctx.throw(404, '没找到该话题')
    }
    ctx.body = topic
  }

  async create(ctx){
    ctx.verifyParams({
      name: {
        type: 'string',
        required: true
      },
      avatar_url: { type: 'string'},
      introduction: { type: 'string'}
    })
    const topic = await new Topic(ctx.request.body).save()
    ctx.body = topic
  }

  async update(ctx){
    ctx.verifyParams({
      name: {
        type: 'string'
      },
      avatar_url: { type: 'string'},
      introduction: { type: 'string'}
    })
    const topic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body)
    ctx.body = topic
  }
}

module.exports = new TopicCtl()