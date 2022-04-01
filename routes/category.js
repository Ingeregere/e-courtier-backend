const express = require ('express')
const router = express.Router()

const { create, categoryById,read, update, 
        remove, list,photo ,activeCategory,deletedCategory,listDeleted} = require('../controllers/category')
const {requireSignin,isAuth,isAdmin} = require('../controllers/auth')
const {userById} = require('../controllers/user')
const {categoryValidator} = require('../validator')

router.get('/category/:categoryId', read)
router.post('/category/create/:userId', requireSignin,isAuth, isAdmin,create)
router.put('/category/update/:categoryId/:userId', requireSignin, isAuth, isAdmin,update)
router.delete('/category/delete/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove)
router.get('/categories', list) 
router.get('/categoriesdel', listDeleted) 
router.get('/category/photo/:categoryId',photo) 
router.put('/category/activecat/:id/:userId', requireSignin, isAuth, isAdmin,activeCategory)
router.put('/category/deletedcat/:id/:userId', requireSignin, isAuth, isAdmin,deletedCategory)



router.param('userId', userById)
router.param('categoryId', categoryById)

module.exports = router