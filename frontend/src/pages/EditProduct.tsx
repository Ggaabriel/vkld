import React, { useEffect, useState } from 'react';
import { Button, Box, Typography, MenuItem, TextField } from '@mui/material';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import axios from 'axios';
import { useAppSelector } from '../app/hooks/useAppSelector';
import { baseUrl } from '../app/fetch';
import { useAppDispatch } from '../app/hooks/useAppDispatch';
import { setUser } from '../app/store/slice/UserSlice';
import { useParams } from 'react-router-dom';

interface IFormData {
  title: string;
  description: string;
  calculatedRating: number;
  categories: string[];
  userId: string;
  images: (File | { path: string })[];
  address: [number, number];
  advantagesHeaders: { header: string; advantages: { header: string; svgType: number }[] }[];
}

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const user = useAppSelector((state) => state.user.user);
  const dispatch = useAppDispatch();
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
    async function getUser() {
      await axios
        .get(`${baseUrl}/auth`, {
          headers: { token },
        })
        .then(({ data }) => {
          dispatch(setUser(data));
          setFormData((prev) => ({ ...prev, userId: data._id }));
        });
    }
    if (token) {
      getUser();
    }
  }, [dispatch]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await axios.get(`${baseUrl}/product/${id}`);
        const product = response.data;
        setFormData({
          title: product.title,
          description: product.description,
          calculatedRating: product.calculatedRating,
          categories: product.categories,
          userId: product.userId,
          images: product.images.map((imagePath: string) => ({ path: imagePath })),
          address: product.address,
          advantagesHeaders: product.advantagesHeaders,
        });
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }
    fetchProduct();
  }, [id]);

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
      formDataToSend.append('calculatedRating', formData.calculatedRating.toString());
      formDataToSend.append('advantagesHeaders', JSON.stringify(formData.advantagesHeaders));
      formDataToSend.append('userId', user!._id);
      formDataToSend.append('categories', formData.categories.join(','));
      formDataToSend.append('address', formData.address.join(','));

      if (selectedImageIndex !== null) {
        formDataToSend.append('image', formData.images[selectedImageIndex]);
        formDataToSend.append('imageIndex', selectedImageIndex.toString());
      } else {
        for (let i = 0; i < formData.images.length; i++) {
          if (formData.images[i] instanceof File) {
            formDataToSend.append('image', formData.images[i] as File);
          }
        }
      }

      const response = await axios.patch(`${baseUrl}/product/${id}`, formDataToSend);
      console.log('Product updated:', response.data);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleMapClick = (e: any) => {
    const coords = e.get('coords');
    setFormData((prev) => ({
      ...prev,
      address: [+coords[0], +coords[1]],
    }));
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (selectedImageIndex !== null && files.length > 0) {
      setFormData((prev) => {
        const updatedImages = [...prev.images];
        updatedImages[selectedImageIndex] = files[0];
        return { ...prev, images: updatedImages };
      });
    } else {
      setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    }
  };

  const handleAddAdvantage = () => {
    setFormData((prev) => ({
      ...prev,
      advantagesHeaders: [...prev.advantagesHeaders, { header: '', advantages: [] }],
    }));
  };

  const handleAdvantageChange = (index: number, field: string, value: any) => {
    const updatedAdvantages = [...formData.advantagesHeaders];
    updatedAdvantages[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      advantagesHeaders: updatedAdvantages,
    }));
  };

  const handleAddSubAdvantage = (index: number) => {
    const updatedAdvantages = [...formData.advantagesHeaders];
    updatedAdvantages[index].advantages.push({ header: '', svgType: 0 });
    setFormData((prev) => ({
      ...prev,
      advantagesHeaders: updatedAdvantages,
    }));
  };

  const handleDeleteAdvantage = (advantageIndex: number, subAdvantageIndex: number) => {
    const updatedAdvantages = [...formData.advantagesHeaders];
    updatedAdvantages[advantageIndex].advantages.splice(subAdvantageIndex, 1);
    setFormData((prev) => ({
      ...prev,
      advantagesHeaders: updatedAdvantages,
    }));
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex((prev) => (prev === index ? null : index));
  };

  const handleDeleteImage = async (index: number) => {
    try {
      const response = await axios.delete(`${baseUrl}/product/${id}/image/${index}`);
      console.log('Image deleted:', response.data);
      setFormData((prev) => {
        const updatedImages = [...prev.images];
        updatedImages.splice(index, 1);
        return { ...prev, images: updatedImages };
      });
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pt-20 bg-white ">
      <Typography className="py-5" variant="h6">
        Информация об объекте
      </Typography>
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

      {formData.advantagesHeaders.map((advantage, advantageIndex) => (
        <Box className="flex flex-col gap-5" key={advantageIndex}>
          <TextField
            fullWidth
            label={`Заголовок преимуществ ${advantageIndex + 1}`}
            value={advantage.header}
            onChange={(e) => handleAdvantageChange(advantageIndex, 'header', e.target.value)}
          />
          {advantage.advantages.map((subAdvantage, subAdvantageIndex) => (
            <Box key={subAdvantageIndex} className="flex flex-col gap-5">
              <TextField
                fullWidth
                label={`Преимущество ${subAdvantageIndex + 1}`}
                value={subAdvantage.header}
                onChange={(e) =>
                  handleAdvantageChange(advantageIndex, 'advantages', [
                    ...advantage.advantages.slice(0, subAdvantageIndex),
                    { ...subAdvantage, header: e.target.value },
                    ...advantage.advantages.slice(subAdvantageIndex + 1),
                  ])
                }
              />
              <TextField
                fullWidth
                select
                label="Картинка"
                value={subAdvantage.svgType}
                onChange={(e) =>
                  handleAdvantageChange(advantageIndex, 'advantages', [
                    ...advantage.advantages.slice(0, subAdvantageIndex),
                    { ...subAdvantage, svgType: parseInt(e.target.value) },
                    ...advantage.advantages.slice(subAdvantageIndex + 1),
                  ])
                }
              >
                {[
                  { value: 0, label: <img src="/src/app/assets/icons/0.png" alt="SVG 0" /> },
                  { value: 1, label: <img src="/src/app/assets/icons/1.png" alt="SVG 1" /> },
                  { value: 2, label: <img src="/src/app/assets/icons/2.png" alt="SVG 2" /> },
                  { value: 3, label: <img src="/src/app/assets/icons/3.png" alt="SVG 3" /> },
                  { value: 4, label: <img src="/src/app/assets/icons/4.png" alt="SVG 4" /> },
                ].map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                onClick={() => handleDeleteAdvantage(advantageIndex, subAdvantageIndex)}
                variant="outlined"
                color="error"
              >
                Удалить Преимущество
              </Button>
            </Box>
          ))}
          <Button onClick={() => handleAddSubAdvantage(advantageIndex)}>Добавить Преимущество</Button>
          <Button
            onClick={() => {
              const updatedAdvantages = [...formData.advantagesHeaders];
              updatedAdvantages.splice(advantageIndex, 1);
              setFormData((prev) => ({
                ...prev,
                advantagesHeaders: updatedAdvantages,
              }));
            }}
            variant="outlined"
            color="error"
          >
            Удалить раздел преимущества
          </Button>
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
              src={image.path ? 'http://localhost:3000/' + image.path : URL.createObjectURL(image)}
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
          Обновить объект
        </Button>
      </Box>
    </form>
  );
};

export default EditProduct;
