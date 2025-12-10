import { QueryClientProvider } from "@tanstack/react-query";
import ProductsPage from "./ProductPage";
import { queryClient } from "./queryClient";

const App = () => {
  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <ProductsPage />
      </QueryClientProvider>
    </div>
  );
};

export default App;
