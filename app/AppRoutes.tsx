import { Navigate, Route, Routes } from 'react-router-dom';
import Home from '@/app/page';
import RoomPage from '@/app/room/page';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room" element={<Navigate to="/" replace />} />
      <Route path="/room/:id" element={<RoomPage />} />
    </Routes>
  );
};
