import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import wrapper from '../store/configureStore';
import { loadPosts } from '../reducers/postSlice';
import { loadMyInfo } from '../reducers/userSlice';

const Home = () => {
	const dispatch = useDispatch();
	const { me } = useSelector((state) => state.user);
	const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } =
		useSelector((state) => state.post);

	//리트윗 에러시 alert로 알려주기
	//PostCard에 넣으면 게시글수만큼 리렌더링이 되기 때문에 한번만 보여주기 위해 상위로 끌어올림.
	useEffect(() => {
		if (retweetError) {
			alert(retweetError);
		}
	}, [retweetError]);

	useEffect(() => {
		function onScroll() {
			if (
				window.scrollY + document.documentElement.clientHeight >
				document.documentElement.scrollHeight - 300
			) {
				if (hasMorePosts && !loadPostsLoading) {
					const lastId = mainPosts[mainPosts.length - 1]?.id; // 마지막 게시글의 아이디를 보내준다.
					dispatch(loadPosts(lastId));
				}
			}
		}
		//useEffect에서 accEventListener를 쓰면 항상 리턴으로 remove해야한다.
		//그렇지 않으면 메모리에 계속 쌓여있다.
		window.addEventListener('scroll', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
		};
	}, [hasMorePosts, loadPostsLoading, mainPosts]);

	return (
		<AppLayout>
			{/* 로그인한 사람에게 게시글작성 보여주기 */}
			{me && <PostForm />}
			{mainPosts.map((post) => (
				<PostCard key={post.id} post={post} />
			))}
		</AppLayout>
	);
};

//Home 화면을 그려주기 전에 서버에서 먼저 실행된다. 반드시 Home보다 먼저 실행되어야 data를 채우고 화면에 그려진다.
export const getServerSideProps = wrapper.getServerSideProps(
	// store에서 만들어둔 wrapper를 불러온다.
	(store) =>
		async ({ req }) => {
			//cookie를 안보내주면 로그인 정보가 백엔드서버로 안넘어가고, 쿠키를 바로 넣어주면 모든 서버에 공유되서
			//다른 사람도 내 정보로 로그인 되어버릴수 있다.
			//프론트에서 cookie가 공유되는 문제해결방법? -> cookie를 지웠다가 넣는 과정으로 해결
			const cookie = req ? req.headers.cookie : '';
			axios.defaults.headers.Cookie = '';
			if (req && cookie) {
				axios.defaults.headers.Cookie = cookie;
			}

			//화면 초기 로딩
			//로그인 상태 복구 - 새로고침해도 로그인이 남아있도록
			await store.dispatch(loadMyInfo());
			//화면 초기 로딩 - 화면을 로딩하면 LOAD_POSTS_REQUEST를  바로 호출해준다.
			await store.dispatch(loadPosts());

			/*
			store.dispatch(END); // 1. 위의 두 request(로그인 상태 복구, 화면 초기 로딩)이 success 될떄까지
			await store.sagaTask.toPromise(); // 2. 기다린다. sagaTask는 store에 등록해둔 store.sagatask
			*/
		}
);

export default Home;
