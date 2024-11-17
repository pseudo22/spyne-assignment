import Car from '../models/carModel.js'
import User from '../models/userModel.js'
import { ApiResponse } from '../utils/apiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadOnCloudinary , deleteFromCloudinary} from '../utils/cloudinary.js'


const addCar = asyncHandler(async (req, res) => {
    const { carName, description, company, carType, dealer, color, mileage, year, price } = req.body;
    const imagesGet = req.files
    
    const requiredField = ['carName', 'company', 'carType', 'price'];
    const missingField = requiredField.filter(f => !req.body[f]);

    if (imagesGet.length > 10) {
        return res.status(401).json(new ApiResponse(401, null, 'Cannot add more than 10 images'));
    }

    if (missingField.length > 0) {
        return res.status(400).json(new ApiResponse(400, null, `Not provided ${missingField.join(', ')}`));
    }

    const userId = req.userId.userId;

    const carInstance = await Car.findOne({ carName, company, dealer });
    if (carInstance?.images.length > imagesGet){
        return res.status(400).json(new ApiResponse(400, null, 'Car cannot have more than 10 images'));
    }
    const userInstance = await User.findById(userId);

    if (carInstance) {
        carInstance.countOfCar += 1;
        await carInstance.save();

        if (!userInstance.cars.includes(carInstance._id)) {
            userInstance.cars.push(carInstance._id);
            await userInstance.save();
        }

        return res.status(200).json(new ApiResponse(200, carInstance, 'Car count updated successfully'));
    } else {
        const uploadedImages = [];
        
        for (let i = 0; i < imagesGet.length; i++) {
            const uploadedImage = await uploadOnCloudinary(imagesGet[i].path);
            if (uploadedImage) {
                uploadedImages.push(uploadedImage);
            }
        }

        const newCar = await Car.create({
            carName,
            dealer,
            description,
            company,
            carType,
            images: uploadedImages, 
            color,
            mileage,
            year,
            price,
            countOfCar: 1,
        });

        await newCar.save();

        userInstance.cars.push(newCar._id);  
        await userInstance.save();

        return res.status(201).json(new ApiResponse(201, newCar, 'Car added successfully'));
    }
});



const listCarByUser = asyncHandler(async (req , res)=>{

    const userId = req.userId.userId    

    if(!userId){
        return res.status(404).json(new ApiResponse(404 , null , 'UserID not found'))
    }

    const userInstance = await User.findOne({_id : userId})

    if(!userInstance){
        return res.status(404).json(new ApiResponse(404 , null , 'User not found'))
    }

    const carSet = await Car.find({
        '_id' : {$in : userInstance.cars}
    }).lean()

    res.status(200).json(new ApiResponse(200 , carSet , 'Car fetched successfully'))

})



const globalSearchCar = asyncHandler(async (req, res) => {
    const { searchKeyword, selectedTag } = req.body;

    const regexSearch = searchKeyword ? new RegExp(searchKeyword, 'i') : undefined;
    let filter = {};

    if (searchKeyword) {
        filter = {
            $or: [
                { carName: { $regex: regexSearch, $options: 'i' } },
                { description: { $regex: regexSearch, $options: 'i' } },
                { tags: { $regex: regexSearch, $options: 'i' } },
            ]
        };
    }

    if (selectedTag) {
        filter.tags = { $in: [selectedTag] };
    }

    try {
        const users = await User.find({}).populate('cars', 'carName description price tags images');

        if (users.length === 0) {
            return res.status(200).json(new ApiResponse(200, [], 'No cars found matching the search criteria'));
        }

        let allCars = [];
        users.forEach(user => {
            allCars = [...allCars, ...user.cars];
        });

        allCars = allCars.filter(car => {
            const matchesSearch = searchKeyword
                ? car.carName.match(regexSearch) || car.description.match(regexSearch) || car.tags.some(tag => tag.match(regexSearch))
                : true;

            const matchesTag = selectedTag ? car.tags.includes(selectedTag) : true;

            return matchesSearch && matchesTag;
        });

        if (allCars.length === 0) {
            return res.status(200).json(new ApiResponse(200, [], 'No cars found matching the search criteria'));
        }

        const carsWithUser = allCars.map(car => {
            const owner = users.find(user => user.cars.some(carRef => carRef._id.equals(car._id)));
            return {
                ...car.toObject(),
                user: {
                    username: owner.username,
                    email: owner.email,
                },
                images: car.images,
            };
        });

        res.status(200).json(new ApiResponse(200, carsWithUser, 'Cars fetched successfully'));
    } catch (error) {
        res.status(500).json(new ApiResponse(500, null, 'Error while fetching cars'));
    }
});






