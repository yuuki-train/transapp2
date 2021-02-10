import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Search from './Search';
import Result from './Result';

ReactDOM.render(
  <React.StrictMode>
    <Search />
    <Result />
  </React.StrictMode>,
  document.getElementById('root')
);