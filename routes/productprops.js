const express = require('express')
const router = express.Router()

const {
    productById,
    listp 
} = require('../controllers/productprops')
const { requireSignin, isAuth, isAdmin, isProps } = require('../controllers/auth')
const { userById } = require('../controllers/user')

router.get('/productss',listp)

router.param('userId', userById)
router.param('productId', productById)

module.exports = router