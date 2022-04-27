const LoginRouterComposer = require('../composers/loginRouterComposer')
const { adapt } = require('../adapters/expressRouterAdapter')

module.exports = router => {
  router.post('/login', adapt(LoginRouterComposer.compose()))
}
