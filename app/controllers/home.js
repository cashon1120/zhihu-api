const path = require('path')

class HomeCtl {
  index(ctx) {
    ctx.body = 'index'
  }

  upload(ctx) {
    const {
      file
    } = ctx.request.files
    const basename = path.basename(file.path)
    ctx.body = {path: `${ctx.origin}/uploads/${basename}`}
  }
}

module.exports = new HomeCtl()