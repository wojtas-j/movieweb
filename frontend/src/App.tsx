import React, { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import Movies from './components/Movies';
import Login from './components/Login';
import Header from './components/Header';
import './App.css';

const App: React.FC = () => {
    const { isAuthenticated } = useContext(AuthContext);
    console.log('App rendered. isAuthenticated:', isAuthenticated);
    return (
        <div className="app-container">
            {isAuthenticated && <Header />}
            {isAuthenticated ? <Movies /> : <Login />}
        </div>
    );
};

export default App;