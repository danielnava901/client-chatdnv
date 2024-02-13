import {useEffect, useRef} from "react";

type Props = {
    stream: MediaStream
}

export const VideoPlayer = ({stream}: Props) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if(videoRef.current) {
            videoRef.current.srcObject = stream
        }

    }, [stream])

    return <video className="border mx-2" ref={videoRef} autoPlay={true}/>
}