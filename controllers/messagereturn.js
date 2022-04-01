const Messages = require('../models/messagereturn')
const { errorHandler } = require('../helpers/dbErrorHandler')

exports.messagesById = (req,res,next,id) =>{
    Messages.findById(id).exec((err,messages) =>{
        if(err || !messages){
            return res.status(400).json({
                error: "Il n'y a pas le message approprié"
            })
        }
        req.messages = messages
        next()
    })
}


exports.create = (req, res) =>{
    const messages = new Messages(req.body)
    messages.save((err, messages) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)  
            })
        }
        res.json({
            messages
        })
    })
}

exports.readMessage = (req,res)=>{
    return res.json(req.messages)
}