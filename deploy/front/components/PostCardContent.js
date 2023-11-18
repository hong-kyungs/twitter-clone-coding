import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Input, Button } from 'antd';
import { useSelector } from 'react-redux';

const { TextArea } = Input;

const PostCardContent = ({
	postData,
	editMode,
	onChangePost,
	onCancelUpdate,
}) => {
	const [editText, setEditText] = useState(postData);
	const { updatePostLoading } = useSelector((state) => state.post);

	const onChangeText = useCallback((e) => {
		setEditText(e.target.value);
	}, []);

	const onClickCancel = useCallback(() => {
		setEditText(postData);
		onCancelUpdate();
	}, []);

	return (
		<div>
			{editMode ? (
				<>
					<TextArea value={editText} onChange={onChangeText} />
					<Button.Group>
						<Button type='primary' onClick={onClickCancel}>
							취소
						</Button>
						<Button
							type='primary'
							loading={updatePostLoading}
							onClick={onChangePost(editText)}
						>
							수정
						</Button>
					</Button.Group>
				</>
			) : (
				//해시태그 부분 알아내기 위해서 split안에 정규표현식 넣기
				postData.split(/(#[^\s#]+)/g).map((v, i) => {
					//해시태그가 있으면 링크로 만들어주고
					if (v.match(/(#[^\s#]+)/)) {
						return (
							<Link href={`/hashtag/${v.slice(1)}`} key={i}>
								<a>{v}</a>
							</Link>
						);
					}
					//일반적인 문자열이면 그대로 리턴
					return v;
				})
			)}
		</div>
	);
};

PostCardContent.propTypes = {
	postData: PropTypes.string.isRequired,
	editMode: PropTypes.bool,
	onChangePost: PropTypes.func.isRequired,
	onCancelUpdate: PropTypes.func.isRequired,
};

PostCardContent.defaultProps = {
	editMode: false,
};

export default PostCardContent;
