const express = require ('express')
const router = express.Router()

const { create,readMessage,messagesById,list,readMessages,
    listRead} = require('../controllers/messages')
const {requireSignin,isAuth,isAdmin} = require('../controllers/auth')
const {userById} = require('../controllers/user')
const {MessageValidator} = require('../validator')


router.get('/messages/:messagesId', readMessage)
router.post('/messages/create/',MessageValidator, create)  
router.get('/messages',list)
router.get('/messagesread',listRead)
router.put('/messages/updateread/:id/:userId',readMessages)


router.param('userId', userById)
router.param('messagesId', messagesById)

module.exports = router