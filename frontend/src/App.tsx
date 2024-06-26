import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Header from './widgets/Header';
import 'swiper/css';
import 'swiper/css/pagination';
import Auth from './pages/Auth';
import CreateProduct from './pages/CreateProduct';
import { useAppDispatch } from './app/hooks/useAppDispatch';
import { useEffect } from 'react';
import axios from 'axios';
import { baseUrl } from './app/fetch';
import { setUser } from './app/store/slice/UserSlice';
import { useAppSelector } from './app/hooks/useAppSelector';
import Register from './pages/Register';
import Product from './pages/Product';
import CategoryList from './pages/CategoryList';
import User from './pages/User';
import EditProduct from './pages/EditProduct';

function App() {
  // const { isLogin, user } = useAppSelector((state) => state.user);

  return (
    <Routes>
      <Route element={<Header />}>
        <Route path="/" element={<Home />} />
        <Route path="/createProduct" element={<CreateProduct />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/product/edit/:id" element={<EditProduct />} />
        <Route path="/product" element={<CategoryList />} />
        <Route path="/user/:id" element={<User />} />
      </Route>
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
