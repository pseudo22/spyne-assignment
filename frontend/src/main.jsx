import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {store} from '../store/store.js'
import {Provider} from 'react-redux'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import Signup from '../components/SignUp.jsx'
import Login from '../components/Login.jsx'
import ProductList from '../components/ProductList.jsx'
import ProductAdd from '../components/ProductAdd.jsx'
import ProductDetail from '../components/ProductDetail.jsx'
import GlobalSearch from '../components/GlobalSearch.jsx'
import ProtectedRoute from '../components/Protected.jsx'
import App from './App.jsx'


const router = createBrowserRouter([
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/car-list",
        element: <ProductList />,
      },
      {
        path: "/add-car",
        element: <ProductAdd />,
      },
      {
        path: "/car-detail/:carId",
        element: <ProductDetail />,
      },
      {
        path: "/global-search",
        element: <GlobalSearch />,
      },
    ],
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
