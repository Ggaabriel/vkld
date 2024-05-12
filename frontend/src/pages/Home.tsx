import React from 'react';
import { SwiperSlide, Swiper } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import kld from 'src/app/assets/kld.jpg';
import search from 'src/app/assets/search.svg';
import neiro from 'src/app/assets/neiro.jpg';
type Props = {};

const Home = (props: Props) => {
  return (
    <div className="  ">
      <Swiper pagination={true} loop={true} modules={[Pagination]} className="mySwiper h-[100vh] w-full">
        <SwiperSlide>
          <img src={kld} alt="" />
          <div className="grid absolute grid-rows-1 text-white gap-20">
            <div className="flex flex-col gap-[58px]">
              <h1 className="text-8xl font-bold">
                Калининградская <br />
                область
              </h1>
              <button className="h-10 w-64 flex items-center gap-4 p-5">
                <img className="w-6 flex-grow-0" src={search} alt="" /> Что посетить...
              </button>
            </div>
            <div>
              <h2 className="text-4xl text-white/75 mb-6">ОСТРОВ КАНТА</h2>
              <button className="py-4 px-20 flex-grow-0">Обзор</button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <img src={kld} alt="" />
          <div className="grid absolute grid-rows-1 text-white gap-20">
            <div className="flex flex-col gap-[58px]">
              <h1 className="text-8xl font-bold">
                Калининградская <br />
                область
              </h1>
              <button className="h-10 w-64 flex items-center gap-4 p-5">
                <img className="w-6 flex-grow-0" src={search} alt="" /> Что посетить...
              </button>
            </div>
            <div>
              <h2 className="text-4xl text-white/75 mb-6">ОСТРОВ КАНТА</h2>
              <button className="py-4 px-20 flex-grow-0">Обзор</button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <img src={kld} alt="" />
          <div className="grid absolute grid-rows-1 text-white gap-20">
            <div className="flex flex-col gap-[58px]">
              <h1 className="text-8xl font-bold">
                Калининградская <br />
                область
              </h1>
              <button className="h-10 w-64 flex items-center gap-4 p-5">
                <img className="w-6 flex-grow-0" src={search} alt="" /> Что посетить...
              </button>
            </div>
            <div>
              <h2 className="text-4xl text-white/75 mb-6">ОСТРОВ КАНТА</h2>
              <button className="py-4 px-20 flex-grow-0">Обзор</button>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <img src={kld} alt="" />
          <div className="grid absolute grid-rows-1 text-white gap-20">
            <div className="flex flex-col gap-[58px]">
              <h1 className="text-8xl font-bold">
                Калининградская <br />
                область
              </h1>
              <button className="h-10 w-64 flex items-center gap-4 p-5">
                <img className="w-6 flex-grow-0" src={search} alt="" /> Что посетить...
              </button>
            </div>
            <div>
              <h2 className="text-4xl text-white/75 mb-6">ОСТРОВ КАНТА</h2>
              <button className="py-4 px-20 flex-grow-0">Обзор</button>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="max-w-[1675px] grid grid-cols-2 items-center ">
          <img src={neiro} alt="" />
          <div className='flex flex-col justify-evenly h-full'>
            <h2 className='text-6xl font-bold'>
              Калининградская <br />
              область
            </h2>
            <p>
              С ее величественными архитектурными <br />
              достопримечательностями, разнообразным культурным <br />
              наследием и оживленной атмосферой, Калининградская <br />
              область - это источник непревзойденных впечатлений. <br />
              Регион прославлен своим уникальным сочетанием <br />
              современности и исторических мест, где каждое здание <br />
              переплетено событиями прошлого. <br />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
