import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, MenuItem, TextField, createTheme, ThemeProvider } from '@mui/material';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import axios from 'axios';
import { useAppSelector } from '../app/hooks/useAppSelector';
import { baseUrl } from '../app/fetch';
import { useAppDispatch } from '../app/hooks/useAppDispatch';
import { setUser } from '../app/store/slice/UserSlice';
import { useNavigate } from 'react-router-dom';

interface IFormData {
  title: string;
  description: string;
  calculatedRating: any;
  categories: any;
  userId: string;
  images: File[];
  address: [number, number];
  advantagesHeaders: { header: string; advantages: { header: string; svgType: number }[] }[];
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#22333B', // Цвет для кнопок "Добавить"
    },
    secondary: {
      main: '#c51d1d', // Цвет для кнопок "Удалить"
    },
  },
});

const CreateProduct = () => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<IFormData>({
    title: '',
    description: '',
    calculatedRating: 0,
    categories: [],
    userId: '',
    images: [],
    address: [0, 0],
    advantagesHeaders: [{ header: '', advantages: [] }],
  });

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
          dispatch(setUser(await data));
          setFormData({ ...formData, userId: data._id });
        });
    }

    if (token !== undefined) {
      get();
    }
  }, []);

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const defaultState = {
    center: [54.70456582768237, 20.514148358398423],
    zoom: 12,
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('calculatedRating', formData.calculatedRating);
      formDataToSend.append('advantagesHeaders', JSON.stringify(formData.advantagesHeaders));
      formDataToSend.append('userId', user!._id);
      formDataToSend.append('categories', formData.categories);
      formDataToSend.append('address', formData.address.join(','));

      for (let i = 0; i < formData.images.length; i++) {
        formDataToSend.append('image', formData.images[i]);
      }

      const response = await axios.post(`${baseUrl}/product`, formDataToSend).then(() => {
        navigate('/');
      });
     
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleMapClick = (e: any) => {
    const coords = e.get('coords');
    setFormData({
      ...formData,
      address: [+coords[0], +coords[1]],
    });
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>, index: number | null = null) => {
    const files = Array.from(event.target.files || []);
    if (index !== null && selectedImageIndex !== null) {
      const updatedImages = [...formData.images];
      updatedImages[selectedImageIndex] = files[0]; // Replace the selected image
      setFormData({ ...formData, images: updatedImages });
      setSelectedImageIndex(null); // Reset selected image index
    } else {
      setFormData({ ...formData, images: [...formData.images, ...files] });
    }
  };

  const handleAddAdvantage = () => {
    setFormData({
      ...formData,
      advantagesHeaders: [...formData.advantagesHeaders, { header: '', advantages: [] }],
    });
  };

  const handleAdvantageChange = (index: number, field: string, value: any) => {
    const updatedAdvantages = [...formData.advantagesHeaders];
    updatedAdvantages[index][field] = value;
    setFormData({
      ...formData,
      advantagesHeaders: updatedAdvantages,
    });
  };

  const handleAddSubAdvantage = (index: number) => {
    const updatedAdvantages = [...formData.advantagesHeaders];
    updatedAdvantages[index].advantages.push({ header: '', svgType: 0 });
    setFormData({
      ...formData,
      advantagesHeaders: updatedAdvantages,
    });
  };

  const handleDeleteAdvantageHeader = (index: number) => {
    const updatedAdvantages = [...formData.advantagesHeaders];
    updatedAdvantages.splice(index, 1);
    setFormData({
      ...formData,
      advantagesHeaders: updatedAdvantages,
    });
  };

  const handleDeleteSubAdvantage = (headerIndex: number, advantageIndex: number) => {
    const updatedAdvantages = [...formData.advantagesHeaders];
    updatedAdvantages[headerIndex].advantages.splice(advantageIndex, 1);
    setFormData({
      ...formData,
      advantagesHeaders: updatedAdvantages,
    });
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleDeleteImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });
  };

  return (
    <ThemeProvider theme={theme}>
      <form onSubmit={handleSubmit} className="pt-20 bg-white">
        <Typography variant="h6">Информация об объекте</Typography>
        <Box className="flex flex-col gap-5">
          <TextField
            required
            fullWidth
            id="title"
            label="Заголовок"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            required
            fullWidth
            id="description"
            label="Описание"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            required
            fullWidth
            id="categories"
            label="Категории"
            select
            SelectProps={{ multiple: true }}
            value={formData.categories}
            onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
          >
            <MenuItem value="Искусство и история">Искусство и история</MenuItem>
            <MenuItem value="Города и улицы">Города и улицы</MenuItem>
            <MenuItem value="Зоны отдыха">Зоны отдыха</MenuItem>
            <MenuItem value="Памятники архитектуры">Памятники архитектуры</MenuItem>
            <MenuItem value="Рестораны">Рестораны</MenuItem>
            <MenuItem value="Отели">Отели</MenuItem>
          </TextField>
        </Box>

        <Typography variant="h6">Точка на карте</Typography>
        <Box>
          <YMaps>
            <Map defaultState={defaultState} width="100%" height="300px" onClick={handleMapClick}>
              <Placemark geometry={formData.address} />
            </Map>
          </YMaps>
        </Box>

        {formData.advantagesHeaders.map((advantage, index) => (
          <Box key={index} className="flex flex-col gap-5">
            <TextField
              fullWidth
              label={`Заголовок преимуществ ${index + 1}`}
              value={advantage.header}
              onChange={(e) => handleAdvantageChange(index, 'header', e.target.value)}
            />
            {advantage.advantages.map((subAdvantage, subIndex) => (
              <Box key={subIndex} className="flex flex-col gap-5">
                <TextField
                  fullWidth
                  label={`Преимущество ${subIndex + 1}`}
                  value={subAdvantage.header}
                  onChange={(e) =>
                    handleAdvantageChange(index, 'advantages', [
                      ...advantage.advantages.slice(0, subIndex),
                      { ...subAdvantage, header: e.target.value },
                      ...advantage.advantages.slice(subIndex + 1),
                    ])
                  }
                />
                <TextField
                  fullWidth
                  select
                  label="Картинка"
                  value={subAdvantage.svgType}
                  onChange={(e) =>
                    handleAdvantageChange(index, 'advantages', [
                      ...advantage.advantages.slice(0, subIndex),
                      { ...subAdvantage, svgType: e.target.value },
                      ...advantage.advantages.slice(subIndex + 1),
                    ])
                  }
                >
                  <MenuItem value={0}>
                    <img src="src/app/assets/icons/0.png" alt="SVG 0" />
                  </MenuItem>
                  <MenuItem value={1}>
                    <img src="src/app/assets/icons/1.png" alt="SVG 1" />
                  </MenuItem>
                  <MenuItem value={2}>
                    <img src="src/app/assets/icons/2.png" alt="SVG 2" />
                  </MenuItem>
                  <MenuItem value={3}>
                    <img src="src/app/assets/icons/3.png" alt="SVG 3" />
                  </MenuItem>
                  <MenuItem value={4}>
                    <img src="src/app/assets/icons/4.png" alt="SVG 4" />
                  </MenuItem>
                </TextField>
                <Button variant="contained" color="secondary" onClick={() => handleDeleteSubAdvantage(index, subIndex)}>
                  Удалить преимущество {subIndex + 1}
                </Button>
              </Box>
            ))}
            <Button variant="contained" color="primary" onClick={() => handleAddSubAdvantage(index)}>
              Добавить преимущество
            </Button>
            <Button variant="contained" color="secondary" onClick={() => handleDeleteAdvantageHeader(index)}>
              Удалить заголовок преимуществ {index + 1}
            </Button>
          </Box>
        ))}
        <Button variant="contained" color="primary" onClick={handleAddAdvantage}>
          Добавить заголовок преимуществ
        </Button>

        <Typography variant="h6">Изображения</Typography>
        <input
          type="file"
          accept="image/*"
          multiple={selectedImageIndex === null}
          onChange={(e) => handleFileInputChange(e, selectedImageIndex)}
        />
        <Box className="flex flex-wrap gap-5 mt-5">
          {formData.images.map((image, index) => (
            <Box
              key={index}
              className={`border ${
                selectedImageIndex === index ? 'border-blue-500' : 'border-gray-300'
              } p-2 cursor-pointer`}
              onClick={() => handleImageClick(index)}
            >
              <img src={URL.createObjectURL(image)} alt={`Image ${index + 1}`} className="w-32 h-32 object-cover" />
              {selectedImageIndex === index && (
                <>
                  <Button variant="contained" color="secondary" onClick={() => handleDeleteImage(index)}>
                    Удалить изображение
                  </Button>
                  <Button variant="contained" color="primary" component="label">
                    Заменить изображение
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileInputChange(e, index)}
                    />
                  </Button>
                </>
              )}
            </Box>
          ))}
        </Box>

        <Button type="submit" variant="contained" color="primary" className="mt-5">
          Создать продукт
        </Button>
      </form>
    </ThemeProvider>
  );
};

export default CreateProduct;
