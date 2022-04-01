const express = require ('express')
const router = express.Router()

const { create,readMessage,messagesById} = require('../controllers/messagereturn')
const {requireSignin,isAuth,isAdmin} = require('../controllers/auth')
const {userById} = require('../controllers/user')
const {MessageValidator} = require('../validator')


router.get('/messagereturn/:messagesId', readMessage)
router.post('/messagereturn/create/',MessageValidator, create)  
// router.put('/messages/updateread/:id/:userId',readMessages)


router.param('userId', userById)
router.param('messagesId', messagesById)

module.exports = router