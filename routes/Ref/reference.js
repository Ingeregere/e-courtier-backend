const express = require('express')
const router = express.Router()

const {
    create,
    productById,
    read,
    list,
    update,
    listRelated,
    listUnderCategories,
    photo,
    listBySearchProduct,
    listSearchProduct,
    remove,
    slide1,
    slide2,
    slide3
} = require("../controllers/products")
const {userById} = require('../controllers/user')
const {requireSignin,isAuth,isAdmin} = require('../controllers/auth')



router.post('/product/create/:userId/',requireSignin,isAuth,isAdmin,create)
router.put('/product/update/:productId/:userId', requireSignin, isAuth, isAdmin, update)
router.get('/product/:productId', read)
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, remove)
router.get('/products', list)  
router.get('/product/related/:productId', listRelated)   
router.get('/product/categories', listUnderCategories)
router.post('/products/by/search/', listBySearchProduct)
router.get('/products/search/', listSearchProduct)
router.get("/product/photo/:productId", photo) 
router.get("/product/slide1/:productId", slide1) 
router.get("/product/slide2/:productId", slide2) 
router.get("/product/slide3/:productId", slide3)

//middleware
router.param('userId',userById)
router.param('productId', productById)

module.exports = router  