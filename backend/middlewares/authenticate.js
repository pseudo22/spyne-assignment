import { ApiResponse } from "../utils/apiResponse.js";
import { verifyAccessToken } from "../utils/jwt.js";


const authenticator = (req , res , next) => {
    
    const token = req.headers.authorization?.split(' ')[1]
    

    if(!token){
        return res.status(401).json(new ApiResponse(401 , null , 'Access token is missing'))
    }

    try {
        const decoded = verifyAccessToken(token)
        req.userId = decoded
        next()
        
    } catch (error) {
        return res.status(401).json(new ApiResponse(401 , null , 'Invalid or expired token'))
    }

}

export {authenticator}


