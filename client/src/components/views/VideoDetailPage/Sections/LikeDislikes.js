import React, { useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import Icon, { LikeOutlined, LikeFilled, DislikeOutlined, DislikeFilled } from '@ant-design/icons';
import axios from 'axios';

function LikeDislikes(props) {

    const [Likes, setLikes] = useState(0);
    const [LikeAction, setLikeAction] = useState(null);
    const [Dislikes, setDislikes] = useState(0);
    const [DislikeAction, setDislikeAction] = useState(null);

    const variable = {
        videoId: props.videoId || null,
        commentId: props.commentId || null,
        userId: props.userId
    }

    useEffect(() => {
        axios.post('/api/like/getLikes', variable)
        .then(response => {
            if (response.data.success) {
                setLikes(response.data.likes.length);

                response.data.likes.map(like => {
                    if (like.userId === props.userId){
                        setLikeAction('liked');
                    }
                })
            } else {
                alert("좋아요 불러오기 실패");
            }
        })

        axios.post('/api/like/getDislikes', variable)
        .then(response => {
            if (response.data.success) {
                setDislikes(response.data.dislikes.length);

                response.data.dislikes.map(dislike => {
                    if (dislike.userId === props.userId){
                        setDislikeAction('disliked');
                    }
                })
            } else {
                alert("싫어요 불러오기 실패");
            }
        })
      
    }, []);

    const onLike = () => {
        if (LikeAction == null) {
            axios.post('/api/like/upLike', variable)
                .then(response => {
                    if (response.data.success) {
                        setLikes(Likes + 1);
                        setLikeAction('liked');

                        if(DislikeAction !== null) {
                            setDislikes(Dislikes - 1);
                            setDislikeAction(null)
                        }

                    } else {
                        alert("좋아요 올리기 실패");
                    }
                })
        } else {
            axios.post('/api/like/downLike', variable)
                .then(response => {
                    if (response.data.success) {
                        setLikes(Likes - 1);
                        setLikeAction(null);

                    } else {
                        alert("좋아요 내리기 실패");
                    }
                })
        }
    }

    const onDislike = () => {
        if (DislikeAction == null) {
            axios.post('/api/like/upDislike', variable)
            .then(response => {
                if (response.data.success) {
                    setDislikes(Dislikes + 1);
                    setDislikeAction('disliked');

                    if(LikeAction !== null) {
                        setLikes(Likes - 1);
                        setLikeAction(null)
                    }

                } else {
                    alert("싫어요 올리기 실패");
                }
            })
        } else {
            axios.post('/api/like/downDislike', variable)
            .then(response => {
                if (response.data.success) {
                    setDislikes(Dislikes - 1);
                    setDislikeAction(null);

                } else {
                    alert("싫어요 내리기 실패");
                }
            })
            
        }
    }
    

  return <div>
      <span key="comment-basic-like">
          <Tooltip title="Like" onClick={onLike}>
              { LikeAction !== null ? <LikeFilled /> : <LikeOutlined /> }
                <span style={{paddingRight: '8px', cursor: 'auto'}}> {Likes} </span>
          </Tooltip>
      </span>

      <span key="comment-basic-dislike">
          <Tooltip title="Dislike" onClick={onDislike}>
              { DislikeAction !== null ? <DislikeFilled /> : <DislikeOutlined /> }
            <span style={{paddingRight: '8px', cursor: 'auto'}}> {Dislikes} </span>
          </Tooltip>
      </span>
  </div>;
}

export default LikeDislikes;
