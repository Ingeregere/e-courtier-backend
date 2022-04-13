const express = require('express')
const router = express.Router()

const {
    addProduct,
    productById,
    readProduct,
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
    slide3,
    postedProduct,
    activeProduct,
    deletedProduct,
    listProductUnposted,
    listProductDel,
} = require('../controllers/product')
const { requireSignin, isAuth, isAdmin, isAdminAndPorps } = require('../controllers/auth')
const { userById } = require('../controllers/user')

router.post('/add/product/:userId/', requireSignin, isAuth, isAdminAndPorps, addProduct)
//
router.get('/product/:productId', readProduct)
router.put('/product/update/:productId/:userId', requireSignin, isAuth, isAdmin, update)
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
router.put('/product/postedprod/:id/:userId', requireSignin, isAuth, isAdmin, postedProduct)
router.put('/product/activepro/:id/:userId', requireSignin, isAuth, isAdmin, activeProduct)
router.put('/product/deletepro/:id/:userId', requireSignin, isAuth, isAdmin, deletedProduct)
router.get("/productunposted", listProductUnposted)
router.get("/productdel", listProductDel)


router.param('userId', userById)
router.param('productId', productById)

module.exports = router