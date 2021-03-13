import App from './App.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

const title = 'here you go';

ReactDOM.render(
    <App title={title} />,
    document.getElementById('app')
);

module.hot.accept();