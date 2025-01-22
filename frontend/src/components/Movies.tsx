import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { MovieDto } from '../types/auth';
import axios from 'axios';
import './Movies.css';

const Movies: React.FC = () => {
    const { isAuthenticated, isAdmin } = useContext(AuthContext);
    const [movies, setMovies] = useState<MovieDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [newMovie, setNewMovie] = useState<Omit<MovieDto, 'id'>>({
        name: '',
        description: '',
        rating: 0,
        director: '',
        releaseDate: '',
        imageUrl: '',
    });
    const [editingMovie, setEditingMovie] = useState<MovieDto | null>(null);
    const [editFormData, setEditFormData] = useState<Omit<MovieDto, 'id'>>({
        name: '',
        description: '',
        rating: 0,
        director: '',
        releaseDate: '',
        imageUrl: '',
    });

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await api.get<MovieDto[]>('/movies');
                setMovies(response.data);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data || 'Nie udało się pobrać filmów');
                } else if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Nie udało się pobrać filmów');
                }
            }
        };

        if (isAuthenticated) {
            fetchMovies();
        }
    }, [isAuthenticated]);

    const handleAddMovie = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post<MovieDto>('/movies', newMovie);
            setMovies([...movies, response.data]);
            setShowAddForm(false);
            setNewMovie({
                name: '',
                description: '',
                rating: 0,
                director: '',
                releaseDate: '',
                imageUrl: '',
            });
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data || 'Nie udało się dodać filmu');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Nie udało się dodać filmu');
            }
        }
    };

    const handleEditMovie = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMovie) return;
        try {
            const response = await api.put<MovieDto>(`/movies/${editingMovie.id}`, editFormData);
            const updatedMovies = movies.map(movie =>
                movie.id === editingMovie.id ? response.data : movie
            );
            setMovies(updatedMovies);
            setEditingMovie(null);
            setEditFormData({
                name: '',
                description: '',
                rating: 0,
                director: '',
                releaseDate: '',
                imageUrl: '',
            });
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data || 'Nie udało się zaktualizować filmu');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Nie udało się zaktualizować filmu');
            }
        }
    };

    const handleDeleteMovie = async (id: number) => {
        if (!window.confirm('Czy na pewno chcesz usunąć ten film?')) return;
        try {
            await api.delete(`/movies/${id}`);
            const updatedMovies = movies.filter(movie => movie.id !== id);
            setMovies(updatedMovies);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data || 'Nie udało się usunąć filmu');
            } else if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Nie udało się usunąć filmu');
            }
        }
    };

    const startEditing = (movie: MovieDto) => {
        setEditingMovie(movie);
        setEditFormData({
            name: movie.name,
            description: movie.description,
            rating: movie.rating,
            director: movie.director,
            releaseDate: movie.releaseDate,
            imageUrl: movie.imageUrl,
        });
    };

    const cancelEditing = () => {
        setEditingMovie(null);
        setEditFormData({
            name: '',
            description: '',
            rating: 0,
            director: '',
            releaseDate: '',
            imageUrl: '',
        });
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="movies-container">
            <main className="movies-main">
                <h2>Lista Filmów</h2>
                {error && <p className="error-message">{error}</p>}
                {isAdmin && (
                    <button className="add-movie-button" onClick={() => setShowAddForm(!showAddForm)}>
                        {showAddForm ? 'Anuluj Dodawanie' : 'Dodaj Film'}
                    </button>
                )}
                {isAdmin && showAddForm && (
                    <form className="add-movie-form" onSubmit={handleAddMovie}>
                        <h3>Dodaj Nowy Film</h3>
                        <div className="form-group">
                            <label htmlFor="name">Nazwa:</label>
                            <input
                                type="text"
                                id="name"
                                value={newMovie.name}
                                onChange={(e) => setNewMovie({ ...newMovie, name: e.target.value })}
                                required
                                placeholder="Wprowadź nazwę filmu"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Opis:</label>
                            <input
                                type="text"
                                id="description"
                                value={newMovie.description}
                                onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                                required
                                placeholder="Wprowadź opis filmu"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="rating">Ocena:</label>
                            <input
                                type="number"
                                id="rating"
                                value={newMovie.rating}
                                onChange={(e) => setNewMovie({ ...newMovie, rating: Number(e.target.value) })}
                                required
                                placeholder="Wprowadź ocenę filmu"
                                min="0"
                                max="10"
                                step="0.1"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="director">Reżyser:</label>
                            <input
                                type="text"
                                id="director"
                                value={newMovie.director}
                                onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                                required
                                placeholder="Wprowadź reżysera filmu"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="releaseDate">Data Premiery:</label>
                            <input
                                type="date"
                                id="releaseDate"
                                value={newMovie.releaseDate}
                                onChange={(e) => setNewMovie({ ...newMovie, releaseDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="imageUrl">URL Obrazu:</label>
                            <input
                                type="text"
                                id="imageUrl"
                                value={newMovie.imageUrl}
                                onChange={(e) => setNewMovie({ ...newMovie, imageUrl: e.target.value })}
                                required
                                placeholder="Wprowadź URL obrazu filmu"
                            />
                        </div>
                        <button type="submit" className="submit-button">Dodaj Film</button>
                    </form>
                )}
                <ul className="movies-list">
                    {movies.map(movie => (
                        <li key={movie.id} className="movie-item">
                            {isAdmin && editingMovie?.id === movie.id ? (
                                <form className="edit-movie-form" onSubmit={handleEditMovie}>
                                    <h3>Edycja Filmu</h3>
                                    <div className="form-group">
                                        <label htmlFor={`edit-name-${movie.id}`}>Nazwa:</label>
                                        <input
                                            type="text"
                                            id={`edit-name-${movie.id}`}
                                            value={editFormData.name}
                                            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                            required
                                            placeholder="Wprowadź nazwę filmu"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`edit-description-${movie.id}`}>Opis:</label>
                                        <input
                                            type="text"
                                            id={`edit-description-${movie.id}`}
                                            value={editFormData.description}
                                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                            required
                                            placeholder="Wprowadź opis filmu"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`edit-rating-${movie.id}`}>Ocena:</label>
                                        <input
                                            type="number"
                                            id={`edit-rating-${movie.id}`}
                                            value={editFormData.rating}
                                            onChange={(e) => setEditFormData({ ...editFormData, rating: Number(e.target.value) })}
                                            required
                                            placeholder="Wprowadź ocenę filmu"
                                            min="0"
                                            max="10"
                                            step="0.1"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`edit-director-${movie.id}`}>Reżyser:</label>
                                        <input
                                            type="text"
                                            id={`edit-director-${movie.id}`}
                                            value={editFormData.director}
                                            onChange={(e) => setEditFormData({ ...editFormData, director: e.target.value })}
                                            required
                                            placeholder="Wprowadź reżysera filmu"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`edit-releaseDate-${movie.id}`}>Data Premiery:</label>
                                        <input
                                            type="date"
                                            id={`edit-releaseDate-${movie.id}`}
                                            value={editFormData.releaseDate}
                                            onChange={(e) => setEditFormData({ ...editFormData, releaseDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor={`edit-imageUrl-${movie.id}`}>URL Obrazu:</label>
                                        <input
                                            type="text"
                                            id={`edit-imageUrl-${movie.id}`}
                                            value={editFormData.imageUrl}
                                            onChange={(e) => setEditFormData({ ...editFormData, imageUrl: e.target.value })}
                                            required
                                            placeholder="Wprowadź URL obrazu filmu"
                                        />
                                    </div>
                                    <div className="form-actions">
                                        <button type="submit" className="submit-button">Zapisz</button>
                                        <button type="button" className="cancel-button" onClick={cancelEditing}>Anuluj</button>
                                    </div>
                                </form>
                            ) : (
                                <>
                                    <h3>{movie.name}</h3>
                                    <p>{movie.description}</p>
                                    <p>Ocena: {movie.rating}</p>
                                    <p>Reżyser: {movie.director}</p>
                                    <p>Data premiery: {movie.releaseDate}</p>
                                    <img src={movie.imageUrl} alt={movie.name} className="movie-image" />
                                    {isAdmin && (
                                        <div className="admin-buttons">
                                            <button className="edit-button" onClick={() => startEditing(movie)}>Edytuj</button>
                                            <button className="delete-button" onClick={() => handleDeleteMovie(movie.id)}>Usuń</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );

};

export default Movies;
