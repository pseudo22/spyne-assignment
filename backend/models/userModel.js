import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
    {
        username : {
            type : String,
            required : true,
            unique : true
        },
        email : {
            type : String,
            required : true,
            unique : true
        },
        password : {
            type : String,
            required : true

        },
        refreshToken : {
            type : String,
            required : false
        },
        cars : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Car'
        }],
        createdAt : {
            type : Date,
            default : Date.now()
        },
    },
    {
        timestamps : true
    }
)



// password hash
userSchema.pre('save' , async function(next){
    if (this.isModified('password')){
        const salt = await bcrypt.genSalt(5)
        this.password = await bcrypt.hash(this.password , salt)
    }
    next()
})


//compare password
userSchema.methods.compare = async function(password){
    return await bcrypt.compare(password , this.password)
}

const User = mongoose.model('User' , userSchema)

export default User