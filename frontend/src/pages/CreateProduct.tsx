import React, { useState } from 'react';
import { Button, Box, Typography, MenuItem, TextField } from '@mui/material';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';
import axios from 'axios';
import { useAppSelector } from '../app/hooks/useAppSelector';
import { baseUrl } from '../app/fetch';

const CreateProduct = () => {
  const userId = useAppSelector((state) => state.user.user!._id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    calculatedRating: 0,
    categories: [],
    userId: userId,
    images: [],
    address: [0, 0], // Используем массив чисел для координат
    advantagesHeaders: [{ header: '', advantages: [{ header: '', svgType: 0 }] }],
  });

  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const defaultState = {
    center: [54.70456582768237,20.514148358398423],
    zoom: 12,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('calculatedRating', formData.calculatedRating);
      formDataToSend.append('advantagesHeaders', JSON.stringify(formData.advantagesHeaders));
      formDataToSend.append('userId', userId);
      formDataToSend.append('address', formData.address.join(',')); // Преобразуем координаты в строку

      for (let i = 0; i < formData.images.length; i++) {
        formDataToSend.append('image', formData.images[i]);
      }
      console.log(formDataToSend.get('address'));

      const response = await axios.post(`${baseUrl}/product`, formDataToSend);
      console.log('Product created:', response.data);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleMapClick = (e) => {
    // Получаем координаты клика
    const coords = e.get('coords');
    // Преобразуем координаты в адрес и обновляем состояние формы
    setFormData({
      ...formData,
      address: [+coords[0], +coords[1]], // Пример: [55.751574, 37.573856]
    });
  };

  const handleFileInputChange = (event) => {
    const files = Array.from(event.target.files);
    setFormData({ ...formData, images: [...formData.images, ...files] }); // Добавляем новые изображения в конец массива
  };

  const handleAddAdvantage = () => {
    setFormData({
      ...formData,
      advantagesHeaders: [...formData.advantagesHeaders, { header: '', advantages: [{ header: '', svgType: 0 }] }],
    });
  };

  const handleAdvantageChange = (index, field, value) => {
    const updatedAdvantages = [...formData.advantagesHeaders];
    updatedAdvantages[index][field] = value;
    setFormData({
      ...formData,
      advantagesHeaders: updatedAdvantages,
    });
  };

  const handleImageClick = (index) => {
    if (selectedImageIndex === index) {
      // Если выбрано уже выбранное изображение, снимаем выделение
      setSelectedImageIndex(null);
    } else {
      setSelectedImageIndex(index);
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1); // Удаляем изображение из массива по индексу
    setFormData({ ...formData, images: updatedImages });
  };

  return (
    <form onSubmit={handleSubmit} className="pt-20">
      <Typography variant="h6">Product Information</Typography>
      <Box>
        <TextField
          required
          fullWidth
          id="title"
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <TextField
          required
          fullWidth
          id="description"
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <TextField
          required
          fullWidth
          id="calculatedRating"
          label="Calculated Rating"
          type="number"
          value={formData.calculatedRating}
          onChange={(e) => setFormData({ ...formData, calculatedRating: e.target.value })}
        />
        <TextField
          required
          fullWidth
          id="categories"
          label="Categories"
          select
          SelectProps={{ multiple: true }}
          value={formData.categories}
          onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
        >
          <MenuItem value="Category 1">Category 1</MenuItem>
          <MenuItem value="Category 2">Category 2</MenuItem>
          <MenuItem value="Category 3">Category 3</MenuItem>
        </TextField>
      </Box>

      <Typography variant="h6">Location</Typography>
      <Box>
        <YMaps>
          <Map defaultState={defaultState} width="100%" height="300px" onClick={handleMapClick}>
            <Placemark geometry={formData.address} />
          </Map>
        </YMaps>
      </Box>

      {formData.advantagesHeaders.map((advantage, index) => (
        <Box key={index}>
          <TextField
            fullWidth
            label={`Advantage Header ${index + 1}`}
            value={advantage.header}
            onChange={(e) => handleAdvantageChange(index, 'header', e.target.value)}
          />
          {advantage.advantages.map((subAdvantage, subIndex) => (
            <Box key={subIndex}>
              <TextField
                fullWidth
                label={`Advantage ${subIndex + 1}`}
                value={subAdvantage.header}
                onChange={(e) =>
                  handleAdvantageChange(index, 'advantages', [{ ...subAdvantage, header: e.target.value }])
                }
              />
              <TextField
                fullWidth
                select
                label="SVG Type"
                value={subAdvantage.svgType}
                onChange={(e) =>
                  handleAdvantageChange(index, 'advantages', [{ ...subAdvantage, svgType: e.target.value }])
                }
              >
                {[0, 1, 2, 3, 4, 5].map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          ))}
        </Box>
      ))}

      <Button onClick={handleAddAdvantage}>Add Advantage</Button>

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
            Upload Images
          </Button>
        </label>
      </Box>
      <div className='flex gap-2'>
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
              Delete
            </Button>
          </div>
        ))}
      </div>

      <Box>
        <Button type="submit" variant="contained" color="primary">
          Create Product
        </Button>
      </Box>
    </form>
  );
};

export default CreateProduct;
