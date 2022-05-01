exports.userSignupValidator = (req, res, next) => {
    req.check('firstname', 'Le nom est obligatoire').notEmpty()
    req.check('firstname', 'Le prenom est obligatoire').notEmpty()
    
    req.check('email', 'Email recommande').notEmpty()
        .matches(/.+\@.+\..+/)
        .withMessage("Email doit contenir @")
        .isLength({ min: 14, max: 32 })
        .withMessage('Email  doit etre comprise entre 4 et 32 characteres')

    req.check('mobile','Le mobile est recommandé SVP  !').notEmpty()
    req.check('mobile').isLength({min:8,max:10})
      .withMessage('Le mobile doit avoir au moins 8 chiffres')    

    req.check('password', 'Password est obligatoire').notEmpty()
    req.check('password')
        .isLength({ min: 8 })
        .withMessage('Password doit contenir au moins 8 characteres et un chiffre')
        .matches(/\d/)    
        .withMessage("Password doit contenir un chiffre")
    const errors = req.validationErrors()    
    if (errors) {
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({ error: firstError })   
    }
    next()
} 


exports.userSigninValidator = (req, res, next) => {
    req.check('email', 'Le Email est obligatoire').notEmpty()
        .matches(/.+\@.+\..+/)
        .withMessage("Email doit contenir @")
        .isLength({ min: 14, max: 32 })
        .withMessage('Email  doit etre comprise entre 4 et 32 characteres')

    req.check('password', 'Le password est obligatoire').notEmpty()
    const errors = req.validationErrors()
    if (errors) {
        const firstError = errors.map(error => error.msg)[0] 
        return res.status(400).json({ error: firstError })
    }
    next()
}
 
exports.categoryValidator = (req, res, next) => {
    req.check('name', 'Le nom du catégori est obligatoire').notEmpty()
        .isLength({ min: 4, max: 32 })
        .withMessage('Le nom de catégori doit avoir au moins 4 ou 32 characteres')
    const errors = req.validationErrors()
    if (errors) {
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({ error: firstError })
    }
    next()
}

exports.MessageValidator = (req, res, next) => {
    req.check('messages', 'votre message est vide').notEmpty()
        .isLength({ min: 4})
        .withMessage('Votre message est courte')

    const errors = req.validationErrors()
    if (errors) {
        const firstError = errors.map(error => error.msg)[0]
        return res.status(400).json({ error: firstError })
    }
    next()
}
exports.underCategoryValidator = (req, res, next) => {
    req.check('nameUnderCategory', 'Le nom de sous-catégori est obligatoire').notEmpty()
        .isLength({ min: 4, max: 32 })
        .withMessage('Le nom du sous-catégori doit avoir au moins 4 ou 32 characteres')
        
    const errors = req.validationErrors()
    if (errors) {
    }
    next()
}

