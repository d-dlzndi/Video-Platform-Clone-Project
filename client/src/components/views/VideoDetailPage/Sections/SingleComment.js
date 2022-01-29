import React, {useState} from 'react';
import { Comment, Avatar, Button, Input } from 'antd';
import Axios from 'axios';
import LikeDislikes from './LikeDislikes';

function SingleComment(props) {
    const videoId = props.postId;
    const comment = props.comment;
    const user = props.user;
    const [OpenReply, setOpenReply] = useState(false);
    const [CommentValue, setCommentValue] = useState("");

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }

    const onChangeCommentValue = (e) => {
        setCommentValue(e.currentTarget.value)
    }
        

    const onSubmit = (event) => {
        event.preventDefault();
        
        const variable = {
            content: CommentValue,
            writer: user.userData._id,
            postId: videoId,
            responseTo: props.comment._id
        }

        Axios.post('/api/comment/saveComment', variable)
            .then(response => {
                if (response.data.success) {
                    props.refreshFunction(response.data.result);
                    setCommentValue("");
                } else {
                    alert("코멘트 저장 실패")
                }
            })
    }

    const actions = [
        <LikeDislikes commentId={comment._id} userId={localStorage.getItem('userId')} />,
        <span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>,
    ]

  return (
  <div>
      <Comment
        actions={actions}
        author={comment.writer.name}
        avatar={<Avatar src={comment.writer.image} alt="profile Img" />}
        content={<p>{comment.content}</p>}
        />

        {OpenReply &&
            <form style={{ display: 'flex'}} onSubmit={onSubmit} >
                <textarea
                    style={{ width: '100%', borderRadius: '5px' }}
                    onChange={onChangeCommentValue}
                    value={CommentValue}
                    placeholder="Comment..."
                    />
                <br />
                <button style={{ width: '20%', height: '50px'}} onClick={onSubmit} >Submit</button>
            </form>
        }
        
  </div>
  );
}

export default SingleComment;
