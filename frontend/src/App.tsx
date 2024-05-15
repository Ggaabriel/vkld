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

function App() {
  const dispatch = useAppDispatch();
  const { isLogin, user } = useAppSelector((state) => state.user);
  const token = localStorage.getItem('token');
  async function get() {
    await axios
      .get(`${baseUrl}/auth`, {
        headers: {
          token: token,
        },
      })
      .then(async ({ data }) => {
        console.log(31);

        dispatch(setUser(await data));
      });
  }
  console.log(token);

  if (token !== undefined) {
    console.log(123);

    get();
  }

  return (
    <Routes>
      <Route element={<Header />}>
        <Route path="/" element={<Home />} />
        <Route path="/createProduct" element={<CreateProduct />} />
      </Route>
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

export default App;
