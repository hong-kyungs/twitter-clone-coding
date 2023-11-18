import React, { useEffect, useState, useCallback } from 'react';
import { List, Avatar, Button, Card } from 'antd';
import styled from 'styled-components';
import { RedoOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

import useSWR from 'swr';
import axios from 'axios';
import { unfollow, follow } from '../reducers/userSlice';

const Followbox = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
`;

const fetcher = (url) =>
	axios.get(url, { withCredentials: true }).then((result) => result.data);

const Recommended = () => {
	const { me, followLoading, unfollowLoading, unfollowDone, followDone } =
		useSelector((state) => state.user);
	const dispatch = useDispatch();

	const { data, error, mutate } = useSWR(
		'http://localhost:3065/user/unrelated',
		fetcher
	);

	const isFollowing = me?.following?.some((follow) => follow.id === data.id);

	const onRefresh = useCallback(() => {
		console.log('다시');
	}, []);

	// const onFollow = useCallback(() => {
	// 	setIsFollowing(true);
	// }, []);

	// const onUnfollow = useCallback(() => {
	// 	setIsFollowing(false);
	// }, []);

	const onClickButton = useCallback(
		(id) => () => {
			if (isFollowing) {
				dispatch(unfollow(id));
				if (followDone || unfollowDone) {
					mutate();
				}
			}
			dispatch(follow(id));
			if (followDone || unfollowDone) {
				mutate();
			}
		},
		[isFollowing]
	);

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
			<List
				itemLayout='horizontal'
				dataSource={data}
				renderItem={(item) => (
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
						{isFollowing ? (
							<Button
								loading={unfollowLoading}
								onClick={onClickButton(item.id)}
							>
								언팔로우
							</Button>
						) : (
							<Button
								type='primary'
								loading={followLoading}
								onClick={onClickButton(item.id)}
							>
								팔로우
							</Button>
						)}
					</List.Item>
				)}
			/>
		</div>
	);
};

export default Recommended;
