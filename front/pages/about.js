//getStaticProps를 써보기위한 예제 - 없어도 되는 페이지!!!!
import React from 'react';
import { useSelector } from 'react-redux';
import Head from 'next/head';
import { END } from 'redux-saga';

import { Avatar, Card } from 'antd';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';
import { LOAD_USER_REQUEST } from '../reducers/user';

//특정 사용자 정보 가져오기
const About = () => {
	const { userInfo } = useSelector((state) => state.user);

	return (
		<>
			<AppLayout>
				<Head>
					<title>내 프로필 | NodeBird</title>
				</Head>
				{userInfo ? (
					<Card
						actions={[
							<div key='twit'>
								짹짹
								<br />
								{userInfo.Posts}
							</div>,
							<div key='following'>
								팔로잉
								<br />
								{userInfo.Followings}
							</div>,
							<div key='follower'>
								팔로워
								<br />
								{userInfo.Followers}
							</div>,
						]}
					>
						<Card.Meta
							avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
							title={userInfo.nickname}
							description='노드버드 매니아'
						/>
					</Card>
				) : null}
				{/* 특정 사용자 정보(userInfo)가 SSR이 안되면 null로 텅빈페이지가 나온다. */}
			</AppLayout>
		</>
	);
};

export const getStaticProps = wrapper.getStaticProps(
	(store) =>
		async ({ req }) => {
			store.dispatch({
				type: LOAD_USER_REQUEST,
				data: 1,
			});
			store.dispatch(END);
			await store.sagaTask.toPromise();
		}
);

export default About;
