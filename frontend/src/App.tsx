import React, { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import Status from './components/Status';
import Login from './components/Login';

const App: React.FC = () => {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <div>
            <h1>Movie Web App</h1>
            {isAuthenticated ? <Status /> : <Login />}
        </div>
    );
};

export default App;
