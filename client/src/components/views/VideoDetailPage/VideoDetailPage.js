import React, { useEffect, useState } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';

function VideoDetailPage(props) {

    const videoId = props.match.params.videoId;
    const variable = {
        videoId: videoId
    }
    const [VideoDetail, setVideoDetail] = useState([]);

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if(response.data.success) {
                    setVideoDetail(response.data.videoDetail)
                } else {
                    alert("비디오 불러오기 실패");
                }
            })
    }, [])

    if (VideoDetail.writer) {
        return (
            <Row gutter={[16, 16]} style={{ width: '90%', margin: '0 auto', paddingTop: '2rem'}}>
                <Col lg={18} xs={24}>
                  <div style={{ width: '100%'}} >
                      <video style={{ width: '100%' }} 
                          src={`http://localhost:5000/uploads/${VideoDetail.filePath}`} 
                          controls 
                      />
                  </div>
      
                  <List.Item 
                      actions={[<Subscribe userTo={VideoDetail.writer._id} />]}
                      >
                          <List.Item.Meta
                              avatar={<Avatar src={VideoDetail.writer.image} />}
                              title={VideoDetail.title}
                              description={VideoDetail.description}
                          />
      
                  </List.Item>
      
                  {/* Comments */}

                </Col>
                <Col lg={6} xs={24}>
                  {/* SideVar */}
                    <SideVideo />
                </Col>
            </Row>
        );
    } else {
        return (
            <div>Loading</div>
        );
    }

  
}

export default VideoDetailPage;
