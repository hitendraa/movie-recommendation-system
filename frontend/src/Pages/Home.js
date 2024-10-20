import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Footer from "./Components/Footer";
import MovieCard from "./Components/MovieCard";
import SearchBar from "./Components/SearchBar";
import { motion } from "framer-motion";

const Home = () => {
    const apiKey = "api_key=b97316ed479ee4226afefc88d1792909";
    const [list, setList] = useState([]); // Movies list for search bar
    const [homeGenreList, setHomeGenreList] = useState([]); // List of genres
    const [selectedGenres, setSelectedGenres] = useState([]); // Selected genres
    const [currMovies, setCurrMovies] = useState([]); // Movies filtered by selected genres
    const [trendingMovies, setTrendingMovies] = useState([]); // Trending movies

    // Fetch initial data (movies, genres, trending movies)
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [moviesResponse, genresResponse, trendingResponse] = await Promise.all([
                    fetch("http://localhost:5000/api/movies"), // Flask server
                    fetch(`https://api.themoviedb.org/3/genre/movie/list?${apiKey}`), // TMDB for genres
                    fetch(`https://api.themoviedb.org/3/trending/movie/week?${apiKey}`), // Trending movies
                ]);

                const moviesData = await moviesResponse.json();
                const genresData = await genresResponse.json();
                const trendingData = await trendingResponse.json();

                setList(moviesData.arr); // Movies list for search
                setHomeGenreList(genresData.genres); // Genres
                setTrendingMovies(trendingData.results.slice(0, 6)); // Top 6 trending movies
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        fetchInitialData();
    }, []);

    // Fetch movies by selected genres
    useEffect(() => {
        const fetchMoviesByGenre = async () => {
            if (selectedGenres.length > 0) {
                try {
                    const response = await fetch(
                        `https://api.themoviedb.org/3/discover/movie?${apiKey}&with_genres=${selectedGenres.join(
                            ","
                        )}&sort_by=popularity.desc`
                    );
                    const data = await response.json();
                    setCurrMovies(data.results);
                } catch (error) {
                    console.error("Error fetching movies by genre:", error);
                }
            } else {
                setCurrMovies([]); // Clear if no genres selected
            }
        };

        fetchMoviesByGenre();
    }, [selectedGenres]);

    // Handle genre selection
    const onGenreClick = (genreId) => {
        setSelectedGenres((prevSelected) =>
            prevSelected.includes(genreId)
                ? prevSelected.filter((id) => id !== genreId) // Remove genre if already selected
                : [...prevSelected, genreId] // Add genre if not selected
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <NavBar />
            <main className="container mx-auto px-4 py-8">
                {/* Search Bar */}
                <section className="mb-12">
                    <h1 className="text-4xl font-bold mb-4">Discover Your Next Favorite Movie</h1>
                    <SearchBar movies={list} placeholder="Search for a movie" />
                </section>

                {/* Trending Movies */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">Trending This Week</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {trendingMovies.map((movie) => (
                            <Link to={`/search/${movie.title}`} key={movie.id}>
                                <motion.div whileHover={{ scale: 1.05 }}>
                                    <MovieCard movie={movie} />
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Genre Selector */}
                {homeGenreList.length > 0 ? (
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-4">Browse by Genre</h2>
                        <div className="flex flex-wrap gap-2">
                            {homeGenreList.map((genre) => (
                                <button
                                    key={genre.id}
                                    onClick={() => onGenreClick(genre.id)}
                                    className={`px-4 py-2 rounded-full transition ${
                                        selectedGenres.includes(genre.id)
                                            ? "bg-blue-500 text-white" // Selected
                                            : "bg-gray-700 text-gray-300" // Non-selected
                                    }`}
                                >
                                    {genre.name}
                                </button>
                            ))}
                        </div>
                    </section>
                ) : (
                    <p>Loading genres...</p>
                )}

                {/* Movies by Selected Genres */}
                {currMovies.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Movies by Selected Genres</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {currMovies.map((movie) => (
                                <Link to={`/search/${movie.title}`} key={movie.id}>
                                    <motion.div whileHover={{ scale: 1.05 }}>
                                        <MovieCard movie={movie} />
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Home;
