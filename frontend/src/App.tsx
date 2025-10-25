import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import {AuthProvider} from './context/AuthContext';
import {AppRoutes} from './routes';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
