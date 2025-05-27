// src/index.tsx (veya main.tsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import Root from "./routes/Home/root";
import './index.css';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { MantineProvider } from '@mantine/core';
import HomePage from './routes/Home/home';
import Contact from './routes/Contact Us/contact';
import Aboutus from './routes/about us/aboutus';
import Accordion from './routes/SSS/accordion';
import ProductList from './routes/Products/productList';
import ProductDetail from './routes/productdetail/productdetail';
import Login from './routes/log in/login';
import Signup from './routes/signup/signup';
import Profile from './routes/Profile/Profile';
import MyAccount from './routes/Address/AddAddress';
import Payment from './routes/Payment/Payment';
import { QueryClient, QueryClientProvider } from 'react-query';
import MyOrdersPage from './routes/Orders/MyOrdersPage';
import ChangePassword from './routes/log in/ChangePassword'

// notistack için gerekli import'lar
import { SnackbarProvider } from 'notistack';

// Create a new QueryClient
const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "/sss",
                element: <Accordion />
            },
            {
                path: "/contact",
                element: <Contact />
            },
            {
                path: "/about",
                element: <Aboutus />
            },
            {
                path: "/products/:slug",
                element: <ProductList />
            },
            {
                path: "/products/all-products",
                element: <ProductList />
            },
            {
                path: "/product/:slug",
                element: <ProductDetail />
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/signup",
                element: <Signup />
            },
            {
                path: "/profile",
                element: <Profile />
            },
            {
                path: "/add-address",
                element: <MyAccount />
            },
            {
                path: "/payment",
                element: <Payment />

            },
            {
                path: "/orders",
                element: <MyOrdersPage />
            },
            {
                path: "/change-password",
                element: <ChangePassword />
            }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <MantineProvider>
            <QueryClientProvider client={queryClient}>
                <SnackbarProvider
                    maxSnack={3}
                    anchorOrigin={{
                        vertical: 'top',    // Dikeyde: Üstte
                        horizontal: 'center', // Yatayda: Ortada
                    }}
                    autoHideDuration={2000}
                >
                    <RouterProvider router={router} />
                </SnackbarProvider>
            </QueryClientProvider>
        </MantineProvider>
    </React.StrictMode>
);