import axios from 'axios'
import { store } from '../store/store'
import { logout } from '../features/userSlice'

const axiosClient = axios.create({
    baseURL : import.meta.env.VITE_BACKEND_URL,
    headers : {
        'Content-Type' : 'application/json'
    }
})

console.log('client connected successfully')



axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken")

        if (token){
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    }, 
    (err) => {
        return Promise.reject(err)
    }
)


axiosClient.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response && err.response.status === 401){

            store.dispatch(logout())
        }
        return Promise.reject(err)
    }
)


export default axiosClient