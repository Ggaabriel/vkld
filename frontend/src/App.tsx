import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Header from './widgets/Header';
import 'swiper/css';
import 'swiper/css/pagination';

function App() {
  return (
    <Routes>
      <Route element={<Header />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
