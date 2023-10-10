import React from 'react';
import MapComponent from './components/map/map';
import './App.css';
import { ToastContainer } from 'react-toastify';
import { basicToastContainerProps } from './utils/toastify';
import User from './components/users/users';

function App(): JSX.Element {

  return (
    <div className="App">
      <h1>Map</h1>
      <MapComponent/>
      <ToastContainer {...basicToastContainerProps} />
      <User />
    </div>
  );
}

export default App;
