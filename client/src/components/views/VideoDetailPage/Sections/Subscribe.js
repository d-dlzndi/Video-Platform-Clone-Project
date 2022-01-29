import Axios from 'axios';
import React, { useEffect, useState } from 'react';

function Subscribe(props) {

    const [SubscriberNumber, setSubscriberNumber] = useState(0);
    const [Subscribed, setSubscribed] = useState(false);

    const variable = {
        userTo: props.userTo
    }

    const variableSubscribed = {
        userTo: props.userTo,
        userFrom: localStorage.getItem("userId") || null
    }

    useEffect(() => {
        Axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if(response.data.success){
                    setSubscriberNumber(response.data.subscribeNumber)
                } else {
                    alert("구독자수 정보 실패");
                }
            })

        Axios.post('/api/subscribe/subscribed', variableSubscribed)
            .then(response => {
                if(response.data.success){
                    setSubscribed(response.data.subscribed);
                } else {
                    alert("구독중인지 정보 못받아옴");
                }
            })

    }, []);
    
    const onSubscribe = () => {
        if (Subscribed) {
            Axios.post('/api/subscribe/unSubscribe', variableSubscribed)
            .then(response => {
                if(response.data.success){
                    setSubscriberNumber(SubscriberNumber - 1)
                    setSubscribed(false);
                } else {
                    alert("구독 취소 실패");
                }
            })
        } else {
            if (variableSubscribed.userTo == variableSubscribed.userFrom)
            {
                alert("자기 자신을 구독할 수는 없습니다.")
                return;
            }
            Axios.post('/api/subscribe/subscribe', variableSubscribed)
            .then(response => {
                if(response.data.success){
                    setSubscriberNumber(SubscriberNumber + 1)
                    setSubscribed(true);
                } else {
                    alert("구독 신청 실패");
                }
            })
        }
    }

  return (
  <div>
      <button
        style={{backgroundColor: `${Subscribed ? 'gray' : 'red'}`, textTransform: 'uppercase', border: '0', borderRadius: '5px', padding: '.5rem 1rem'}}
        onClick={onSubscribe}
        >
            {SubscriberNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
        </button>
  </div>
  );
}

export default Subscribe;
