const express = require('express')
const mongoose = require ('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const expressValidator = require('express-validator')
require('dotenv').config()

// importation routes  
 
const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const categoryRoutes = require('./routes/category')
const underCategoryRoutes = require('./routes/underCategory')
const productRoutes  = require('./routes/product')
const messagesRoutes = require('./routes/messages')
const messageReturnRoutes = require('./routes/messagereturn')

//=======================application======================
const app = express()
   
//===========================la base des données===================

mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => {
    console.log('La base de données est connectée.')
})
// middleware
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(expressValidator())
app.use(cors()) // used to connect

//====================Routes middleware============================

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', underCategoryRoutes);
app.use('/api', messagesRoutes); 
app.use('/api', messageReturnRoutes);
app.use('/api',productRoutes)

const port =  process.env.PORT || 9000

app.listen(port,() => {
    console.log(`Serveur e-courtier est lancé sur le PORT ${port}.`)
})

     