const viewCar = asyncHandler(async (req , res)=>{
    
    const {carId} = req.params
    if(!carId){
        return res.status(400).json(new ApiResponse(400 , null , 'Invalid Id'))
    }

    const carInstance = await Car.findOne({_id : carId})

    if(!carInstance){
        return res.status(404).json(new ApiResponse(404 , null , 'Car not found'))
    }

    res.status(200).json(new ApiResponse(200 , carInstance , 'Car fetched successfully'))

})


const updateCar = asyncHandler(async (req, res) => {
    const { carId } = req.params;
    const { carName, description, company, carType, dealer, color, mileage, deleteUrls , year, price, } = req.body;
    const images = req.files;
    console.log(deleteUrls);
    

    if (!carId) {
        return res.status(400).json(new ApiResponse(400, null, 'CarID is required'));
    }

    if (!carName && !description && !company && !carType && !dealer && !color && !mileage && !year && !price && !images) {
        return res.status(400).json(new ApiResponse(400, null, 'No fields to update'));
    }

    const carInstance = await Car.findById(carId);
    if (!carInstance) {
        return res.status(404).json(new ApiResponse(404, null, 'Car Not Found'));
    }

    let uploadedImages = [...carInstance.images]; 

    
    if (images && images.length > 0) {
        if (uploadedImages.length + images.length > 10) {
            return res.status(400).json(new ApiResponse(400, null, 'Cannot have more than 10 images'));
        }
        for (let i = 0; i < images.length; i++) {
            const uploadedImage = await uploadOnCloudinary(images[i].path);
            if (uploadedImage) {
                uploadedImages.push(uploadedImage);
            }
        }
    }

    
    if (deleteUrls && deleteUrls.length > 0) {
        for (let imageUrl of deleteUrls) {
            await deleteFromCloudinary(imageUrl);
            uploadedImages = uploadedImages.filter(image => image !== imageUrl);  
        }
    }

    
    carInstance.carName = carName || carInstance?.carName;
    carInstance.description = description || carInstance?.description;
    carInstance.company = company || carInstance?.company;
    carInstance.carType = carType || carInstance?.carType;
    carInstance.dealer = dealer || carInstance?.dealer;
    carInstance.color = color || carInstance?.color;
    carInstance.mileage = mileage || carInstance?.mileage ? carInstance?.mileage : 0 ;
    carInstance.year = year || carInstance?.year ? carInstance?.year : 0;
    carInstance.price = price || carInstance?.price;
    carInstance.images = uploadedImages; 

    await carInstance.save();

    return res.status(200).json(new ApiResponse(200, carInstance, 'Car updated successfully'));
});



const deleteCar = asyncHandler(async (req, res)=>{

    const {carId} = req.params

    if(!carId){
        return res.status(400).json(new ApiResponse(400, null, 'CarId is required'))
    }

    const carInstance = await Car.findById(carId)

    if (!carInstance) {
        return res.status(404).json(new ApiResponse(404, null, 'Car not found'))
    }

    const userInstance = await User.findById(req.userId.userId )

    if (!userInstance) {
        return res.status(404).json(new ApiResponse(404, null, 'User not found'))
    }

    userInstance.cars = userInstance.cars.filter(car => car.toString() !== carId)
    await userInstance.save()

    await carInstance.save()

    res.status(200).json(new ApiResponse(200, null, 'Car deleted successfully'))

})


export {addCar , listCarByUser , globalSearchCar , viewCar , updateCar , deleteCar}
