import React, { useEffect, useState } from 'react';
import { baseUrl } from '../app/fetch';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IProduct } from './Products';
import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps';
import { useAppSelector } from '../app/hooks/useAppSelector';
import { Button, TextField, IconButton, Box, Typography, Rating, styled } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { IUser } from '../app/store/slice/UserSlice';

const theme = createTheme({
  palette: {
    primary: {
      main: '#EAE0D5', // Цвет для кнопки и поля ввода отзывов
    },
  },
});

const CustomTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#EAE0D5',
    },
    '&:hover fieldset': {
      borderColor: '#EAE0D5',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ffffff',
    },
  },
  '& .MuiInputBase-input': {
    color: '#EAE0D5',
  },
  '& .MuiInputLabel-root': {
    color: '#EAE0D5',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiInputBase-input': {
    color: '#ffffff',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#ffffff',
  },
});

const CustomRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#C6AC8F', // Цвет для заполненных звезд
  },
  '& .MuiRating-iconHover': {
    color: '#C6AC8F', // Цвет при наведении
  },
});

const LightDeleteIcon = styled(DeleteIcon)({
  color: '#EAE0D5', // Светлый цвет для иконки мусорки
});

const Product: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ review: '', rating: 0, images: [] });
  const { id } = useParams();
  const [author, setAuthor] = useState<IUser | null>(null);
  const navigate = useNavigate();

  async function getProductData() {
    try {
      const { data } = await axios.get(`${baseUrl}/product/${id}`);
      setProduct(data);
      const { data: authorData } = await axios.get(`${baseUrl}/auth/${data.userId}`);
      setAuthor(authorData);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  }

  async function getReviews() {
    try {
      const { data } = await axios.get(`${baseUrl}/review/byProduct/${id}`);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }

  useEffect(() => {
    getProductData();
    getReviews();
  }, [id]);

  function handleDeleteProduct(id: string) {
    axios.delete(`${baseUrl}/product/${id}`).then(() => {
      navigate('/');
    });
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setNewReview({ ...newReview, images: [...newReview.images, ...files] });
  };

  const handleSubmitReview = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('review', newReview.review);
      formData.append('rating', newReview.rating.toString());
      formData.append('userId', user?._id || '');
      formData.append('productId', id!);
      for (let i = 0; i < newReview.images.length; i++) {
        formData.append('images', newReview.images[i]);
      }
      await axios.post(`${baseUrl}/review/create`, formData);
      setNewReview({ review: '', rating: 0, images: [] });
      getReviews(); // Refresh reviews after adding a new one
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await axios.delete(`${baseUrl}/review/${reviewId}`);
      getReviews(); // Refresh reviews after deletion
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  if (!product || !author) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="pt-[76px]">
        {product.images[0] !== undefined && (
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
        )}

        <div className="p-8 grid grid-cols-2 text-white">
          <div>
            <span>Создано: {product.createdAt.split('T')[0]}</span>
            <Link className="flex items-center gap-2" to={`/user/${author._id}`}>
              <img
                className="w-10 aspect-square rounded-full"
                src={`${
                  author.image === ''
                    ? 'https://carekeepr.com/assets/global/images/applicants_pic.png'
                    : 'http://localhost:3000/' + author.image
                }`}
                alt=""
              />
              <p>{author.name}</p>
            </Link>
            <h1 className="font-bold mb-4 text-[#C6AC8F] text-6xl">{product.title}</h1>
            <p className="mb-4 text-[#EAE0D5] text-xl">{product.description}</p>
          </div>

          <div>
            {product.advantagesHeaders.map((advantageHeader, index) => (
              <div key={index} className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">{advantageHeader.header}</h2>
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
          <Map defaultState={{ center: product.address, zoom: 12 }} width="100%" height="300px">
            <Placemark geometry={product.address} />
          </Map>
        </YMaps>

        {user?._id === author._id && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop:30 }}>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => navigate(`/product/edit/${product._id}`)}
            >
              Редактировать
            </Button>
            <Button variant="contained" color="error" size="small" onClick={() => handleDeleteProduct(product._id)}>
              Удалить
            </Button>
          </div>
        )}

        <div className="mt-8 w-1/2 mx-auto">
          <Typography className="text-[#EAE0D5]" variant="h6">
            Отзывы
          </Typography>
          {reviews.map((review) => (
            <Box key={review._id} className="border p-4 mb-4">
              <Typography className='text-white' variant="body1">{review.review}</Typography>
              <CustomRating value={review.rating} readOnly />
              <Box className="flex gap-2 mt-2">
                {review.images &&
                  review.images.map((image, index) => (
                    <img
                      key={index}
                      src={`http://localhost:3000/${image}`}
                      alt={`Review image ${index + 1}`}
                      className="w-32 h-32 object-cover"
                    />
                  ))}
              </Box>
              {user?._id === review.userId && (
                <IconButton onClick={() => handleDeleteReview(review._id)}>
                  <LightDeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
          {localStorage.getItem('token') !== null && (
            <form onSubmit={handleSubmitReview} className="mt-4 items-center flex flex-col gap-5">
              <CustomTextField
                fullWidth
                variant="outlined"
                label="Добавить отзыв"
                value={newReview.review}
                onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
                multiline
                rows={4}
                required
              />
              <CustomRating
                value={newReview.rating}
                onChange={(event, newValue) => setNewReview({ ...newReview, rating: newValue || 0 })}
                className="mt-2"
                required
              />
              <Button type="submit" variant="contained" color="primary" className="mt-2">
                Отправить
              </Button>
            </form>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Product;
