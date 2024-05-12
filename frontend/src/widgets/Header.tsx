import React from 'react';
import { Outlet } from 'react-router-dom';

type Props = {};

const Header = (props: Props) => {
  return (
    <>
      <header className="fixed w-full z-10 text-white">
        <div className="max-w-[1675px] mx-auto h-[116px] grid grid-cols-12 gap-[20px] items-center ">
          <h1 className="col-start-1 col-end-3">ЛОГО</h1>
          <ul className="flex gap-6 col-start-3 col-end-11">
            <li>Памятники архитектуры</li>
            <li>Рестораны</li>
            <li>Отели</li>
          </ul>
          <div className="flex gap-10 col-start-11 col-end-13 justify-end">
            <button className='py-2 px-3'>ENG</button>
            <button className='py-2 px-5'>LOG IN</button>
          </div>
        </div>
      </header>

      <Outlet />
    </>
  );
};

export default Header;
