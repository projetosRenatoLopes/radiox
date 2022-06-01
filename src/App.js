import React from 'react';
import Routes from './Routes';
import { BrowserRouter } from 'react-router-dom';
import Menu from './components/Menu/menu';


function App() {
  return (


    <BrowserRouter>
      <div className='App'>
        <Menu></Menu>
        <Routes />
      </div>
    </BrowserRouter>
  );
}

export default App;
