import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, TelegramShareButton, TelegramIcon } from "react-share";
import conf from "../Config";
import CardSection from "../components/CardSection";
import Loading from "../views/Loading";

function Movie(){
    const nav = useNavigate();

    const { id } = useParams();

    const [data, setData] = useState<any>(null);

    async function getMovie(){
        const req = await fetch(conf.API_URL+"/movies/data?id="+id);
        const res = await req.json();

        if(res.success){
            setData(res.movie);            
        }
        else if(res.error){
            return nav("/404");
        }
    }

    useEffect(() => {
        setData(null);

        getMovie();
    }, [id]);
    
    if(!data){
        return <Loading />;
    }

    return (
        <>
            <Helmet>
                <title>{data.title+" - "+data.released+" - "+conf.SITE_NAME}</title>
            </Helmet>
            <div className="container">
                <div className="video-frame">
                    <iframe src={data.embed} allowFullScreen></iframe>
                </div>

                <div className="video-meta">
                    <p className="video-meta-title">{data.title}</p>
                    
                    <div className="video-meta-row">
                        <div className="video-meta-stars">
                            <i className="fa-solid fa-star"></i>
                            <p>{data.stars}/10</p>
                        </div>
                        <p className="video-meta-year">{data.released}</p>
                        <p className="video-meta-length">{Math.floor(data.runtime / 60)}h {data.runtime % 60}m</p>
                    </div>

                    <p className="video-meta-desc">{data.description}</p>

                    <div className="video-meta-share">
                        <FacebookShareButton
                        url={location.href}
                        quote={`Watch ${data.title} - ${data.released} for free at ${location.href}`}
                        className="video-meta-button">
                            <FacebookIcon size={40} round />
                        </FacebookShareButton>

                        <TwitterShareButton
                        url={location.href}
                        title={`Watch ${data.title} - ${data.released} for free at`}
                        className="video-meta-button">
                            <TwitterIcon size={40} round />
                        </TwitterShareButton>

                        <TelegramShareButton
                        url={location.href}
                        title={`Watch ${data.title} - ${data.released} for free at ${location.href}`}
                        className="video-meta-button">
                            <TelegramIcon size={40} round />
                        </TelegramShareButton>
                    </div>

                    <div className="video-meta-genres">
                        {
                            data.genres.map((genre: string) => (
                                <div key={genre} className="video-meta-genre">
                                    <p>{genre}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <CardSection
                title="Recommended Movies 👍"
                items={data.recommendations} />
            </div>
        </>
    )
}

export default Movie;