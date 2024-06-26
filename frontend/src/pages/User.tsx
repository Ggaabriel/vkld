import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import axios from 'axios';
import { baseUrl } from '../app/fetch';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks/useAppDispatch';
import { logout, setUser } from '../app/store/slice/UserSlice';
import { useAppSelector } from '../app/hooks/useAppSelector';

type Props = {};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const User = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();
  const [user, setUser2] = useState();
  const [userProducts, setUserProducts] = useState([]);
  const theme = createTheme({
    palette: {
      primary: {
        main: '#22333B', // Цвет для кнопок "Добавить"
      },
      secondary: {
        main: '#C6AC8F', // Цвет для кнопок "Удалить"
      },
    },
  });
  useEffect(() => {
    async function getUserData() {
      try {
        const response = await axios.get(`${baseUrl}/auth/${params.id}`);
        setUser2(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    async function getUserProducts() {
      try {
        const response = await axios.get(`${baseUrl}/product/${params.id}/all`);
        setUserProducts(response.data);
      } catch (error) {
        console.error('Error fetching user products:', error);
      }
    }

    getUserData();
    getUserProducts();
  }, [params]);
  const { isLogin, user: userLogin } = useAppSelector((state) => state.user);
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.patch(`${baseUrl}/auth/${user._id}`, formData);
      console.log('Image uploaded successfully', response.data);
      // Update the user state to display the new image
      dispatch(setUser(await response.data));
      setUser2(await response.data);
    } catch (error) {
      console.error('Error uploading image', error);
    }
  };

  const handleExit = async () => {
    dispatch(logout());
    localStorage.clear();
    navigate('/');
  };

  const handleDeleteUser = async () => {
    await axios.delete(`${baseUrl}/auth`, {
      headers: {
        token: localStorage.getItem('token'),
      },
    });
    handleExit();
  };

  if (!user) {
    return <div>Загрузка...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="pt-20 max-w-[1675px] mx-auto">
        <div className="flex gap-3 mb-3">
          <img
            className="w-20 aspect-square rounded-full"
            src={`${
              user.image === ''
                ? 'https://carekeepr.com/assets/global/images/applicants_pic.png'
                : 'http://localhost:3000/' + user.image
            }`}
            alt=""
          />
          <h3 className="text-white text-6xl">{user.name}</h3>
          {user?._id === userLogin?._id && (
            <Button
              component="label"
              role={undefined}
              variant="contained"
              color="secondary"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput type="file" name="image" onChange={handleImageUpload} />
            </Button>
          )}
        </div>
        {user?._id === userLogin?._id && (
          <div className='flex gap-5 border-b-2 border-[#C6AC8F] pb-3 mb-3'>
            <Button variant="contained" color="error" size="small" onClick={() => handleDeleteUser()}>
              Удалить аккаунт
            </Button>
            <Button variant="contained" color="error" size="small" onClick={() => handleExit()}>
              Выйти
            </Button>
          </div>
        )}
        <div className="grid grid-cols-3  max-w-[1675px] mx-auto">
          {userProducts.map((product) => (
            <Link to={`/product/${product._id}`} className="max-w-[480px]">
              {product.images[0] !== undefined ? (
                <img className="rounded-[40px]" src={`http://localhost:3000/${product.images[0]}`} alt="" />
              ) : (
                <img className="rounded-[40px]" src="https://sklad-vlk.ru/d/cml_419459db_460fe794_2.jpg" alt="" />
              )}
              <h3 className="text-[#C6AC8F] text-4xl">{product.title}</h3>
              <p className=" text-[#EAE0D5] text-xl">{product.description.split(' ').slice(0, 40).join(' ')}...</p>
            </Link>
          ))}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default User;
