import React, { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import Movies from './components/Movies';
import Login from './components/Login';

const App: React.FC = () => {
    const { isAuthenticated } = useContext(AuthContext);
    console.log('App rendered. isAuthenticated:', isAuthenticated);
    return (
        <div>
            <h1>Movie Web App</h1>
            {isAuthenticated ? <Movies /> : <Login />}
        </div>
    );
};

export default App;
