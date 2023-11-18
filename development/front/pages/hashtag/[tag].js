import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import axios from 'axios';
import { loadHashtagPosts } from '../../reducers/postSlice';
import { loadMyInfo } from '../../reducers/userSlice';
import PostCard from '../../components/PostCard';
import wrapper from '../../store/configureStore';
import AppLayout from '../../components/AppLayout';

const Hashtag = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const { tag } = router.query;
	const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
		(state) => state.post
	);

	useEffect(() => {
		const onScroll = () => {
			if (
				window.scrollY + document.documentElement.clientHeight >
				document.documentElement.scrollHeight - 300
			) {
				if (hasMorePosts && !loadPostsLoading) {
					dispatch(
						loadHashtagPosts({
							data: tag,
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
	}, [mainPosts.length, hasMorePosts, tag, loadPostsLoading]);

	return (
		<AppLayout>
			{mainPosts.map((c) => (
				<PostCard key={c.id} post={c} />
			))}
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
			await store.dispatch(loadHashtagPosts({ data: params.tag }));
			await store.dispatch(loadMyInfo());
			return {
				props: {},
			};
		}
);

export default Hashtag;
