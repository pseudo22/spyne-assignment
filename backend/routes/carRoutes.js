import {Router} from 'express'
import {authenticator} from '../middlewares/authenticate.js'
import {upload } from '../middlewares/multer.js'
import { addCar, deleteCar, globalSearchCar, listCarByUser, updateCar, viewCar } from '../controllers/carController.js'


const carRouter = Router()

carRouter.post('/add' , authenticator , upload, addCar)
carRouter.get('/list' , authenticator , listCarByUser)
carRouter.post('/search' , authenticator , globalSearchCar)
carRouter.get('/view/:carId' , authenticator , viewCar)
carRouter.put('/update/:carId' , authenticator , upload , updateCar)
carRouter.delete('/delete/:carId' , authenticator , deleteCar)


export default carRouter
