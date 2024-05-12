const fetchProduct = async () => {
  const productDto = {
    images: ['image1.jpg', 'image2.jpg'],
    title: 'Product Title',
    description: 'Product Description',
    address: 'Product Address',
    calculatedRating: 4.5,
    advantagesHeaders: [
      {
        header: 'Advantages Header 1',
        advantages: [
          { header: 'Advantage 1', svgType: 1 },
          { header: 'Advantage 2', svgType: 2 },
        ],
      },
      {
        header: 'Advantages Header 2',
        advantages: [
          { header: 'Advantage 3', svgType: 3 },
          { header: 'Advantage 4', svgType: 4 },
        ],
      },
    ],
  };

  try {
    const response = await fetch('http://localhost:3000/api/product/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productDto),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    console.log('Product created successfully:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

fetchProduct();
