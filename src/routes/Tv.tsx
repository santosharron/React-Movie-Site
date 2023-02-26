import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FacebookShareButton, FacebookIcon, TwitterShareButton, TwitterIcon, TelegramShareButton, TelegramIcon } from "react-share";
import conf from "../Config";
import CardSection from "../components/CardSection";
import Select from "../components/Select";
import Loading from "../views/Loading";

function Tv(){
    const nav = useNavigate();

    const { id } = useParams();

    const [data, setData] = useState<any>(null);

    const [search, setSearch] = useSearchParams();

    const [season, setSeason] = useState<number>(1);
    const [episode, setEpisode] = useState<number>(1);

    const [episodes, setEpisodes] = useState<any>(null);
    
    function updateSeason(newSeason:number){
        if(!data){
            return;
        }

        if(newSeason > data.seasons){
            newSeason = 1;
        }

        if(newSeason < 1){
            newSeason = 1;
        }

        if(newSeason > 1){
            search.set("season", newSeason.toString());
            setSearch(search);
        }
        else{
            removeSeasonQuery();
        }

        setSeason(newSeason);

        setEpisode(1);
        removeEpisodeQuery();

        setEpisodes(null);
        getEpisodesData(newSeason);
    }

    function updateEpisode(newEpisode:number){
        if(!episodes){
            return;
        }

        if(newEpisode > episodes.length){
            newEpisode = 1;
        }

        if(newEpisode < 1){
            newEpisode = 1;
        }

        if(newEpisode > 1){
            search.set("episode", newEpisode.toString());
            setSearch(search);
        }
        else{
            removeEpisodeQuery();
        }

        setEpisode(newEpisode);
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    function onIdChange(){
        if(data && data.id !== id){
            loadNewShow();
        }
        else{
            loadShow();
        }
    }

    async function loadNewShow(){
        setData(null);
        setEpisodes(null);

        setSeason(1);
        removeSeasonQuery();

        setEpisode(1);
        removeEpisodeQuery();

        let tempData = await getShowData();

        if(!tempData){
            return nav("/");
        }

        getEpisodesData(1);
    }

    async function loadShow(){
        let tempData = await getShowData();

        if(!tempData){
            return nav("/");
        }

        let tempSeason = checkSeasonQuery(tempData);

        let tempEpisodes = await getEpisodesData(tempSeason || 1);

        checkEpisodeQuery(tempEpisodes);
    }

    async function getShowData(){
        const req = await fetch(conf.API_URL+"/tv/data?id="+id);
        const res = await req.json();

        if(res.success){
            setData(res.show);

            return res.show;
        }

        return null;
    }

    async function getEpisodesData(tempSeason:number = season){
        const req = await fetch(conf.API_URL+"/tv/episodes?id="+id+"&season="+tempSeason);
        const res = await req.json();

        if(res.success){
            setEpisodes(res.episodes);
            return res.episodes;
        }

        return null;
    }

    function checkSeasonQuery(tempData:any = data){
        if(search.has("season")){
            let rSeason = parseInt(search.get("season")!);

            if(!rSeason){
                removeSeasonQuery();
                return;
            }

            if(rSeason < 1){
                removeSeasonQuery();
                return;
            }

            if(rSeason > tempData.seasons){
                removeSeasonQuery();
                setSeason(1);
                return;
            }

            setSeason(rSeason);
            return rSeason;
        }
    }

    function checkEpisodeQuery(tempEpisodes:any = episodes){
        if(search.has("episode")){
            let rEpisode = parseInt(search.get("episode")!);

            if(!rEpisode){
                removeEpisodeQuery();
                return;
            }

            if(rEpisode < 1){
                removeEpisodeQuery();
                return;
            }

            if(rEpisode > tempEpisodes.length){
                removeEpisodeQuery();
                setEpisode(1);
                return;
            }

            setEpisode(rEpisode);
            return rEpisode;
        }
    }

    function removeSeasonQuery(){
        search.delete("season");
        setSearch(search);
    }

    function removeEpisodeQuery(){
        search.delete("episode");
        setSearch(search);
    }

    useEffect(() => onIdChange(), [id]);

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
                    <iframe src={`${data.embed}&s=${season}&e=${episode}`} allowFullScreen></iframe>
                </div>
                
                <div className="video-meta">
                    <p className="video-meta-title">{data.title}</p>
                    
                    <div className="video-meta-row">
                        <div className="video-meta-stars">
                            <i className="fa-solid fa-star"></i>
                            <p>{data.stars}/10</p>
                        </div>
                        <p className="video-meta-year">{data.released}</p>
                        <p className="video-meta-length">{data.seasons} Season{data.seasons === 1 ? "" : "s"}</p>
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

                <div className="video-playlist">
                    <Select
                    active={season-1}
                    onChange={updateSeason}
                    items={
                        [...Array(data.seasons)].map((e, i) => {
                            return {
                                id: i + 1,
                                name: "Season " + (i + 1)
                            }
                        })
                    } />

                    {
                        !episodes ? 
                        <div className="video-playlist-grid">
                            <div className="video-playlist-item">
                                <i className="fa-solid fa-play-circle"></i>
                                <p>Loading...</p>
                            </div>
                        </div>
                        :
                        <div className="video-playlist-grid">
                            {
                                episodes.map((e:any, index:number) => {
                                    return (
                                        <div
                                        key={index}
                                        title={e.title}
                                        onClick={() => updateEpisode(index+1)}
                                        className={"video-playlist-item"+(index+1 === episode ? " active" : "")}>
                                            <i className="fa-solid fa-play-circle"></i>
                                            <p><b>{index+1}.</b> {e.title}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    }
                </div>

                <CardSection
                title="Recommended TV Shows 👍"
                items={data.recommendations} />
            </div>
        </>
    )
}

export default Tv;