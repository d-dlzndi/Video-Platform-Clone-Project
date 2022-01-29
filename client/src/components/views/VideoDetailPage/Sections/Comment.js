import Axios from 'axios';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';

function Comment(props) {
    const user = useSelector(state=>state.user);
    const videoId = props.postId;
    const [CommentValue, setCommentValue] = useState("");

    const handleClick = (event) => {
        setCommentValue(event.currentTarget.value);
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variable = {
            content: CommentValue,
            writer: user.userData._id,
            postId: videoId,
            // responseTo: 
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

  return (
    <div>
        <br />
        <h3>Replies</h3>
        <hr />

        {/* Comment Lists */}
        {props.commentList && props.commentList.map((comment, index) => 
            ( !comment.responseTo && // 답글이 아닌 애들만 // 2개 이상 요소 리턴은 React.Fragment로 감싸줌.
                <div key={comment._id + "" + index}> 
                    <SingleComment refreshFunction={props.refreshFunction} comment={comment} user={user} postId={videoId} />
                    <ReplyComment parentCommentId={comment._id} commentList={props.commentList} user={user} postId={videoId} />
                </div>
                )
        )}

        {/* Root Comment Form */}
        <form style={{ display: 'flex'}} onSubmit={onSubmit} >
            <textarea
                style={{ width: '100%', borderRadius: '5px' }}
                onChange={handleClick}
                value={CommentValue}
                placeholder="Comment..."
                />
            <br />
            <button style={{ width: '20%', height: '50px'}} onClick={onSubmit} >Submit</button>
        </form>

    </div>
  );
}

export default Comment;
