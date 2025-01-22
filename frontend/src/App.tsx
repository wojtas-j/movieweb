import React, { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import Movies from './components/Movies';
import Login from './components/Login';
import Header from './components/Header';
import Users from './components/Users';
import './App.css';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from 'react-router-dom';

const App: React.FC = () => {
    const { isAuthenticated, isAdmin } = useContext(AuthContext);

    return (
        <Router>
            <div className="app-container">
                <h1>Movie Web App</h1>
                {isAuthenticated && <Header />}
                <Routes>
                    <Route
                        path="/"
                        element={
                            isAuthenticated ? <Navigate to="/movies" /> : <Login />
                        }
                    />
                    <Route
                        path="/login"
                        element={
                            isAuthenticated ? <Navigate to="/movies" /> : <Login />
                        }
                    />
                    <Route
                        path="/movies"
                        element={
                            isAuthenticated ? <Movies /> : <Navigate to="/login" />
                        }
                    />
                    <Route
                        path="/users"
                        element={
                            isAuthenticated && isAdmin ? <Users /> : <Navigate to="/login" />
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
