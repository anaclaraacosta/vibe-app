import AppRoutes from './routes/AppRoutes';
import { VibeProvider } from './context/VibeContext';

export default function App() {
  return (
    <VibeProvider>
      <AppRoutes />
    </VibeProvider>
  );
}
