import express from 'express'
import mongoose from 'mongoose'
import {APP_PORT,DB_URL} from './config'
import errorHandler from './middlewares/errorHandler'
import routes from './Routes'
import path from 'path'


const app = express()
mongoose.connect(DB_URL, {  useCreateIndex:true,useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const db = mongoose.connection
db.once('open',()=>{
    console.log("Connections are successful")
})
db.on('error',()=>{ 
    console.log("Connections are not successful")
})


global.appRoot = path.resolve(__dirname)

app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use('/api',routes)
app.use('/uploads',express.static('uploads'))



app.use(errorHandler)
app.listen(APP_PORT,()=>{
    console.log(`Listening on port ${APP_PORT}`)
})
1
