import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from 'react-redux';
import { store } from './store';
import { theme } from "./theme";
import { SnackbarProvider } from 'notistack'; // For toast notifications

import { AuthContextProvider } from "./context/auth/context.tsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
              <App />
            </AuthContextProvider>
          </QueryClientProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
