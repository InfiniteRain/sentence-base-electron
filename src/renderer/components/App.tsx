import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Mining } from "./Mining";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Mining />
    </QueryClientProvider>
  );
};
