import React, { useState } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, Box, Typography } from '@mui/material';
import axios from 'axios';
import { useAppSelector } from '../app/hooks/useAppSelector';
import { baseUrl } from '../app/fetch';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

const CreateProduct = () => {
  const userId = useAppSelector((state) => state.user.user!._id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    calculatedRating: 0,
    advantagesHeaders: [{ header: '', advantages: [{ header: '', svgType: 0 }] }],
    categories: [],
    userId: userId,
    images: [],
    address: [0, 0], // Используем массив чисел для координат
  });

  const defaultState = {
    center: [55.751574, 37.573856],
    zoom: 5,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('calculatedRating', formData.calculatedRating);
      formDataToSend.append('userId', userId);
      formDataToSend.append('address', formData.address.join(',')); // Преобразуем координаты в строку

      for (let i = 0; i < formData.images.length; i++) {
        formDataToSend.append('image', formData.images[i]);
      }

      formData.advantagesHeaders.forEach((header, headerIndex) => {
        formDataToSend.append(`advantagesHeaders[${headerIndex}].header`, header.header);
        header.advantages.forEach((advantage, advantageIndex) => {
          formDataToSend.append(
            `advantagesHeaders[${headerIndex}].advantages[${advantageIndex}].header`,
            advantage.header,
          );
          formDataToSend.append(
            `advantagesHeaders[${headerIndex}].advantages[${advantageIndex}].svgType`,
            advantage.svgType,
          );
        });
      });

      const response = await axios.post(`${baseUrl}/product`, formDataToSend);
      console.log('Product created:', response.data);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleAddAdvantageHeader = () => {
    setFormData({
      ...formData,
      advantagesHeaders: [...formData.advantagesHeaders, { header: '', advantages: [{ header: '', svgType: 0 }] }],
    });
  };

  const handleAddAdvantage = (headerIndex) => {
    const updatedAdvantagesHeaders = [...formData.advantagesHeaders];
    updatedAdvantagesHeaders[headerIndex].advantages.push({ header: '', svgType: 0 });
    setFormData({
      ...formData,
      advantagesHeaders: updatedAdvantagesHeaders,
    });
  };

  const handleMapClick = (e) => {
    // Получаем координаты клика
    const coords = e.get('coords');
    // Преобразуем координаты в адрес и обновляем состояние формы
    setFormData({
      ...formData,
      address: `${coords[0]}, ${coords[1]}`, // Пример: "55.751574, 37.573856"
    });
  };

  return (
    <form onSubmit={handleSubmit} className="pt-20">
      <Typography variant="h6">Product Information</Typography>
      <Box>
        <FormControl fullWidth>
          <InputLabel>Title</InputLabel>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Description</InputLabel>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Calculated Rating</InputLabel>
          <input
            type="number"
            value={formData.calculatedRating}
            onChange={(e) => setFormData({ ...formData, calculatedRating: e.target.value })}
            required
          />
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Categories</InputLabel>
          <Select
            multiple
            value={formData.categories}
            onChange={(e) => setFormData({ ...formData, categories: e.target.value })}
          >
            <MenuItem value="Category 1">Category 1</MenuItem>
            <MenuItem value="Category 2">Category 2</MenuItem>
            <MenuItem value="Category 3">Category 3</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography variant="h6">Advantages</Typography>
      <Box>
        {formData.advantagesHeaders.map((header, index) => (
          <div key={index}>
            <Typography variant="subtitle1">Header {index + 1}</Typography>
            <FormControl fullWidth>
              <InputLabel>Header</InputLabel>
              <input
                type="text"
                value={header.header}
                onChange={(e) => handleHeaderChange(index, e)}
              />
            </FormControl>
            {header.advantages.map((advantage, advantageIndex) => (
              <div key={advantageIndex}>
                <FormControl fullWidth>
                  <InputLabel>Advantage</InputLabel>
                  <input
                    type="text"
                    value={advantage.header}
                    onChange={(e) => handleHeaderChange(index, e)}
                  />
                </FormControl>
              </div>
            ))}
            <Button variant="contained" color="primary" onClick={() => handleAddAdvantage(index)}>
              Add Advantage
            </Button>
          </div>
        ))}
        <Button variant="contained" color="primary" onClick={handleAddAdvantageHeader}>
          Add Header
        </Button>
      </Box>

      <Box>
        <YMaps>
          <Map
            defaultState={defaultState}
            width="100%"
            height="300px"
            onClick={handleMapClick} // Обработчик клика по карте
          >
            <Placemark geometry={[55.684758, 37.738521]} />
          </Map>
        </YMaps>
      </Box>

      <Box>
        <FormControl fullWidth>
          <InputLabel>Images</InputLabel>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFormData({ ...formData, images: e.target.files })}
          />
        </FormControl>
      </Box>

      <Box>
        <Button type="submit" variant="contained" color="primary">
          Create Product
        </Button>
      </Box>
    </form>
  );
};

export default CreateProduct;
