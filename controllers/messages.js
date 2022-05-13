const Messages = require('../models/messages')
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
/*-----------------------------------*/
exports.list = (req,res) =>{
    Messages.find({"status":{$eq:"unread"}})
        .exec((err,message) =>{
            if(err) {
                return res.status(400).json({
                    error: 'Message non trouve'
                })
            }
            res.json(message)
        })
}
//
exports.listRead = (req,res) =>{
    Messages.find({"status":{$eq:"read"}})
        .exec((err,message) =>{
            if(err) {
                return res.status(400).json({
                    error: 'Message non trouve'
                })
            }
            res.json(message)
        })
}

exports.readMessages = (req,res)=>{
    const id = req.params.id 
    Messages.updateOne(
        { _id: id },
        { $set: { "status": "read" } },
        (err,message)=>{
            if(err){
                res.status(400).json({ 
                    error:"vous n'êtes pas autorisé à éffectuer cette action"
                })
            }
            res.json(message)

        }
     )
}

exports.listMessageProps = (req,res) =>{ 
    Product.find({"product":{$eq:"626fe22555ac8423f09ed6fb"}})
           .exec((err,category) => {
        if(err) {
            return res.status(400).json({
                error: "Il n'y a pas des données"
            })
        }
        
        res.json(category)
    })
 }