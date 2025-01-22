import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './Header.css';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
    const { isAdmin, logout } = useContext(AuthContext);

    return (
        <header className="header-container">
            <div className="left-menu">
                <div className="header-icon">🎬</div>
                {isAdmin && (
                    <>
                        <Link to="/users" className="header-link">Użytkownicy</Link>
                        <Link to="/movies" className="header-link">Filmy</Link>
                    </>
                )}
                {!isAdmin && (
                    <Link to="/movies" className="header-link">Filmy</Link>
                )}
            </div>
            <button onClick={logout} className="logout-button">Wyloguj się</button>
        </header>
    );
};

export default Header;