// Libaries
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';

// Redux - Import Store
import store from './redux/reducer/Reducers';

// Component
import App from './components/app/App';

// CSS Style
import './index.css';



ReactDOM.render(
    <React.StrictMode>
      <Provider store = {store}>
        <App />
      </Provider>  
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
