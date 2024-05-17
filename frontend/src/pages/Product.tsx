import React, { useEffect, useState } from 'react';
import { baseUrl } from '../app/fetch';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IProduct } from './Products';
import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';
import { useAppSelector } from '../app/hooks/useAppSelector';
import { Button } from '@mui/material';

type Props = {};

const Product: React.FC<Props> = () => {
  const user = useAppSelector((state) => state.user.user);
  const [product, setProduct] = useState<IProduct | null>(null);
  const { id } = useParams();
  const [avtor, setAvtor] = useState();
  const navigate = useNavigate()
  async function get() {
    try {
      const { data } = await axios.get(`${baseUrl}/product/${id}`);
      setProduct(data);
      const { data: avtor } = await axios.get(`${baseUrl}/auth/${data.userId}`);
      setAvtor(avtor);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  }
  const defaultState = {
    center: [54.70456582768237, 20.514148358398423],
    zoom: 12,
  };
  useEffect(() => {
    get();
  }, [id]);
  function handleDeleteProduct(id) {
    axios.delete(`${baseUrl}/product/${id}`).then(()=>{
      navigate("/")
    })
  }
  if (!product) {
    return <div>Loading...</div>;
  }
  if (!avtor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-[76px]">
      <Swiper
        pagination={{ clickable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        loop={true}
        modules={[Autoplay, Pagination]}
        className="mySwiper h-[50vh] w-full text-white"
      >
        {product.images.map((e, index) => (
          <SwiperSlide key={index}>
            <img src={`http://localhost:3000/${e}`} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="p-8 grid grid-cols-2 text-white">
        <div>
          <span>Создано: {product.createdAt.split('T')[0]}</span>
          <Link className="flex items-center gap-2" to={`/user/${avtor._id}`}>
            <img className="w-10 aspect-square rounded-full" src={`http://localhost:3000/${avtor.image}`} alt="" />
            <p>{avtor.name}</p>
          </Link>
          <h1 className=" font-bold mb-4 text-[#C6AC8F] text-6xl">{product.title}</h1>
          <p className="mb-4 text-[#EAE0D5] text-4xl">{product.description}</p>
        </div>

        <div>
          {product.advantagesHeaders.map((advantageHeader, index) => (
            <div key={index} className="mb-4">
              <h2 className="text-2xl font-semibold mb-2 ">{advantageHeader.header}</h2>
              <ul className="grid grid-cols-2">
                {advantageHeader.advantages.map((advantage, index) => (
                  <li key={index} className="flex items-center mb-1">
                    <img src={`/${advantage.svgType}.png`} alt="" />
                    <span>{advantage.header}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <YMaps>
        <Map defaultState={defaultState} width="100%" height="300px">
          <Placemark geometry={product.address} />
        </Map>
      </YMaps>
      {user?._id === avtor._id && (
        <Button
          variant="contained"
          color="error"
          size="small"
          style={{ marginTop:20, display:"block", margin:"0 auto" }}
          onClick={() => handleDeleteProduct(product._id)}
        >
          Удалить   
        </Button>
      )}
    </div>
  );
};

export default Product;
