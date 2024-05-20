import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { IProduct } from './Products';
import axios from 'axios';
import { baseUrl } from '../app/fetch';

type Props = {};

const CategoryList = (props: Props) => {
  const [products, setProducts] = useState<IProduct[]>([]); // Изменено: установлен пустой массив продуктов
  const [searchParams] = useSearchParams(); // Получение query параметров из URL
  const category = searchParams.get('category'); // Получение значения параметра 'category'
  console.log(category);

  useEffect(() => {
    async function get() {
      try {
        const response = await axios.get(`${baseUrl}/product?category=${category}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    get();
  }, [category]);

  return (
    <div className="pt-20 grid grid-cols-2 gap-20 max-w-[1675px] mx-auto">
      {products.map((product) => (
        <Link to={`/product/${product._id}`}>
          <img
            className="rounded-[40px] w-96 h-36 object-cover "
            src={`http://localhost:3000/${product.images[0]}`}
            alt=""
          />
          <h3 className="text-[#C6AC8F] text-6xl">{product.title}</h3>
          <p className=" text-[#EAE0D5] text-xl">{product.description.split(' ').slice(0, 40).join(' ')}...</p>
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
