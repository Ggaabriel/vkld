import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, MenuItem, TextField } from '@mui/material';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import axios from 'axios';
import { useAppSelector } from '../app/hooks/useAppSelector';
import { baseUrl } from '../app/fetch';
import { useAppDispatch } from '../app/hooks/useAppDispatch';
import { setUser } from '../app/store/slice/UserSlice';


interface IFormData {
  title: string;
  description: string;
  calculatedRating: any;
  categories: any;
  userId: string;
  images: File[];
  address: [number, number]; // Используем массив чисел для координат
  advantagesHeaders: { header: string; advantages: { header: string; svgType: number }[] }[];
}

const CreateProduct = () => {
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<IFormData>({
    title: '',
    description: '',
    calculatedRating: 0,
    categories: [],
    userId: '',
    images: [],
    address: [0, 0], // Используем массив чисел для координат
    advantagesHeaders: [{ header: '', advantages: [] }], // Изменено: пустой массив преимуществ
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
      formDataToSend.append('categories', formData.categories );
      formDataToSend.append('address', formData.address.join(','));

      for (let i = 0; i < formData.images.length; i++) {
        formDataToSend.append('image', formData.images[i]);
      }

      const response = await axios.post(`${baseUrl}/product`, formDataToSend);
      console.log('Product created:', response.data);
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

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData({ ...formData, images: [...formData.images, ...files] });
  };

  const handleAddAdvantage = () => {
    setFormData({
      ...formData,
      advantagesHeaders: [...formData.advantagesHeaders, { header: '', advantages: [] }], // Изменено: добавлен пустой массив преимуществ
    });
  };

  const handleAdvantageChange = (index: number, field: string, value: any) => {
    const updatedAdvantages = [...formData.advantagesHeaders];
    // @ts-ignore
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

  const handleImageClick = (index: number) => {
    if (selectedImageIndex === index) {
      setSelectedImageIndex(null);
    } else {
      setSelectedImageIndex(index);
    }
  };

  const handleDeleteImage = (index: number) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });
  };

  return (
    <form onSubmit={handleSubmit} className="pt-20 bg-white">
      <Typography variant="h6">Информация об объекте</Typography>
      <Box gap={20}>
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
            <Placemark geometry={formData.address}/>
          </Map>
        </YMaps>
      </Box>

      {formData.advantagesHeaders.map((advantage, index) => (
        <Box key={index}>
          <TextField
            fullWidth
            label={`Заголовок преимуществ ${index + 1}`}
            value={advantage.header}
            onChange={(e) => handleAdvantageChange(index, 'header', e.target.value)}
          />
          {advantage.advantages.map((subAdvantage, subIndex) => (
            <Box key={subIndex}>
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
                {[
                  { value: 0, label: <img src="src/app/assets/icons/0.png" alt="SVG 0" /> },
                  { value: 1, label: <img src="src/app/assets/icons/1.png" alt="SVG 1" /> },
                  { value: 2, label: <img src="src/app/assets/icons/2.png" alt="SVG 2" /> },
                  { value: 3, label: <img src="src/app/assets/icons/3.png" alt="SVG 3" /> },
                  { value: 4, label: <img src="src/app/assets/icons/4.png" alt="SVG 4" /> },
                ].map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          ))}
          <Button onClick={() => handleAddSubAdvantage(index)}>Добавить Преимущество</Button> {/* Изменено: добавлено кнопка для добавления подпреимущества */}
        </Box>
      ))}

      <Button onClick={handleAddAdvantage}>Добавить раздел преимущества</Button>

      <Box>
        <label htmlFor="file-upload">
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
            multiple
          />
          <Button variant="contained" component="span">
            Загрузить изображение
          </Button>
        </label>
      </Box>
      <div className="flex gap-2">
        {formData.images.map((image, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <img
              src={URL.createObjectURL(image)}
              alt={`Image ${index}`}
              style={{
                maxWidth: '100px',
                maxHeight: '100px',
                marginRight: '10px',
                border: selectedImageIndex === index ? '2px solid blue' : 'none',
                cursor: 'pointer',
              }}
              onClick={() => handleImageClick(index)}
            />
            <Button
              variant="contained"
              color="error"
              size="small"
              style={{ position: 'absolute', top: 0, right: 0 }}
              onClick={() => handleDeleteImage(index)}
            >
              Удалить
            </Button>
          </div>
        ))}
      </div>

      <Box>
        <Button type="submit" variant="contained" color="primary">
          СОздать объект
        </Button>
      </Box>
    </form>
  );
};

export default CreateProduct;
