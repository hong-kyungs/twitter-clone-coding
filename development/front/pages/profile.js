import React, { useEffect } from 'react';
import Head from 'next/head';
import Router from 'next/router';
import axios from 'axios';

import AppLayout from '../components/AppLayout';
import NicknameEditForm from '../components/NicknameEditForm';
import FollowList from '../components/FollowList';
import { useSelector } from 'react-redux';
import wrapper from '../store/configureStore';
import { loadMyInfo } from '../reducers/userSlice';

const Profile = () => {
	const { me } = useSelector((state) => state.user);

	//로그아웃 할 경우 - 메인페이지로 보내기
	useEffect(() => {
		if (!(me && me.id)) {
			Router.push('/');
		}
	}, [me && me.id]);

	//로그인 하지 않으면, 프로필에 아무일도 일어나지 않게하기
	if (!me) {
		return '내 정보 로딩중...';
	}

	return (
		<>
			<Head>
				<title>내 프로필 | NodeBird</title>
			</Head>
			<AppLayout>
				<NicknameEditForm />
				<FollowList header='팔로잉' />
				<FollowList header='팔로워' />
			</AppLayout>
		</>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async ({ req }) => {
			console.log('getServerSideProps start');
			console.log(req.headers);
			const cookie = req ? req.headers.cookie : '';
			axios.defaults.headers.Cookie = '';
			if (req && cookie) {
				axios.defaults.headers.Cookie = cookie;
			}
			await store.dispatch(loadMyInfo());
			return {
				props: {},
			};
			// store.dispatch(END);
			// await store.sagaTask.toPromise();
		}
);

export default Profile;
