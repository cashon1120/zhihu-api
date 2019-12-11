const Router = require('koa-router')
const jwt = require('koa-jwt')
const {
  secret
} = require('../config')
const {
  getList,
  create,
  getById,
  update,
  del,
  login,
  checkOwner,
  listFollowing,
  follow,
  unFollow,
  listFollowers,
  checkUserExist
} = require('../controllers/users')

const router = new Router({
  prefix: '/users'
})

const auth = jwt({
  secret
})

router.get('/', getList)

router.post('/', create)

router.get('/:id', getById)

router.patch('/:id', auth, checkOwner, update)

router.delete('/:id', auth, checkOwner, del)

router.post('/login', login)

router.get('/:id/following', listFollowing)

router.get('/:id/listfollowers', listFollowers)

router.put('/following/:id', auth, checkUserExist, follow)

router.delete('/following/:id', auth, checkUserExist, unFollow)

module.exports = router