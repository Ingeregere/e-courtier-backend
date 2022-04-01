const mongoose = require('mongoose')
const crypto = require('crypto')
const uuidv1 = require('uuidv1')
const { get } = require('http')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    firstname: { //Le prenom est le nom qu'on peut ajouter sur le profil parce qu'avec tout les noms entier vont pas convenir avec ce dernier
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: 32
    },
    mobile: { 
        type: String,
        trim: true,
        required: true,
        unique: 32
    },
    hashed_password: {
        type: String,
        required: true,
    },
    //information about user in about
    about: {
        type: String,  
        trim: true,
    },
    salt: String,
    role: {
        type: String,
        enum: ['USER','ADMIN','PROPS'],
        default: 'USER', // sinon si role == ADMIN  sinon PROPS
        required: true
      },
      status: {
        type: String,
        enum: ['active','deleted','blocked'],
        default: 'active', // sinon il ne peut se connecter. Donc si son statut == active il peut se connecter
        required: true
      },
    history: {
        type: Array,
        default: []
    },
    photo : {
        data : Buffer,
        contentType : String
    } 

},{timestamps: true}) 

// Champ virtuel pour créer le mot de passe crypté
userSchema.virtual('password')
.set(function(password){
    this._password = password
        this.salt = uuidv1()
        this.hashed_password = this.encryptPassword(password)
})
.get(function(){
    return this._password
})

userSchema.methods = {
    authenticate :function(plainText){
        return this.encryptPassword(plainText) === this.hashed_password
    },
    encryptPassword : function(password){
        if(!password) return ''
        try{
            return crypto.createHmac('sha1',this.salt)
            .update(password)
            .digest('hex')
        }catch(err){
            return ''
        }
    }
}

module.exports = mongoose.model("Users",userSchema)