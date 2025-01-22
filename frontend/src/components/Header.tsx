import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import './Header.css';
import { Link } from 'react-router-dom';
import { FaFilm, FaUsers, FaSignOutAlt, FaBars } from 'react-icons/fa';

const Header: React.FC = () => {
    const { isAdmin, logout } = useContext(AuthContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleScroll = () => {
        if (window.scrollY > 50) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={`header-container ${isScrolled ? 'scrolled' : ''}`}>
            <div className="left-menu">
                <FaFilm className="header-icon" />
                <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    {isAdmin && (
                        <>
                            <Link to="/users" className="header-link" onClick={closeMenu}>
                                <FaUsers className="link-icon" /> Użytkownicy
                            </Link>
                            <Link to="/movies" className="header-link" onClick={closeMenu}>
                                <FaFilm className="link-icon" /> Filmy
                            </Link>
                        </>
                    )}
                    {!isAdmin && (
                        <Link to="/movies" className="header-link" onClick={closeMenu}>
                            <FaFilm className="link-icon" /> Filmy
                        </Link>
                    )}
                </nav>
                <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
                    <FaBars />
                </button>
            </div>
            <button onClick={logout} className="logout-button">
                <FaSignOutAlt className="logout-icon" /> Wyloguj się
            </button>
        </header>
    );
};

export default Header;
