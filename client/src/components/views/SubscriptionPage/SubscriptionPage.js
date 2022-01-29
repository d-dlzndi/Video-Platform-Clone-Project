import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import moment from 'moment';
import { Divider, Avatar, Col, Row, Typography, Card } from 'antd';
const { Title } = Typography;
const { Meta } = Card;

function SubscriptionPage() {
    const [VideoArray, setVideoArray] = useState([]);

    useEffect(() => {
        const subscriptionVariable = {
            userFrom: localStorage.getItem('userId')
        }

        Axios.post('/api/video/getSubscriptionVideos', subscriptionVariable) // 무조건 post여야 작동한다.. 왜지?
            .then(response => {
                if(response.data.success) {
                    setVideoArray(response.data.videos);
                } else {
                    alert("비디오 가져오기 실패");
                }
            });

    }, []);

    const renderCards = VideoArray.map((video, index) => {
        
        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration - minutes * 60);

        return <Col lg={6} md={8} xs={24} key={index}> {/* 전체 24, 제일크면 6줄, 작으면 8줄 */}
        <Card
            hoverable
            title={video.title}
            style={{width: '100%'}}
            cover={<img alt="thumbnail" src={`http://localhost:5000/${video.thumbnail}`} />}
            extra={ <a href={`/video/${video._id}`}>{moment(video.createdAt).format('YY/MM/DD HH:MM')}</a> }
            id={`card_${index}`}
            >
        <Meta 
            avatar={
                <Avatar src={video.writer.image} />
            }
            title={video.writer.name}
            description={`${video.views} views - ${minutes + ':' + seconds}`}
        >
        </Meta>
            </Card>
        </Col>
    })

    return (
        <div>
            <Title level={2}>Subscription</Title>
            <Divider orientation="left"></Divider>
            
            <Row gutter={[32, 16]}>
                { VideoArray.length > 0 && renderCards }
            </Row>
        </div>
    )
}

export default SubscriptionPage;
