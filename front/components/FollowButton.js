import React, { useCallback } from 'react';
import { Button } from 'antd';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { follow, unfollow } from '../reducers/userSlice';

const FollowButton = ({ post }) => {
	const dispatch = useDispatch();
	const { me, followLoading, unfollowLoading } = useSelector(
		(state) => state.user
	);

	//팔로잉 여부 파악
	//내 정보가 있고, 나를 팔로잉 한 사람중에 post 작성자가 있으면
	const isFollowing = me?.Followings.find((v) => v.id === post.User.id);
	const onClickButton = useCallback(() => {
		//이미 팔로우하고 있으면 언팔로우
		if (isFollowing) {
			dispatch(unfollow(post.User.id));
		} else {
			//팔로우 안하고 있으면 팔로우(언팔로우 -> 팔로우)
			dispatch(follow(post.User.id));
		}
	}, [isFollowing]);

	//내 게시물에는 팔로우버튼 안보이게하기
	if (post.User.id === me.id) {
		return null;
	}

	return (
		<Button loading={followLoading || unfollowLoading} onClick={onClickButton}>
			{/* 버튼 : 이미 팔로우하고 있으면 ? 언팔로우, 언팔로우면? 팔로우 버튼 생성되게 하기 */}
			{isFollowing ? '언팔로우' : '팔로우'}
		</Button>
	);
};

FollowButton.propTypes = {
	post: PropTypes.object.isRequired,
};

export default FollowButton;
