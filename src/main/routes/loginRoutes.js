const loginRouter = require('../composers/loginRouterComposer')

module.exports = router => {
  router.post('/login', loginRouter)
}
