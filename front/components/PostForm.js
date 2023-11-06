import React, { useCallback, useEffect, useRef } from 'react';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import postSlice, { addPost, uploadImages } from '../reducers/postSlice';
import { addPostToMe } from '../reducers/userSlice';
import useInput from '../../hooks/useInput';

const PostForm = () => {
	const { imagePaths, addPostDone, mainPosts } = useSelector(
		(state) => state.post
	);
	const dispatch = useDispatch();
	const imageInput = useRef(); // 실제 DOM에 접근하기위해 ref 사용

	// const [text, setText] = useState('');
	// const onChangeText = useCallback((e) => {
	// 	setText(e.target.value);
	// }, []);
	//useInput사용하여 줄여주기
	const [text, onChangeText, setText] = useInput('');

	//게시글을 업로드할때 이미지가 있다면 text뿐만 아니라 이미지경로(imagepath)도 같이 업로드해주기
	//text만 업로드할때는 dispatch(addPost(text)); -> 텍스트와 이미지 업로드로 바꿔주기
	const onSubmit = useCallback(() => {
		if (!text || !text.trim()) {
			// 게시글이 없으면 게시글 작성하라고 알려주기
			return alert('게시글을 작성하세요.');
		}
		//이미지가 없는 경우에는 formData를 쓸 필요가 없다.
		const formData = new FormData();
		imagePaths.forEach((p) => {
			formData.append('image', p); //append로 추가
		});
		formData.append('content', text);
		return dispatch(addPost(formData)); // 이미지경로, 텍스트가 합쳐진 formData를 전달
	}, [text, imagePaths]);

	useEffect(() => {
		if (addPostDone) {
			const lastId = mainPosts[0].id;
			console.log('lastId', lastId);
			dispatch(addPostToMe(lastId));
			setText('');
		}
	}, [addPostDone]);

	const onClickImageUpload = useCallback(() => {
		imageInput.current.click();
	}, [imageInput.current]);

	const onChangeImages = useCallback((e) => {
		console.log('images', e.target.files); // e.target.files안에 선택한 정보들이 들어있다.
		const imageFormData = new FormData(); // formData로 하면  multipart 형식으로 서버에 보낼 수 있다. multipart형식으로 보내야 multer가 처리한다.
		//e.target.files가 유사배열로 배열모양을 띄는 객체이다. [].forEach로 배열에 forEach 메서드를 빌려쓴다.
		[].forEach.call(e.target.files, (f) => {
			imageFormData.append('image', f);
		});
		dispatch(uploadImages(imageFormData));
	});

	const onRemoveImage = useCallback(
		(index) => () => {
			dispatch(postSlice.actions.removeImage(index));
		},
		[]
	);

	return (
		<Form
			style={{ margin: '10px 0 20px' }}
			encType='multipart/form-data'
			onFinish={onSubmit}
		>
			<Input.TextArea
				value={text}
				onChange={onChangeText}
				maxLength={140}
				placeholder='어떤 신기한 일이 있었나요?'
			/>
			<div>
				{/* 이미지 input */}
				<input
					type='file'
					name='image'
					multiple
					hidden
					ref={imageInput}
					onChange={onChangeImages}
				/>
				{/* 이미지 업로드  버튼*/}
				<Button onClick={onClickImageUpload}>이미지 업로드</Button>
				{/* 게시글 작성 버튼 */}
				<Button type='primary' style={{ float: 'right' }} htmlType='submit'>
					짹짹
				</Button>
			</div>
			<div>
				{imagePaths.map((v, i) => (
					<div key={v} style={{ display: 'inline-block' }}>
						<img
							src={`http://localhost:3065/${v}`}
							style={{ width: '200px' }}
							alt={v}
						/>
						<div>
							<Button onClick={onRemoveImage(i)}>제거</Button>
						</div>
					</div>
				))}
			</div>
		</Form>
	);
};

export default PostForm;
