import axios from 'axios';
import { useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { baseUrl } from '../app/fetch';
import { useAppDispatch } from '../app/hooks/useAppDispatch';
import { setUser } from '../app/store/slice/UserSlice';
import { useAppSelector } from '../app/hooks/useAppSelector';

type Props = {};

const Header = (props: Props) => {
  const { isLogin, user } = useAppSelector((state) => state.user);
  return (
    <>
      <header className="fixed w-full z-10 text-white bg-[#22333B]">
        <div className="max-w-[1675px] mx-auto h-[76px] grid grid-cols-12 gap-[20px] items-center ">
          <h1 className="col-start-1 col-end-3">ЛОГО</h1>
          <ul className="flex gap-6 col-start-3 col-end-11">
            <li>Памятники архитектуры</li>
            <li>Рестораны</li>
            <li>Отели</li>
          </ul>
          <div className="flex gap-5 col-start-11 col-end-13 justify-end">
            {isLogin && user !== null ? (
              <>
                <Link to="/createProduct">
                  <button className="py-2 px-5">+</button>
                </Link>
                <Link to={`/user/${user._id}`}>
                  <button className="py-2 px-5">{user.name}</button>
                </Link>
              </>
            ) : (
              <Link to="/login">
                <button className="py-2 px-5">LOG IN</button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <Outlet />
    </>
  );
};

export default Header;
