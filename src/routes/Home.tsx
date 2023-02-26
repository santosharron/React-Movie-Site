import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import conf from "../Config";
import CardSection from "../components/CardSection";
import Loading from "../views/Loading";

function Home(){
    const [featured, setFeatured] = useState<any>(null);

    const [popularMovies, setPopularMovies] = useState<any>(null);
    const [popularTv, setPopularTv] = useState<any>(null);

    const [topMovies, setTopMovies] = useState<any>(null);
    const [topTv, setTopTv] = useState<any>(null);

    async function getFeatured(){
        const req = await fetch(conf.API_URL+"/featured");
        const res = await req.json();

        if(res.success){
            const data = res.featured;
            
            setFeatured({
                id: data.id,
                title: data.title,
                image: data.backdrop,
                year: data.released,
                length: data.runtime+"m",
                stars: Math.round(data.stars),
                description: data.description,
                type: data.type
            });
        }
    }

    async function getPopularMovies(){
        const req = await fetch(conf.API_URL+"/movies/popular");
        const res = await req.json();

        if(res.success){
            setPopularMovies(res.movies.map((movie: any) => {
                return {
                    id: movie.id,
                    title: movie.title,
                    image: movie.poster,
                    type: "movie"
                }
            }));
        }
    }

    async function getPopularTv(){
        const req = await fetch(conf.API_URL+"/tv/popular");
        const res = await req.json();

        if(res.success){
            setPopularTv(res.shows.map((movie: any) => {
                return {
                    id: movie.id,
                    title: movie.title,
                    image: movie.poster,
                    type: "tv"
                }
            }));
        }
    }

    async function getTopMovies(){
        const req = await fetch(conf.API_URL+"/movies/top-rated");
        const res = await req.json();

        if(res.success){
            setTopMovies(res.movies.map((movie: any) => {
                return {
                    id: movie.id,
                    title: movie.title,
                    image: movie.poster,
                    type: "movie"
                }
            }));
        }
    }

    async function getTopTv(){
        const req = await fetch(conf.API_URL+"/tv/top-rated");
        const res = await req.json();

        if(res.success){
            setTopTv(res.shows.map((movie: any) => {
                return {
                    id: movie.id,
                    title: movie.title,
                    image: movie.poster,
                    type: "tv"
                }
            }));
        }
    }

    useEffect(() => {
        getFeatured();
        getPopularMovies();
        getPopularTv();
        getTopMovies();
        getTopTv();
    }, []);

    if(!featured){
        return <Loading />;
    }

    return (
        <>
            <Helmet>
                <title>Home - {conf.SITE_NAME}</title>
            </Helmet>
            <div className="container">
                <Link
                to={featured.type === "movie" ? `/movie/${featured.id}` : `/tv/${featured.id}`}
                className="movie-hero"
                style={{
                    background: `url(${conf.TMDB_IMAGE_URL+"/original"+featured.image}) no-repeat center / cover`
                }}>
                    <div className="movie-hero-drop"></div>

                    <div className="movie-hero-content">
                        <p className="movie-hero-title">{featured.title}</p>
                        
                        <div className="movie-hero-meta">
                            <div className="movie-hero-stars">
                                <i className="fa-solid fa-star"></i>
                                <p>{featured.stars}/10</p>
                            </div>
                            
                            <p className="movie-hero-year">{featured.year}</p>

                            <p className="movie-hero-length">{featured.length}</p>
                        </div>
                        
                        <p className="movie-hero-desc">{featured.description}</p>

                        <button className="movie-hero-play">
                            <i className="fa-solid fa-play"></i>
                            <p>Play</p>
                        </button>
                    </div>
                </Link>

                {
                    !topMovies ? 
                    (
                        <div className="movie-section">
                            <p className="movie-section-title">Top Rated Movies 👑</p>
        
                            <div className="movie-section-loading">
                                <i className="fa-solid fa-spinner-third"></i>
                            </div>
                        </div>
                    ) :
                    (
                        <CardSection
                        title="Top Rated Movies 👑"
                        items={topMovies} />
                    )
                }

                {
                    !popularMovies ? 
                    (
                        <div className="movie-section">
                            <p className="movie-section-title">Popular Movies 🔥</p>
        
                            <div className="movie-section-loading">
                                <i className="fa-solid fa-spinner-third"></i>
                            </div>
                        </div>
                    ) :
                    (
                        <CardSection
                        title="Popular Movies 🔥"
                        items={popularMovies} />
                    )
                }

                {
                    !topTv ? 
                    (
                        <div className="movie-section">
                            <p className="movie-section-title">Top Rated TV Shows 🏆</p>
        
                            <div className="movie-section-loading">
                                <i className="fa-solid fa-spinner-third"></i>
                            </div>
                        </div>
                    ) :
                    (
                        <CardSection
                        title="Top Rated TV Shows 🏆"
                        items={topTv} />
                    )
                }

                {
                    !popularTv ? 
                    (
                        <div className="movie-section">
                            <p className="movie-section-title">Popular TV Shows ✨</p>
        
                            <div className="movie-section-loading">
                                <i className="fa-solid fa-spinner-third"></i>
                            </div>
                        </div>
                    ) :
                    (
                        <CardSection
                        title="Popular TV Shows ✨"
                        items={popularTv} />
                    )
                }
            </div>
        </>
    )
}

export default Home;