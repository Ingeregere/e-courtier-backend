const express = require ('express')
const router = express.Router()


const {userById, read, update,userListAdmin,updateUser,
photo,listUser,listProps,activeAdmin,blockAdmin,oneUser,acceptContract} = require('../controllers/user')
const {requireSignin, isAuth, isAdmin,isProps} = require('../controllers/auth')
router.get('/secret/:userId',requireSignin,isAuth, isAdmin, (req,res) =>{
   console.log(req.profile)
    res.json({
        user: req.profile //
    }) 
})
router.get('/user/:userId',requireSignin, isAuth, read)
router.get('/user/read/:userId',read)
router.put('/user/update/:userId/:adminId',requireSignin,isAuth,isAdmin, updateUser)
router.put('/user/update-user/:userId',requireSignin,isAuth,updateUser)
router.get('/users',userListAdmin) 
router.get('/userss',listUser) 
router.get('/props',listProps)
router.get('/user/photo/:userId',photo)
router.put('/user/activeadmin/:id/:adminId',requireSignin,isAuth,isAdmin, activeAdmin)
router.put('/user/blockadmin/:id/:adminId',requireSignin,isAuth,isAdmin, blockAdmin)
router.put('/user/acceptcont/:id/:userId',requireSignin,isAuth,isProps,acceptContract)
router.get('/userone/:id',oneUser)
// Middleware 
router.param('userId', userById)
router.param('adminId', userById) 

module.exports = router  