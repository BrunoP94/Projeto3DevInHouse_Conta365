const express = require('express')
const financialRoutes = express.Router()
const financialController = require('../../controllers/financialController.js')
const multer = require('multer')
const upload = multer()

financialRoutes.post('/v1/finances/:id', upload.single('file'), financialController.uploadXLSX)
financialRoutes.delete('/v1/finances/:userId/:financialId', financialController.deleteOne)
financialRoutes.get('/v1/finances/:userId', financialController.idexMonthYear)

module.exports = financialRoutes