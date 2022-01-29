import React, { useEffect, useState } from 'react';
import SingleComment from './SingleComment';

function ReplyComment(props) {
    const [CommentNumber, setCommentNumber] = useState(0);
    const [OpenReplyComments, setOpenReplyComments] = useState(true);
    const parentCommentId = props.parentCommentId;

    useEffect(() => {
        let num = 0;
        props.commentList.map((comment) => {
            if (comment.responseTo === parentCommentId) num++;
        })
        setCommentNumber(num);
    }, []);
    

    const renderReplyComment = () => {
        props.commentList.map((comment, index) => {
                    // console.log(comment.responseTo === parentCommentId);
                    if (comment.responseTo === parentCommentId)
                    {
                        return <div style={{marginLeft : "1rem"}}>
                            <SingleComment refreshFunction={props.refreshFunction} comment={comment} user={props.user} postId={props.postId} />
                            <ReplyComment parentCommentId={comment._id} commentList={props.commentList} user={props.user} postId={props.postId} />
                        </div>
                    }
            }
        )
    }

    const onHandleChange = () => {
        setOpenReplyComments(!OpenReplyComments)
    }

  return <div>
      {
          CommentNumber > 0 &&
            <p style={{ fontSize: '.8em', color: 'gray', cursor: 'pointer' }} onClick={onHandleChange}>
                    View {CommentNumber} more comments.
            </p>
      }

      { OpenReplyComments && 
        renderReplyComment(parentCommentId) 
        }
  </div>;
}

export default ReplyComment;
