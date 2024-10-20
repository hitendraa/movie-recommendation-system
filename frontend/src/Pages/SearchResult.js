import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MovieCard from "./Components/MovieCard";
import NavBar from "./Components/NavBar";
import ReactPlayer from "react-player";
import Footer from "./Components/Footer";
import { motion } from 'framer-motion';

const SearchResult = () => {
    const params = useParams();
    const apiKey = "b97316ed479ee4226afefc88d1792909"; // fixed API key declaration
    const inputValue = params.id; // retrieving the searched movie name
    const [searchedMovie, setSearchedMovie] = useState({});
    const [recommendedMovies, setRecommendedMovies] = useState([]);
    const [castMembers, setCastMembers] = useState([]);
    const [genreList, setGenreList] = useState([]);
    const [currGenre, setCurrGenre] = useState([]);
    const [videoData, setVideoData] = useState(null);
    const [isTrailerPlaying, setIsTrailerPlaying] = useState(false);

    const gotCast = (castData) => {
        setCastMembers(castData.slice(0, 5)); // Only keep the first 5 cast members
    };

    const gotVideo = (data) => {
        const trailer = data.videos?.results?.find(
            (vid) => vid.name === "Official Trailer"
        );
        setVideoData(trailer || data.videos.results[0]); // Select the first available video if no official trailer
    };

    const gotRecommendedData = (apiData) => {
        const moviePromises = apiData.movies.slice(0, 16).map((movie) =>
            fetch(
                `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${movie}`
            )
                .then((response) => response.json())
                .then((data) => data.results[0])
        );

        Promise.all(moviePromises).then((movies) =>
            setRecommendedMovies(movies.filter(Boolean))
        );
    };

    useEffect(() => {
        const gotTMDBData = (apiData) => {
            const realMovieData = apiData.results[0];
            setCurrGenre(realMovieData.genre_ids);
            setSearchedMovie(realMovieData);

            fetch(
                `https://api.themoviedb.org/3/movie/${realMovieData.id}/credits?api_key=${apiKey}`
            )
                .then((response) => response.json())
                .then((data) => gotCast(data.cast));

            fetch(
                `https://api.themoviedb.org/3/movie/${realMovieData.id}?api_key=${apiKey}&append_to_response=videos`
            )
                .then((response) => response.json())
                .then((data) => gotVideo(data));
        };

        fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${inputValue}`
        )
            .then((response) => response.json())
            .then((data) => gotTMDBData(data));

        fetch(`/api/similarity/${inputValue}`)
            .then((response) => response.json())
            .then((data) => gotRecommendedData(data));

        fetch(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`
        ).then((response) =>
            response.json().then((data) => setGenreList(data.genres))
        );
    }, [inputValue, apiKey]); // Depend on inputValue and apiKey for data updates

    const displayGenre = () =>
        currGenre.slice(0, 3).map((movieId, ind) => {
            const genre = genreList.find((obj) => obj.id === movieId);
            return genre ? (
                <span key={genre.id}>
                    {genre.name}
                    {ind < 2 && ", "}
                </span>
            ) : null;
        });

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <NavBar isHome={true} />

            <main className="container mx-auto px-4 py-8">
                <section className="mb-12">
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="md:w-1/3">
                            <img
                                src={`https://image.tmdb.org/t/p/w500${searchedMovie.poster_path}`}
                                alt={searchedMovie.title}
                                className="w-full rounded-lg shadow-lg"
                            />
                        </div>
                        <div className="md:w-2/3">
                            <h1 className="text-4xl font-bold mb-4">{searchedMovie.title}</h1>
                            <p className="text-lg mb-4">{searchedMovie.overview}</p>
                            <div className="mb-4">
                                <span className="font-semibold">Rating:</span> {searchedMovie.vote_average}/10
                            </div>
                            <div className="mb-4">
                                <span className="font-semibold">Release Date:</span> {searchedMovie.release_date}
                            </div>
                            <div className="mb-4">
                                <span className="font-semibold">Genres:</span> {currGenre.length ? displayGenre() : null}
                            </div>
                            <button
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={() => setIsTrailerPlaying(true)}
                            >
                                Watch Trailer
                            </button>
                        </div>
                    </div>
                </section>

                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-4">Cast</h2>
                    <div className="flex overflow-x-auto space-x-4 pb-4">
                        {castMembers.map((member) => (
                            <div key={member.cast_id} className="flex-shrink-0">
                                <img
                                    src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                                    alt={member.name}
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                                <p className="text-center mt-2">{member.name}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {recommendedMovies.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">Recommended Movies</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {recommendedMovies.map(movie => (
                                <motion.div key={movie.id} whileHover={{ scale: 1.05 }}>
                                    <MovieCard movie={movie} />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}
            </main>

            {isTrailerPlaying && videoData && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="w-full max-w-4xl">
                        <ReactPlayer
                            url={`https://www.youtube.com/watch?v=${videoData.key}`}
                            playing={true}
                            width="100%"
                            height="100%"
                            controls={true}
                        />
                        <button
                            className="mt-4 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => setIsTrailerPlaying(false)}
                        >
                            Close Trailer
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default SearchResult;
