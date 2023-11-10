import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card, Avatar, Button } from 'antd';
import Link from 'next/link';
import { RedoOutlined } from '@ant-design/icons';
import { loadUnrelatedUsers } from '../reducers/userSlice';
import { useDispatch, useSelector } from 'react-redux';

import wrapper from '../store/configureStore';

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
	const { unrelatedUsers, me } = useSelector((state) => state.user);
	const [selected, setSelected] = useState(null);
	const [loading, setLoading] = useState(false);

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
	}, [unrelatedUsers]);

	const onRefresh = () => {
		console.log('다시');
	};

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
			{loading ? (
				selected.map((select) => (
					<CardWrapper>
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
							<Button type='primary'>팔로우</Button>
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
