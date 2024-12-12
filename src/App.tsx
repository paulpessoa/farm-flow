import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FarmList from './pages/FarmList';
import FarmDetail from './pages/FarmDetail';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<FarmList />} />
          <Route path="/farm/:id" element={<FarmDetail />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;