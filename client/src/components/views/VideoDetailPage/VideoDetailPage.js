import React, { useEffect, useState } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';
import LikeDislikes from './Sections/LikeDislikes';

function VideoDetailPage(props) {

    const videoId = props.match.params.videoId;
    const variable = {
        videoId: videoId
    }
    const [VideoDetail, setVideoDetail] = useState([]);
    const [Comments, setComments] = useState([]);

    useEffect(() => {
        Axios.post('/api/video/getVideoDetail', variable)
            .then(response => {
                if(response.data.success) {
                    setVideoDetail(response.data.videoDetail)
                } else {
                    alert("비디오 불러오기 실패");
                }
            })

        Axios.post('/api/comment/getComments', variable)
        .then(response => {
            if(response.data.success) {
                setComments(response.data.comments)
            } else {
                alert("댓글 불러오기 실패");
            }
        })
    }, [])

    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment))
    }

    if (VideoDetail.writer) {

        const subscribeButton = VideoDetail.writer._id !== localStorage.getItem('userId') ? <Subscribe userTo={VideoDetail.writer._id} /> : null;

        return (
            <Row gutter={[16, 16]} > {/* style={{ width: '90%', margin: '0 auto', paddingTop: '2rem'}} */}
                <Col lg={18} xs={24}>
                  <div style={{ width: '100%'}} >
                      <video style={{ width: '100%' }} 
                          src={`http://localhost:5000/uploads/${VideoDetail.filePath}`} 
                          controls 
                      />
                  </div>
      
                  <List.Item 
                      actions={[ <LikeDislikes videoId={videoId} userId={localStorage.getItem('userId')} />, subscribeButton ]}
                      >
                          <List.Item.Meta
                              avatar={<Avatar src={VideoDetail.writer.image} />}
                              title={VideoDetail.title}
                              description={VideoDetail.description}
                          />
      
                  </List.Item>
      
                  {/* Comments (부모Function을 보낼수도 있음.) */}
                    <Comment refreshFunction={refreshFunction} commentList={Comments} postId={videoId} />

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
