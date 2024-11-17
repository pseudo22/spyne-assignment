
import express from 'express'
import userRoutes from './routes/userRoutes.js'
import carRoutes from './routes/carRoutes.js'
import dotenv from 'dotenv'
import { connectDB } from './db.js'
import cors from 'cors'

dotenv.config({
    path : './.env'
})

// server creating
const app = express()
app.use(express.json())


// cors setting

const allowedOrigins = process.env.ALLOWED_ORIGIN

app.use(cors({
    origin : function (origin , cb){
        if(allowedOrigins.indexOf(origin) !== -1){
            cb(null , true)
        }
        else{
            cb(new Error('Origin not allowed'))
        }
    }
}))


const PORT = process.env.PORT




// user routes
app.use('/api/user' , userRoutes)

//car routes
app.use('/api/car' , carRoutes)




// server
app.listen(PORT , ()=>{
    console.log(`server running on port ${PORT}`)
    
})

//calling db
connectDB()

