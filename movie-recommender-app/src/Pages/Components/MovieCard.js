import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const MovieCard = ({ movie }) => {
    const navigate = useNavigate();
    const img_path = "https://image.tmdb.org/t/p/w342";

    const handleClick = () => {
        navigate(`/search/${movie.title}`);
    };

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer"
        >
            {movie.poster_path && (
                <img
                    src={img_path + movie.poster_path}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                />
            )}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-white truncate">{movie.title}</h3>
                {movie.vote_average && (
                    <div className="flex items-center mt-2">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-yellow-400">{movie.vote_average.toFixed(1)}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MovieCard;