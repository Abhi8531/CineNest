import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { store } from './store/store';
import { Provider } from 'react-redux';
import axios from 'axios';
import reportWebVitals from './reportWebVitals';

/**setup axios */
axios.defaults.baseURL = "https://api.themoviedb.org/3"

// Only set authorization header if token exists
if (process.env.REACT_APP_ACCESS_TOKEN) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`
} else {
  console.error('REACT_APP_ACCESS_TOKEN is not defined. Please check your .env file.')
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
  
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
