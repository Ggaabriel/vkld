import { SwiperSlide, Swiper } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import kld from 'src/app/assets/kld.jpg';
import neiro from 'src/app/assets/neiro.jpg';
import 'src/app/styles/home.css';
import Products, { IProduct } from './Products';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../app/fetch';
import { Link, useNavigate } from 'react-router-dom';
import { Autocomplete, TextField } from '@mui/material';

type Props = {};

const Home = (props: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IProduct[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [open, setOpen] = useState(false);
  // const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/product`);
      if (response.data.length > 0) {
        setProducts(response.data);
      } else {
        throw new Error('No products found');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim() !== '') {
        axios
          .get(`${baseUrl}/product/search?title=${searchQuery}`)
          .then((response) => {
            setSearchResults(response.data);
            setOpen(true);
          })
          .catch((error) => {
            console.error('Error fetching search results', error);
          });
      } else {
        setOpen(false);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleOptionClick = (productId: string) => {
    setOpen(false);
    navigate(`/product/${productId}`);
  };

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div>
      {products.length < 0 && (
        <div className="input-wrapper mx-auto z-10 relative top-44">
          <Autocomplete
            className="w-full"
            freeSolo
            options={searchResults.map((result) => result.title)}
            inputValue={searchQuery}
            onInputChange={(event, newInputValue) => {
              setSearchQuery(newInputValue);
            }}
            open={open}
            onClose={() => setOpen(false)}
            renderInput={(params) => (
              <TextField
                className="outline-none"
                {...params}
                label="Поиск объектов"
                variant="outlined"
                fullWidth
                onChange={handleInputChange}
                sx={{
                  '& .MuiInputBase-root': {
                    color: 'white',
                    backgroundColor: 'transparent',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'white',
                    },
                    '&:hover fieldset': {
                      borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'white',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'white',
                  },
                }}
              />
            )}
            renderOption={(props, option) => {
              const product = searchResults.find((p) => p.title === option);
              return (
                <li {...props} onClick={() => handleOptionClick(product!._id)}>
                  {product ? product.title : option}
                </li>
              );
            }}
          />
        </div>
      )}

      <Swiper pagination={true} loop={true} modules={[Pagination]} className="mySwiper h-[90vh] w-full text-white ">
        {products.length > 0 ? (
          products.map((product) => (
            <SwiperSlide key={product._id}>
              <img src={'http://localhost:3000/' + product.images[0]} alt={product.title} />
              <div className="grid absolute grid-rows-1 gap-20">
                <div className="flex flex-col gap-[58px] items-center">
                  <h1 className="text-8xl font-bold">
                    Калининградская <br />
                    область
                  </h1>
                </div>
                <div>
                  <h2 className="text-4xl text-white/75 mb-6">{product.title}</h2>
                  <Link to={`/product/${product._id}`}>
                    <button className="py-4 px-20 flex-grow-0">Обзор</button>
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))
        ) : (
          <SwiperSlide>
            <div className="backdrop">
              <div className="shape one"></div>
              <div className="shape two"></div>
              <div className="shape three"></div>
              <div className="shape four"></div>
              <div className="shape five"></div>
              <div className="shape six"></div>
              <div className="shape seven"></div>
            </div>
            <div className="main">
              <h1>Пусто!</h1>
              {/* <button className="py-2 px-5" onClick={fetchProducts}>
                Повторный запрос
              </button> */}
            </div>
          </SwiperSlide>
        )}
      </Swiper>
      <div className="h-screen bg-white flex items-center justify-center">
        <div className="max-w-[1675px] grid grid-cols-2 items-center ">
          <img src={neiro} alt="" />
          <div className="flex flex-col justify-evenly h-full">
            <h2 className="text-6xl font-bold">
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
      <Products />
    </div>
  );
};

export default Home;
