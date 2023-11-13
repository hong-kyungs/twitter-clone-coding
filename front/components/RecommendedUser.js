import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card, Avatar, Button, List } from 'antd';
import Link from 'next/link';
import { RedoOutlined } from '@ant-design/icons';
import { loadUnrelatedUsers } from '../reducers/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { follow, unfollow } from '../reducers/userSlice';

import wrapper from '../store/configureStore';
// import { List } from 'antd/lib/form/Form';

const Followbox = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
`;
const CardWrapper = styled(Card)`
	.cardWrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.ant-card-meta {
		align-items: center;
	}
	.ant-card-meta-avatar {
		padding-right: 5px;
	}
	.ant-card-body {
		padding: 12px 16px;
	}
`;

const RecommendedUser = () => {
	const dispatch = useDispatch();
	const { unrelatedUsers, me, followLoading, unfollowLoading } = useSelector(
		(state) => state.user
	);
	const [selected, setSelected] = useState(null);
	const [loading, setLoading] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [unrelated, setUnrealted] = useState(true);

	useEffect(() => {
		dispatch(loadUnrelatedUsers());
		console.log(unrelatedUsers);
	}, []);

	useEffect(() => {
		//랜덤하게 섞어주기
		if (unrelatedUsers) {
			const shuffle = [];
			const unrelated = [...unrelatedUsers];
			while (unrelated.length) {
				const lastIdx = unrelated.length - 1;
				let random = Math.floor(Math.random() * unrelated.length);
				let temp = unrelated[lastIdx];
				unrelated[lastIdx] = unrelated[random];
				unrelated[random] = temp;
				shuffle.push(unrelated.pop());
			}
			console.log(shuffle);
			setSelected(shuffle.slice(0, 5));
			setLoading(true);
		}
	}, [unrelatedUsers, refresh]);

	const onRefresh = useCallback(() => {
		console.log(refresh);
		setRefresh(!refresh);
	}, [refresh]);

	const onFollow = useCallback(
		(id) => () => {
			dispatch(follow(id));
		},
		[followLoading]
	);

	const onUnfollow = useCallback(
		(id) => () => {
			dispatch(unfollow(id));
		},
		[unfollowLoading]
	);

	// const onToggle = useCallback(
	// 	(select) => {
	// 		if (isFollowing) {
	// 			dispatch(unfollow(select.id));
	// 		}
	// 		dispatch(follow(select.id));
	// 	},
	// 	[followLoading, unfollowLoading]
	// );

	return (
		<div>
			<Followbox>
				<h3 style={{ margin: '0px' }}>팔로우 추천</h3>
				<Button
					type='text'
					shape='circle'
					icon={<RedoOutlined />}
					onClick={onRefresh}
				/>
			</Followbox>
			{/* {loading ? (
				<List
					itemLayout='horizontal'
					dataSource={selected}
					renderItem={(item, index) => (
						<List.Item>
							<List.Item.Meta
								avatar={
									<Link href={`/user/${item.id}`}>
										<a>
											<Avatar>{item.nickname[0]}</Avatar>
										</a>
									</Link>
								}
								title={item.nickname}
							/>
							{unrelated ? (
								<Button type='primary' onClick={follow(item, index)}>
									팔로우
								</Button>
							) : (
								<Button onClick={unfollow(item, index)}>언팔로우</Button>
							)}
						</List.Item>
					)}
				/>
			) : (
				<div>바보</div>
			)} */}
			{loading ? (
				selected.map((select) => (
					<CardWrapper key={select.id}>
						<div className='cardWrapper'>
							<Card.Meta
								avatar={
									<Link href={`/user/${select.id}`}>
										<a>
											<Avatar>{select.nickname[0]}</Avatar>
										</a>
									</Link>
								}
								title={select.nickname}
							/>
							{me?.followings?.some((follow) => follow.id === select.id) ? (
								<Button
									loading={unfollowLoading}
									onClick={onUnfollow(select.id)}
								>
									언팔로우
								</Button>
							) : (
								<Button
									type='primary'
									loading={followLoading}
									onClick={onFollow(select.id)}
								>
									팔로우
								</Button>
							)}
						</div>
					</CardWrapper>
				))
			) : (
				<div>바보</div>
			)}
		</div>
	);
};

// export const getServerSideProps = wrapper.getServerSideProps(
// 	(store) =>
// 		async ({ req }) => {
// 			const cookie = req ? req.headers.cookie : '';
// 			axios.defaults.headers.Cookie = '';
// 			if (req && cookie) {
// 				axios.defaults.headers.Cookie = cookie;
// 			}
// 			await store.dispatch(loadUnrelatedUsers());
// 		}
// );

export default RecommendedUser;
