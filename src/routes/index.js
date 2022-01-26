const express = require('express')
const routes = express.Router()
const usersRoutes = require('./v1/user.routes')
const financialRoutes = require('./v1/financial.routes')
//routes.use('/api', [usersRoutes])

routes.use([usersRoutes, financialRoutes])

module.exports = routes