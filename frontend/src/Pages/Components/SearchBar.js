import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

const SearchBar = ({ movies, placeholder }) => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [notFound, setNotFound] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setFilteredMovies([]);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChange = (event) => {
        setNotFound(false);
        const wordEntered = event.target.value.trim();
        setInputValue(wordEntered);

        const newFilter = movies.filter((value) =>
            value.toLowerCase().includes(wordEntered.toLowerCase())
        );

        setFilteredMovies(wordEntered.length === 0 ? [] : newFilter);
    };

    const handleSubmit = () => {
        const movie = movies.find(
            (m) => m.toLowerCase() === inputValue.toLowerCase()
        );
        if (movie) {
            navigate(`/search/${movie}`);
        } else {
            setNotFound(true);
        }
    };

    const clearInput = () => {
        setInputValue('');
        setFilteredMovies([]);
        setNotFound(false);
    };

    return (
        <div className="relative" ref={inputRef}>
            <div className="flex items-center bg-gray-800 rounded-full overflow-hidden">
                <input
                    className="w-full py-2 px-4 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
                {inputValue && (
                    <button
                        className="p-2 text-gray-400 hover:text-white focus:outline-none"
                        onClick={clearInput}
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
                <button
                    className="p-2 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none"
                    onClick={handleSubmit}
                >
                    <Search className="w-5 h-5" />
                </button>
            </div>
            {notFound && (
                <div className="mt-2 text-red-500">
                    Sorry! Movie not found in our database. Please try again.
                </div>
            )}
            {filteredMovies.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-gray-800 rounded-md shadow-lg">
                    {filteredMovies.slice(0, 10).map((movie, index) => (
                        <div
                            key={index}
                            className="px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
                            onClick={() => navigate(`/search/${movie}`)}
                        >
                            {movie}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBar;