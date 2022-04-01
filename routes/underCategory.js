const express = require('express')
const router = express.Router()

const {create,underCategoryById,read,remove,update,listAll,
    photo,listUnderCategoryByCategory,listDeleted,listActive,
    activeCategory,deleteCategory} = require("../controllers/underCategory")
const {userById} = require('../controllers/user')
const {requireSignin,isAuth,isAdmin} = require('../controllers/auth')
const {underCategoryValidator} = require('../validator')
 

router.get('/underCategory/:underCategoryId',read)    
router.post('/underCategory/create/:userId',requireSignin,isAuth,isAdmin,create)
router.delete('/underCategory/delete/:underCategoryId/:userId',requireSignin,isAuth,isAdmin,remove)
router.put('/underCategory/update/:underCategoryId/:userId',requireSignin,isAuth,isAdmin,update)
router.get('/underCategories',listActive) 
router.get('/underCategoriesdel',listDeleted) 
router.get('/underCategory/photo/:underCategoryId',photo)
router.get('/underCategoryByCategory/:id',listUnderCategoryByCategory)
router.put('/undercategory/activecat/:id/:userId', requireSignin, isAuth, isAdmin,activeCategory)
router.put('/undercategory/deletecat/:id/:userId', requireSignin, isAuth, isAdmin,deleteCategory)



//middleware
router.param('userId',userById)
router.param('underCategoryId',underCategoryById)

module.exports = router   