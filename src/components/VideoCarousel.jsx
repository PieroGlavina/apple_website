import {hightlightsSlides} from "../costants/index.js";
import {useEffect, useRef, useState} from "react";
import gsap from "gsap";
import {pauseImg, playImg, replayImg} from "../utils/index.js";
import {useGSAP} from "@gsap/react";

const VideoCarousel = () => {
    const videoRef = useRef([]);
    const videoSpanRef = useRef([]);
    const videoDivRef = useRef([]);

    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoID: 0,
        isLastVideo: false,
        isPlaying: false
    })

    const [loadedData, setLoadedData] = useState([]);

    const {isEnd, startPlay, videoID, isLastVideo, isPlaying} = video;

    useGSAP(() => {
        gsap.to("#slider",{
            transform: `translateX(${-100 * videoID}%)`,
            duration: 2,
            ease: "power2.inOut"
        })


        gsap.to("#video", {
            scrollTrigger: {
                trigger: "#video",
                toggleActions: "restart none none none",
            },
            onComplete: () =>{
                setVideo((previusVideo) => ({
                    ...previusVideo,
                    startPlay: true,
                    isPlaying: true,
                }))
            }
        })
    }, [isEnd, videoID])

    useEffect(() => {
        if(loadedData.length > 3){
            if(!isPlaying){
                videoRef.current[videoID].pause();
            }else{
                startPlay && videoRef.current[videoID].play();
            }
        }

    }, [startPlay, videoID, isPlaying, loadedData]);

    const handleLoadedMetadata = (i, e) => setLoadedData((previousVideo) => [...previousVideo, e])

    useEffect(() => {
        let currentProgress = 0;
        let span = videoSpanRef.current;

        if(span[videoID]){
            //animate the progress of the video
            let anim = gsap.to(span[videoID], {
                onUpdate: () => {
                    const progress = Math.ceil(anim.progress()*100);

                    if(progress != currentProgress){
                        currentProgress = progress;

                        gsap.to(videoDivRef.current[videoID], {
                            width: window.innerWidth < 760
                            ? "10vw"
                            : window.innerWidt < 1200
                                ? "10 vw"
                                : "4vw"
                        })
                         gsap.to(span[videoID], {
                             width: `${currentProgress}%`,
                             backgroundColor: "white"
                         })
                    }
                },

                onComplete: () => {
                    if(isPlaying) {
                        gsap.to(videoDivRef.current[videoID], {
                            width: "12px"
                        })

                        gsap.to(span[videoID], {
                            backgroundColor: "#afafaf"
                        })
                    }
                }
            })

            if(videoID === 0){
                anim.restart();
            }

            const animUpdate = () => {
                anim.progress(videoRef.current[videoID].currentTime/hightlightsSlides[videoID].videoDuration);
            }

            if(isPlaying){
                gsap.ticker.add(animUpdate);
            }else{
                gsap.ticker.remove(animUpdate);
            }
        }
    }, [videoID, startPlay]);

    const handleProcess = (type, i) => {
        switch (type){
            case "video-end":
                setVideo((prevVideo) => ({...prevVideo, isEnd: true, videoID: i+1}));
                break;

            case "video-last":
                setVideo((prevVideo) => ({...prevVideo, isLastVideo: true}));
                break;

            case "video-reset":
                setVideo((prevVideo) => ({...prevVideo, isLastVideo: false, videoID: 0}));
                break;

            case "play":
                setVideo((prevVideo) => ({...prevVideo, isPlaying: !prevVideo.isPlaying}));
                break;

            case "pause":
                setVideo((prevVideo) => ({...prevVideo, isPlaying: !prevVideo.isPlaying}));
                break;
            default:
                return video;
        }
    }


    return (
        <>
            <div className="flex items-center">
                {hightlightsSlides.map((list, i) => (
                    <div key={list.id} id="slider" className="sm:pr-20 pr-10">
                        <div className="video-carousel_container">
                            <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                                <video
                                    className={`${
                                        list.id === 2 && "translate-x-44"}
                                        pointer-events-none`}
                                    id="video"
                                    playsInline={true}
                                    preload="auto"
                                    muted
                                    ref={(el) => (videoRef.current[i] = el)}
                                    onEnded={() => {
                                        i !==  3
                                            ? handleProcess("video-end", i)
                                            : handleProcess("video-last")
                                    }}
                                    onPlay={() => {
                                        setVideo((prevVideo) => ({
                                            ...prevVideo, isPlaying: true
                                        }))
                                    }}
                                    onLoadedMetadata={(e) => handleLoadedMetadata(i,e)}
                                >
                                    <source src={list.video} type="video/mp4"/>
                                </video>
                            </div>

                            <div className="absolute top-12 left-[5%] z-10">
                                {list.textLists.map((text) => (
                                    <p key={text} className="md: text-2xl text-xl font-medium">
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="relative flex-center mt-10">
                <div className="flex-center py-5 px-7 bg-gray-300 rounded-full backdrop-blur">
                    {videoRef.current.map((_, i) => (
                        <span
                            key={i}
                            ref={(el) => (videoDivRef.current[i] = el)}
                            className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
                        >
                            <span className="absolute h-full w-full rounded-full" ref={(el) => (videoSpanRef.current[i] = el)}></span>

                        </span>
                        ))}
                </div>

                <button className="control-btn">
                    <img
                        src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
                        alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
                        onClick={isLastVideo
                            ? () => handleProcess("video-reset")
                            : !isPlaying
                                ?  () => handleProcess("play")
                                : () => handleProcess("pause")}
                    />
                </button>

            </div>
        </>
    )
}
export default VideoCarousel
