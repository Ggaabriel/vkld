import React from 'react'
import { useParams } from 'react-router-dom'

type Props = {}

const CategoryList = (props: Props) => {
  const params = useParams();
  console.log(params);
  
  return (
    <div>CategoryList</div>
  )
}

export default CategoryList