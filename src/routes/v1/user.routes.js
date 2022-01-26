const express = require('express')
const usersRoutes = express.Router()
const userController = require('../../controllers/userController.js')

usersRoutes.post('/v1/users', userController.create)
usersRoutes.patch('/v1/user/:id', userController.updateOne)
usersRoutes.get('/v1/user/:id', userController.indexOne)
module.exports = usersRoutes