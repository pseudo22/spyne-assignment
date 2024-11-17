import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    cars : [],
    selectedCar : null,
    searchResults : []
}

const carSlice = createSlice({
    name : 'car',
    initialState,
    reducers : {
        setCars(state,action){
            state.cars = action.payload
        },
        addCars(state,action){
            state.cars.push(action.payload)
        },
        removeCar(state ,action){
            state.cars = state.cars.filter((car)=>car._id != action.payload)
        },
        updateCar(state , action){
            const ind = state.cars.findIndex((car)=>car._id === action.payload._id)

            if (ind !== -1){
                state.cars[ind] = action.payload
            }
        },
        setSelectedCar(state ,action){
            state.selectedCar = action.payload
        },
        setSearchResults(state ,action){
            state.searchResults = action.payload
        }
    }
})

export const {setCars , addCars , removeCar , updateCar , setSelectedCar , setSearchResults} = carSlice.actions
export default carSlice.reducer