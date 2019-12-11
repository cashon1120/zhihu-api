const Router = require('koa-router')
const jwt = require('koa-jwt')
const {find, findById, create, update} = require('../controllers/topic')
const {
  secret
} = require('../config')
const auth = jwt({
  secret
})
const router = new Router({prefix: '/topic'})

router.get('/', find)

router.get('/:id', findById)

router.post('/', auth, create)

router.patch('/:id', auth, update)

module.exports = router