import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { baseUrl } from '../app/fetch';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';
import { Link } from 'react-router-dom';
type Props = {};

export interface IProduct {
  _id: string;
  images: string[];
  title: string;
  address: [number, number];
  description: string;
  calculatedRating: number;
  advantagesHeaders: {
    header: string;
    advantages: {
      header: string;
      svgType: number;
    }[];
  }[];
  categories: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Products = (props: Props) => {
  const [products, setProducts] = useState<IProduct[]>([]); // Изменено: установлен пустой массив продуктов
  const [sortedProducts, setSortedProducts] = useState<{ category: string; products: IProduct[] }[]>([]); // Изменено: установлен пустой массив отсортированных продуктов
  const [mapCenter, setMapCenter] = useState<[number, number]>([54.70456582768237, 20.514148358398423]); // Координаты центра карты
  const [zoom, setZoom] = useState<number>(10); // Уровень масштабирования карты
  useEffect(() => {
    async function get() {
      try {
        const response = await axios.get(`${baseUrl}/product`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    get();
  }, []);

  useEffect(() => {
    // Функция для сортировки продуктов по категориям
    const sortProductsByCategory = () => {
      const sortedProducts = products.reduce((acc: { [key: string]: IProduct[] }, product: IProduct) => {
        product.categories.forEach((category) => {
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(product);
        });
        return acc;
      }, {});

      const sortedProductsArray = Object.entries(sortedProducts).map(([category, products]) => ({
        category,
        products,
      }));

      setSortedProducts(sortedProductsArray);
    };

    sortProductsByCategory();
  }, [products]);
  console.log(sortedProducts);

  return (
    <div className=" max-w-[1675px] mx-auto my-36 flex flex-col gap-[50px]">
      <h2 className="text-[#C6AC8F] text-6xl">Отличные места</h2>
      {/* Отображение отсортированных продуктов */}
      {sortedProducts.map((category) => (
        <div key={category.category} className="h-full">
          <h3 className="text-[#EAE0D5] text-5xl">{category.category}</h3>
          <Swiper
            slidesPerView={3}
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            navigation={true}
       
            className="mySwiper h-full "
          >
              {category.products.map((product) => (
                <SwiperSlide className="max-w-[480px]  flex flex-col text-[#EAE0D5]" key={product._id}>
                  <Link to={`/product/${product._id}`}>
                    {product.images[0] !== undefined ? (
                      <img className="rounded-[40px]" src={`http://localhost:3000/${product.images[0]}`} alt="" />
                    ) : (
                      <img className="rounded-[40px]" src="https://sklad-vlk.ru/d/cml_419459db_460fe794_2.jpg" alt="" />
                    )}
                    <p className=" text-3xl"> {product.title}</p>
                  </Link>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      ))}
      <YMaps>
        <Map
          defaultState={{ center: mapCenter, zoom }}
          width="1675px"
          height="500px"
          modules={['control.ZoomControl', 'control.FullscreenControl']}
        >
          {/* Отображение меток для каждого продукта */}
          {products.map((product) => (
            <Placemark
              key={product._id}
              geometry={product.address}
              modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
              properties={{
                balloonContentHeader: `<img style="object-fit:cover;" width="100" src='http://localhost:3000/${product.images[0]}' />`,
                balloonContentBody: `<h2>${product.title}</h2>`,
                balloonContentFooter: `
            <div>
       <p>${product.description.split(" ").slice(0,30).join(" ")}</p>
       <button onclick="window.location.href='/product/${product._id}'">Подробнее</button>
     </div>
   `,
              }}
              options={{
                iconLayout: 'default#image',
                iconImageHref: `http://localhost:3000/${product.images[0]}`, // Use the first image as the icon
                iconImageSize: [30, 30],
                iconContentLayout:
                  '<div style="color: #000; font-weight: bold; border-radius:9999px;">$[properties.iconCaption]</div>',
                iconContentOffset: [15, 15],
                balloonPanelMaxMapArea: 0,
                hideIconOnBalloonOpen: false,
                balloonOffset: [0, -45],
              }}
            />
          ))}
        </Map>
      </YMaps>
    </div>
  );
};

export default Products;
