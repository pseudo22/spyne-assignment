import { Router } from 'express'
import { createUser, loginUser, logoutUser } from '../controllers/userController.js'
import { authenticator } from '../middlewares/authenticate.js'

const userRouter = Router()

userRouter.post('/create' , createUser)
userRouter.post('/login' , loginUser)
userRouter.post('/logout' ,authenticator, logoutUser)


export default userRouter
