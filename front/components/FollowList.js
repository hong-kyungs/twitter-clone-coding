import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { List, Button, Card } from 'antd';
import { StopOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { unfollow, removeFollower } from '../reducers/userSlice';
import useSWR from 'swr';
import axios from 'axios';

//fetcher는 이 주소를 실제로 어떻게 가져올것인지 넣어주기. - axios.get
const fetcher = (url) =>
	axios.get(url, { withCredentials: true }).then((result) => result.data);

const FollowList = ({ header }) => {
	const dispatch = useDispatch();
	const { removeFollowerDone, unfollowDone } = useSelector(
		(state) => state.user
	);

	const [followingsLimit, setFollowingsLimit] = useState(3);
	const [followersLimit, setFollowersLimit] = useState(3);

	const {
		data: followersData,
		error: followerError,
		mutate: followerMutation,
	} = useSWR(
		`http://localhost:3065/user/followers?limit=${followersLimit}`,
		fetcher
	);
	const {
		data: follwingsData,
		error: followingError,
		mutate: followingMutation,
	} = useSWR(
		`http://localhost:3065/user/followings?limit=${followingsLimit}`,
		fetcher
	);

	//더보기 버튼을 누를때마다 limit을 3씩 올려줘서 3명씩 더 보이게하기.
	const loadMoreFollowers = useCallback(() => {
		setFollowersLimit((prev) => prev + 3);
	}, []);
	const loadMoreFollowings = useCallback(() => {
		setFollowingsLimit((prev) => prev + 3);
	}, []);

	const onCancelFollowing = (id) => () => dispatch(unfollow(id));
	useEffect(() => {
		if (unfollowDone) {
			followingMutation();
		}
	}, [unfollowDone]);

	const onCancelFollower = (id) => () => dispatch(removeFollower(id));
	useEffect(() => {
		if (removeFollowerDone) {
			followerMutation();
		}
	}, [removeFollowerDone]);

	//return이 있으면 항상 hooks보다 아래에 있어야한다.
	//return이 되면 아래에 있는 hooks는 동작하지 않는다.
	if (followerError || followingError) {
		console.error(followerError || followingError);
		return <div>팔로잉/팔로워 로딩 중 에러가 발생합니다.</div>;
	}

	// 편의상 style을 객채로 코딩해서 다시 전체적으로 다시 리렌더링이 되기 때문에,
	// styled-components나 useMemo로 최적화를 해줘야한다.
	return header === '팔로잉' ? (
		<List
			style={{ marginBottom: 20 }}
			grid={{ gutter: 4, sm: 2, md: 3, lg: 3 }}
			size='small'
			header={<div>{header}</div>}
			loadMore={
				<div style={{ textAlign: 'center', margin: '10px 0' }}>
					<Button
						onClick={loadMoreFollowings}
						loading={!follwingsData && !followingError}
					>
						더 보기
					</Button>
				</div>
			}
			bordered
			dataSource={follwingsData}
			renderItem={(item) => (
				<List.Item style={{ marginTop: 20 }}>
					<Card
						actions={[
							<StopOutlined key='stop' onClick={onCancelFollowing(item.id)} />,
						]}
					>
						<Card.Meta description={item.nickname} />
					</Card>
				</List.Item>
			)}
		/>
	) : (
		<List
			style={{ marginBottom: 20 }}
			grid={{ gutter: 4, sm: 2, md: 3, lg: 3 }}
			size='small'
			header={<div>{header}</div>}
			loadMore={
				<div style={{ textAlign: 'center', margin: '10px 0' }}>
					<Button
						onClick={loadMoreFollowers}
						loading={!followersData && !followerError}
					>
						더 보기
					</Button>
				</div>
			}
			bordered
			dataSource={followersData}
			renderItem={(item) => (
				<List.Item style={{ marginTop: 20 }}>
					<Card
						actions={[
							<StopOutlined key='stop' onClick={onCancelFollower(item.id)} />,
						]}
					>
						<Card.Meta description={item.nickname} />
					</Card>
				</List.Item>
			)}
		/>
	);
};

//props로 넘겨받는게 있다면 반드시 PropTypes로 점검해주기 - 서비스의 성능이 높아진다.
FollowList.propTypes = {
	header: PropTypes.string.isRequired,
	data: PropTypes.array,
	onClickMore: PropTypes.func.isRequired,
	loading: PropTypes.bool.isRequired,
};

export default FollowList;
