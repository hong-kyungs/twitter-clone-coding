import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Card } from 'antd';
import Head from 'next/head';
import { useRouter } from 'next/router';

import axios from 'axios';
import { loadUserPosts } from '../../reducers/postSlice';
import { loadMyInfo, loadUser } from '../../reducers/userSlice';
import PostCard from '../../components/PostCard';
import wrapper from '../../store/configureStore';
import AppLayout from '../../components/AppLayout';

const User = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { id } = router.query; //그 사용자의 id를 받아와서 그 사용자의 게시글만 가져온다.
	const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
		(state) => state.post
	);
	const { userInfo, me } = useSelector((state) => state.user);

	useEffect(() => {
		const onScroll = () => {
			if (
				window.scrollY + document.documentElement.clientHeight >
				document.documentElement.scrollHeight - 300
			) {
				if (hasMorePosts && !loadPostsLoading) {
					dispatch(
						loadUserPosts({
							data: id,
							lastId:
								mainPosts[mainPosts.length - 1] &&
								mainPosts[mainPosts.length - 1].id,
						})
					);
				}
			}
		};
		window.addEventListener('scroll', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	}, [mainPosts.length, hasMorePosts, id, loadPostsLoading]);

	return (
		<AppLayout>
			{userInfo && (
				<Head>
					<title>
						{userInfo.nickname}
						님의 글
					</title>
					<meta
						name='description'
						content={`${userInfo.nickname}님의 게시글`}
					/>
					<meta
						property='og:title'
						content={`${userInfo.nickname}님의 게시글`}
					/>
					<meta
						property='og:description'
						content={`${userInfo.nickname}님의 게시글`}
					/>
					<meta
						property='og:image'
						content='https://nodebird.com/favicon.ico'
					/>
					<meta property='og:url' content={`https://nodebird.com/user/${id}`} />
				</Head>
			)}
			{userInfo && userInfo.id !== me?.id ? (
				<Card
					style={{ marginBottom: 20 }}
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
					/>
				</Card>
			) : null}
			{mainPosts
				? mainPosts.map((post) => <PostCard key={post.id} post={post} />)
				: null}
		</AppLayout>
	);
};

export const getServerSideProps = wrapper.getServerSideProps(
	(store) =>
		async ({ req, params }) => {
			const cookie = req ? req.headers.cookie : '';
			axios.defaults.headers.Cookie = '';
			if (req && cookie) {
				axios.defaults.headers.Cookie = cookie;
			}
			await store.dispatch(loadUserPosts({ data: params.id }));
			await store.dispatch(loadMyInfo());
			await store.dispatch(loadUser(params.id));
			return {
				props: {},
			};
		}
);

export default User;
