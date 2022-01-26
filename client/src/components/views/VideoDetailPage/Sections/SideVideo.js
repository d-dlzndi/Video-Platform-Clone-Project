import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function SideVideo() {
    const [SideVideos, setSideVideos] = useState([]);

    useEffect(() => {
        Axios.get('/api/video/getVideos')
            .then(response => {
                if(response.data.success) {
                    setSideVideos(response.data.videos);
                } else {
                    alert("비디오 가져오기 실패");
                }
            });
    
    }, []);

    const renderSideVideo = SideVideos.map((video, index) => {
        
        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration - minutes * 60);

        return (
            <div key={index} style={{ display: 'flex', marginTop: '1rem', marginBottom: '1rem', padding: '0 2 rem'}}>
                <div style={{ width: '40%', marginBottom: '1rem'}}>
                    <a href={`http://localhost:3000/video/${video._id}`}>
                        <img style={{ width: '100%'}} alt="thumbnail" src={`http://localhost:5000/${video.thumbnail}`} />
                    </a>
                </div>
                <div style={{ width: '50%', marginLeft: '1rem'}}>
                    <a href={`http://localhost:3000/video/${video._id}`}>
                        <span style={{ fontSize: '1rem', color: 'black'}}>{video.title}</span><br />
                        <span>{video.writer.name}</span><br />
                        <span>{video.views} views</span><br />
                        <span>{minutes + ':' + seconds}</span>
                    </a>
                </div>
            </div>
          );
    })
    
    return (
        <React.Fragment>
            {renderSideVideo}
        </React.Fragment>
    )
}

export default SideVideo;

