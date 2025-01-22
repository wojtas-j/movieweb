import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './Header.css';

const Header: React.FC = () => {
    const { isAdmin, logout } = useContext(AuthContext);

    return (
        <header className="header-container">
            <div className="left-menu">
                {isAdmin && (
                    <>
                        <a href="/users" className="header-link">Użytkownicy</a>
                        <a href="/movies" className="header-link">Filmy</a>
                    </>
                )}
                <div className="header-icon">🎬</div>
            </div>
            <button onClick={logout} className="logout-button">Wyloguj się</button>
        </header>
    );
};

export default Header;