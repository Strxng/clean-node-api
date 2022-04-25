const loginRouter = require('../composers/loginRouterComposer')
const ExpressRouterAdapter = require('../adapters/expressRouterAdapter')

module.exports = router => {
  router.post('/login', ExpressRouterAdapter.adapt(loginRouter))
}
