import mongoose from "mongoose";


const carSchema = new mongoose.Schema(
    {
        carName : {
            type : String,
            required : true
        },
        description : {
            type : String,
        },
        company : {
            type : String,
            required : true
        },
        carType : {
            type : String,
            enum : ['Petrol' , 'Diesel' , 'Electric'],
            required : true
        },
        dealer : {
            type : String,
            default : null,
        },
        year : {
            type : Number,
            default : null,

        },
        images : {
            type : [String],
            validate : {
                validator : function (val){
                    return val.length <= 10
                },
                message : 'A car can only have up to 10 images'
            },
            default : null,

        },
        tags : {
            type : [String],
            default : function(){
                return [this.carName , this.carType , this.dealer , this.company]
            }
        },
        color : {
            type : String,
            default : null,

        },
        price : {
            type : String,
            required : true
        },
        mileage : {
            type : Number,
            default : null,

        },
        createdAt : {
            type : Date,
            default : Date.now(),
        },
        countOfCar : {
            type : Number,
            default : null,
        }
    },
    {
        timestamps : true
    }
)


const Car = mongoose.model('Car' , carSchema)

export default Car
