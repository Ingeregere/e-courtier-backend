const formidable = require('formidable')
const _= require('lodash')
const fs = require('fs')
const User = require('../models/user')
const {errorHandler} = require('../helpers/dbErrorHandler')


exports.userById = (req,res,next,id) =>{
    User.findById(id).exec((err,user) =>{
        if(err || !user) {
            return res.status(400).json({
                error: "L'utilisateur non trouvé" 
            })
        }
        req.profile = user
        next()
    })
}


exports.read = (req,res) =>{
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}
//
exports.updateUser = (req,res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields,files)=>{ 
        if(err){
            return res.status(400).json({
                error:"L'image n'est pas téléversée"
            })
        }
        let profile = req.profile
        profile = _.extend(profile,fields)
        //1kb == 1000
        //1mb == 1000000
        if(files.photo){
            if(files.photo.size>1000000){
                return res.status(400).json({
                  error:"La taille d'image doit être en dessous de 2mb ou 1mb=='1000000'"
            })
            }
            profile.photo.data = fs.readFileSync(files.photo.path)
            profile.photo.contentType = files.photo.type
        }
        profile.save((err,result)=>{
            if(err){ 
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            result.hashed_password=undefined
            result.salt=undefined
            res.json({result})
        })
    })
}

exports.update=(req,res)=>{
    User.findOneAndUpdate(
        { _id:req.profile._id },
        { $set:req.body },
        { new:true },
        (err,user)=>{
            if(err){
                return res.status(400).json({
                    error:"vous n'êtes pas autorisé à effectuer cette action"
        })

            }
            user.hashed_password=undefined
            user.salt=undefined
            res.json(user)
        }
    )
}




exports.userListAdmin = (req,res)=>{
    User.find({"role":{$eq:"ADMIN"}}).exec((err,admin)=>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
        res.json(admin)
    })
}
exports.listProps = (req,res)=>{
    User.find({"role":{$eq:"PROPS"}}).exec((err,props)=>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
        res.json(props)
    })
}
exports.listUser = (req,res)=>{
    User.find({"role":{$eq:"USER"}}).exec((err,user)=>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
        res.json(user)
    })
}
// Photo profil
exports.photo = (req,res,next) =>{
    if(req.profile.photo.data){
        res.set('Content-Type',req.profile.photo.contentType)
        return res.send(req.profile.photo.data)
    }
    next()  
}
/*
----------Acces aux utilisateurs--------------------
*/

exports.activeAdmin  = (req,res)=>{
    const id = req.params.id 
    User.updateOne(
        { _id: id },
        { $set: { "status": "active" } },
        (err,user)=>{
            if(err){
                res.status(400).json({ 
                    error:"vous n'êtes pas autorisé à éffectuer cette action"
                })
            }
            user.hashed_password=undefined
            user.salt=undefined
            res.json(user)

        }
     )
}

exports.blockAdmin  = (req,res)=>{
    const id = req.params.id
    User.updateOne(
        { _id: id },
        { $set: { "status": "blocked" } },
        (err,user)=>{
            if(err){
                res.status(400).json({ 
                    error:"vous n'êtes pas autorisé à effectuer cette action"
                })
            }
            user.hashed_password=undefined
            user.salt=undefined
            res.json(user)

        }
     )
}

//
exports.oneUser = (req,res) =>{
    const id = req.params.id
    User.find({"_id":{$eq:id}}).exec((err,user) =>{
        if(err) {
            return res.status(400).json({
                error: "L'utilisateur non trouvé" 
            })
        }
        user.hashed_password=undefined
        user.salt=undefined
        res.json(user)
    })
}

/*-----*/
exports.acceptContract  = (req,res)=>{
    const id = req.params.id
    User.updateOne(
        { _id: id },
        { $set: {"contract": "accept"} },
        (err,user)=>{
            if(err){
                res.status(400).json({ 
                    error:"vous n'êtes pas autorisé à effectuer cette action"
                })
            }
            user.hashed_password=undefined
            user.salt=undefined
            res.json(user)

        }
     )
} 