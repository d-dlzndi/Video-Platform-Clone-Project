import React, {useState} from 'react';
import {Form, Input, Button, Typography, message} from 'antd';
import Icon from 'antd/lib/icon';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { useSelector } from 'react-redux'; // 사용자 몽구스 아이디값 가져오기위함

const { TextArea } = Input;
const { Title } = Typography;

const PrivateOptions = [
    {value: 0, label: "Private"},
    {value: 1, label: "Public"}
]

const CategoryOptions = [
    {value: 0, label: "Film & Animation"},
    {value: 1, label: "Autos & Vehicles"},
    {value: 2, label: "Music"},
    {value: 3, label: "Pets & Animals"},
]

function VideoUploadPage(props) {
    const user = useSelector(state => state.user); // state에 가서 유저를 가져온다

    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Private, setPrivate] = useState(0);
    const [Category, setCategory] = useState("Film & Animation");

    const [FilePath, setFilePath] = useState("");
    const [Duration, setDuration] = useState("");
    const [Thumbnail, setThumbnail] = useState("");

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value)
    }
    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value)
    }
    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value)
    }
    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value)
    }

    const onDropVideo =(files) => {
        let formData = new FormData;
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0]);
        // console.log(files);

        axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if(response.data.success) {
                    // console.log(response.data);
                    const variables = {
                        url: response.data.url,
                        fileName: response.data.fileName
                    }
                    setFilePath(variables.fileName);

                    axios.post('/api/video/thumbnail', variables)
                    .then(response => {
                        if(response.data.success){
                            // console.log(response.data);
                            setDuration(response.data.fileDuration);
                            setThumbnail(response.data.url);

                        } else {
                            alert("썸네일 생성 실패")
                        }
                    })

                } else {
                    alert("비디오 업로드 실패");
                }
            })
    }

    const onSubmitForm = (e) => {
        e.preventDefault(); // 새로고침(submit 자동 실행 함수) 방지

        const variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
            thumbnail: Thumbnail
        };

        axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if (response.data.success){
                    console.log(response.data);
                    message.success("성공적으로 업로드했습니다.");
                    setTimeout(() => {
                        props.history.push('/');
                    }, 2000);
                } else {
                    alert("업로딩 실패")
                }
            });
    }

  return (
    <div style={{ maxWidth: '700px', margin: '2rem auto'}}>
        <div style={{ textAlign: 'center', marginBottom: '2rem'}}>
            <Title level={2}>Upload Video</Title>
        </div>

        <Form onSubmit={onSubmitForm}>
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                {/* drop zone */}
                <Dropzone
                    onDrop={onDropVideo}
                    multiple={false}
                    maxSize={10000000000000} // 파일의 크기 
                    >
                    {({ getRootProps, getInputProps}) => (
                        <div style={{ width: '300px', height: '240px', border: '1px solid lightgray',
                        alignItems: 'center', justifyContent: 'center'}} {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{fontSize: '3rem'}} />
                        </div>
                    )}
                </Dropzone>

                {/* thumbnail zone */}
                { Thumbnail && // thumbnail 값이 있을 때에만 출력.
                    <div>
                        <img src={'http://localhost:5000/' + Thumbnail} alt="thumbnail" />
                    </div>
                }
            </div>

            <br />
            <br />
            <label>Title</label>
            <Input
                onChange={onTitleChange}
                value={VideoTitle}
                />
            <br />
            <br />
            <label>Description</label>
            <TextArea
                onChange={onDescriptionChange}
                value={Description}
                />
            <br />
            <br />
            
            <select onChange={onPrivateChange}>
                {PrivateOptions.map((item, index) => (
                    <option key={index} value={item.value}>{item.label}</option>
                ))}
            </select>
            <br />

            <select onChange={onCategoryChange}>
                {CategoryOptions.map((item, index) => (
                    <option key={index} value={item.value}>{item.label}</option>
                ))}
            </select>
            <br />
            <br />

            <Button type='primary' size='large' onClick={onSubmitForm}>
                Submit
            </Button>

        </Form>
    </div>
  );
}

export default VideoUploadPage;
