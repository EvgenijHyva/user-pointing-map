import React from 'react';
import MapComponent from './components/map/map';
import './App.css';
import { ToastContainer } from 'react-toastify';
import { basicToastContainerProps } from './utils/toastify';

function App(): JSX.Element {

  return (
    <div className="App">
      <h1>Map</h1>
      <MapComponent/>
      <ToastContainer {...basicToastContainerProps} />
    </div>
  );
}

export default App;
