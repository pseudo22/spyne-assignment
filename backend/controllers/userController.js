import { ApiResponse } from "../utils/apiResponse.js"
import User from "../models/userModel.js"
import {asyncHandler} from '../utils/asyncHandler.js'
import {generateAccessToken ,  generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js"


const createUser = asyncHandler(async(req , res) => {

    const {email , username , password} = req.body
    if (!username || !password){
        return res.status(400).json(new ApiResponse(400 , null ,'Username or password not defined'))
    }else{
        const userInstance = await User.findOne({email})
        if (userInstance){
            return res.status(409).json(new ApiResponse(409 , null , 'User is already present' ))
        }
        const newUser = await User.create({
            email , username , password
        })
        res.status(201).json(new ApiResponse(201 , {id : newUser._id , email : newUser.email}, 'User created successfully'))
    }
})


const loginUser = asyncHandler(async(req , res) => {

    // console.log(req.body)    
    const {email , password} = req.body

    if (!email || !password){
        res.status(400).json(new ApiResponse(400 , null ,  'email or password not defined'))
    }else{

        const userInstance = await User.findOne({email})
        if (!userInstance){
            return res.status(404).json(new ApiResponse(404 , null , 'User not found'))
        }

        const comparePassWord = await userInstance.compare(password)

        if(!comparePassWord){
            return res.status(401).json(new ApiResponse(401 , null , 'Incorrect Passoword'))
        }

        const refreshToken = generateRefreshToken(userInstance._id)
        const accessToken = generateAccessToken(userInstance._id)

        userInstance.refreshToken = refreshToken
        await userInstance.save()

        const username = userInstance.username

        res.status(200).json(new ApiResponse(200 , {
            username,refreshToken,accessToken
        },'Login Successful'))
    }
})


const logoutUser = asyncHandler(async(req , res) => {

    const userId = req.userId.userId

    const userInstance = await User.findOne({_id : userId})

    if(!userInstance){
        return res.status(400).json(new ApiResponse(400 , null,'Invalid Refresh Token'))
    }

    userInstance.refreshToken = null
    await userInstance.save()

    res.status(200).json(new ApiResponse(200 , 'Logged out successfully'))
})


export {createUser , loginUser , logoutUser}