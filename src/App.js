import axios from "axios";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";
import "./assets/scss/main.css";
import { persistor, Store } from "./redux/store";
import RootRouter from "./routes/RootRouter";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

export const axiosApiInstance = axios.create();


export const themeOptions = { // mui theme
  palette: {
    mode: 'light',
    primary: {
      main: '#dfe3e8',
      light: '#dfe3e8',
      dark: '#dfe3e8',
    },
    secondary: {
      main: '#f50057',
      
    },
  },
};


const theme = createTheme(themeOptions);


function App() {
  return (
    <ThemeProvider theme={theme}>

    <Provider store={Store}>
      <PersistGate loading={<h1>Loading...</h1>} persistor={persistor}>
        <RootRouter />
        <Toaster />
      </PersistGate>
    </Provider>
    </ThemeProvider>

  );
}

export default App;
