const formidable = require('formidable')
const _= require('lodash')
const fs = require('fs') 
const UnderCategory = require('../models/underCategory')
const {errorHandler} = require('../helpers/dbErrorHandler')
// const { result } = require('lodash')

exports.underCategoryById = (req,res,next,id)=>{
  UnderCategory.findById(id).exec((err,underCategory)=>{
      if(err || !underCategory){
          return res.status(400).json({
              err:"La sous-catégorie n'existe pas"
          })
      }
      req.underCategory = underCategory
      next()
  })
}
// Read 
exports.read = (req,res)=>{
 req.underCategory.photo = undefined
 res.json(req.underCategory)
}
//Remove or delete
exports.remove = (req,res)=>{
 let underCategory = req.underCategory
 underCategory.remove((err,deleteUnderCategory)=>{
     if(err){
         return res.status(400).json({
             error:errorHandler(err)
         })
     }
     res.json({
        
         message:"La sous-catégorie est supprimée avec succes"
     })
 })
}

exports.create = (req,res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error:"L'image n'est pas téléverser"
            })
        }
        // // Tester si tout les champs existent
        const {nameUnderCategory,category} = fields
        if(!nameUnderCategory || !category){
            return res.status(400).json({
                error:"Veuillez completer tout les champs SVP !" 
            })
        }
        let underCategory = new UnderCategory(fields)
        //1kb == 1000
        //1mb == 1000000
        if(files.photo){
            if(files.photo.size>1000000){
                return res.status(400).json({
                  error:"L'image doit être en dessous de 2mb ou 1mb=='1000000'"
            })
            }
            
            underCategory.photo.data = fs.readFileSync(files.photo.path)
            underCategory.photo.contentType = files.photo.type
        }

        underCategory.save((err,result)=>{
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            res.json({result})
        })
    })
}

//Mise a jour les donnees 
exports.update = (req,res) =>{
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req,(err,fields,files)=>{
        if(err){
            return res.status(400).json({
                error:"L'image n'est pas téléverser"
            })
        }
        let underCategory = req.underCategory
        underCategory = _.extend(underCategory,fields)
        //1kb == 1000
        //1mb == 1000000
        if(files.photo){
            if(files.photo.size>1000000){
                return res.status(400).json({
                  error:"La taille d'image doit être en dessous de 2mb ou 1mb=='1000000'"
            })
            }
            underCategory.photo.data = fs.readFileSync(files.photo.path)
            underCategory.photo.contentType = files.photo.type
        }
        underCategory.save((err,result)=>{
            if(err){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            res.json({result})
        })
    })
} 

// Lister toutes sous-categories
exports.listAll = (req,res) =>{
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 4

    UnderCategory.find({"status":{$eq:"active"}})
        .select("-photo") 
        .populate('Category')
        .sort([[sortBy,order]])
        .limit(limit)
        .exec((err,undercategory) =>{
            if(err) {
                return res.status(400).json({
                    error: 'Aucune categorie est trouvee'
                })
            }
            res.json(undercategory)
        })
}



exports.listRelated = (req,res) =>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 2
UnderCategory.find({_id: {$ne: req.undercategory},category: req.undercategory.category})
        .limit(limit)
        .populate('Category','_id name')
        .exec((err,undercategory) =>{
            if(err) {
                return res.status(400).json({
                    error: 'Aucune categorie est trouvee'
                })
            }
            res.json(undercategory)
        })
}


exports.photo = (req,res,next) =>{
    if(req.underCategory.photo.data){
        res.set('Content-Type',req.underCategory.photo.contentType)
        return res.send(req.underCategory.photo.data)
    }
    next()  
}









//list undercategory by category
exports.listUnderCategoryByCategory = (req,res)=>{
    const id = req.params.id
    UnderCategory.find({"category":{$eq:id}})
    .select("-photo")
    .exec((err,result)=>{  
        if(err){
            res.status(400).json({
                error:"il y a pas des catégories qui correspondents a celle-ci"
            })
        }
        res.json(result)
    })
}

exports.listDeleted = (req,res) =>{
    // req.category.photo = undefined
   UnderCategory.find({"status":{$eq:"deleted"}}).exec((err,undercategory) => {
       if(err) {
           return res.status(400).json({
               error: errorHandler(err)
           })
       }

       res.json(undercategory)
   })
}

exports.listActive = (req,res) =>{
    // req.category.photo = undefined
   UnderCategory.find({"status":{$eq:"active"}}).exec((err,undercategory) => {
       if(err) {
           return res.status(400).json({
               error: errorHandler(err)
           })
       }
    //    res.photo=undefined
       res.json(undercategory)
   })
}
//active and delete under category
exports.activeCategory = (req,res)=>{
    const id = req.params.id 
    UnderCategory.updateOne(
        { _id: id },
        { $set: { "status": "active" } },
        (err,undercategory)=>{
            if(err){
                res.status(400).json({ 
                    error:"vous n'êtes pas autorisé à éffectuer cette action"
                })
            }
            res.json(undercategory)

        }
     )
}

exports.deleteCategory = (req,res)=>{
    const id = req.params.id 
    UnderCategory.updateOne(
        { _id: id },
        { $set: { "status": "deleted" } },
        (err,undercategory)=>{
            if(err){
                res.status(400).json({ 
                    error:"vous n'êtes pas autorisé à éffectuer cette action"
                })
            }
            res.json(undercategory)

        }
     )
}