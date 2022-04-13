const User = require('../models/user')
const {errorHandler} = require('../helpers/dbErrorHandler')
const jwt = require('jsonwebtoken') //to generate signed token
const expressJwt = require('express-jwt')
require('dotenv').config()
  

exports.signup = (req,res) => { 
    //console.log('req.body',req.body)
    const user = new User(req.body)
    user.save((err,user) => {
        if(err) {  
            return res.status(400).json({
               error: errorHandler(err)
            })     
        }  
        user.salt = undefined
        user.hashed_password = undefined

        res.json({
            user
        })
    })
}


exports.signin = (req,res) => {
    //find the user based on email
    const {email,password} = req.body
    User.findOne({email}, (err,user) =>{
        if(err || !user){
            return res.status(400).json({
                error: "L'utilisateur de ce mot de passe n'existe pas"
            })
        }
        //if user is found make sure the email and password match
        //create authenticate method in user model
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "Le mail et le mot de passe sont incorrect ! Veuillez créer un compte SVP "
            })
        }
        if(user.status!="active"){
            return res.status(404).json({
              error:"Vous n'avez pas le droit d'acceder ! SVP contacter l'Admin pour plus infos"
            })
        } 
        //generate a signed token with user id secret
        const token = jwt.sign({_id: user._id},process.env.JWT_SECRET)
        //persist the token as 'ingeregeretokencookie' in cookie with expiry date
        res.cookie('ingeregeretokencookie',token,{expire: new Date() + 9999})
        //return response with user and token to frontend client
        const {_id,name,firstname,status,email,role,mobile} = user
        return res.json({token,user: {_id,name,firstname,status,email,role,mobile}})

    })
}


exports.signout = (req,res) => {
    res.clearCookie('ingeregeretokencookie')
    res.json({message: "Vous  êtes deconnecté"})
}

//we are going to protect route

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",
});

exports.isAuth = (req,res,next) =>{
    let user = req.profile && req.auth && req.profile._id == req.auth._id
    if(!user) {
        return res.status(403).json({
            error: "Accès refusé !"
        })
    }
    next()
}  

exports.isAdmin = (req, res, next) =>{ 
    if(req.profile.role != "ADMIN") {
        return res.status(403).json({
            error: "Vous n'êtes pas l'Administrateur! accès refusé "
        })
    }  
    next()
}

exports.isAdminAndPorps= (req,res,next)=>{
    if(req.profile.role !="ADMIN" || req.profile.role !="PROPS"){
      return res.status(403).json({
            error:"Vous n'êtes pas l'Administrateur! accès refusé "
      })
    }
    next()
}