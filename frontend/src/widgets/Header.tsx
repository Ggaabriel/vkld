import axios from 'axios';
import { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { baseUrl } from '../app/fetch';
import { useAppDispatch } from '../app/hooks/useAppDispatch';
import { setUser } from '../app/store/slice/UserSlice';
import { useAppSelector } from '../app/hooks/useAppSelector';

type Props = {};

const Header = (props: Props) => {
  const dispatch = useAppDispatch();
  const { isLogin, user } = useAppSelector((state) => state.user);
  useEffect(() => {
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
  }, []);

  return (
    <>
      <header className="fixed w-full z-20 text-white bg-[#22333B]">
        <div className="max-w-[1675px] mx-auto h-[76px] grid grid-cols-12 gap-[20px] items-center ">
          <Link to="/">
            <h1 className="col-start-1 col-end-3">ЛОГО</h1>
          </Link>
          <ul className="flex gap-6 col-start-3 col-end-11">
            <li>
              <Link to={`/product?category=Памятники архитектуры`}> Памятники архитектуры</Link>
            </li>
            <li>
              <Link to={`/product?category=Рестораны`}>Рестораны</Link>
            </li>
            <li>
              <Link to={`/product?category=Отели`}>Отели</Link>
            </li>
            <li>
              <Link to={`/product?category=Искусство и история`}>Искусство и история</Link>
            </li>
            <li>
              <Link to={`/product?category=Города и улицы`}>Города и улицы</Link>
            </li>
            <li>
              <Link to={`/product?category=Зоны отдыха  `}> Зоны отдыха</Link>
            </li>
          </ul>
          <div className="flex gap-5 col-start-11 col-end-13 justify-end">
            {isLogin && user !== null ? (
              <>
                <Link to="/createProduct">
                  <button className="py-2 px-5">+</button>
                </Link>
                <Link to={`/user/${user._id}`}>
                  <img
                    className="w-10 h-full rounded-full object-cover"
                    src={`http://localhost:3000/${user.image}`}
                    alt=""
                  />
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="py-2 px-5">Войти</button>
                </Link>
                <Link to="/register">
                  <button className="py-2 px-5">Регистрация</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <Outlet />
    </>
  );
};

export default Header;
