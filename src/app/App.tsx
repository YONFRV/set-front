import { RouterProvider } from 'react-router';
import { AppProvider } from './context/AppContext';
//import { AppProvider } from './context/AppContextV1';

import { router } from './routes';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AppProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </AppProvider>
  );
}