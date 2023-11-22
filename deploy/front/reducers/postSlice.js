import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { HYDRATE } from 'next-redux-wrapper';

export const initialState = {
	mainPosts: [],
	singlePost: null,
	imagePaths: [],
	hasMorePosts: true,
	likePostLoading: false,
	likePostDone: false,
	likePostError: null,
	unlikePostLoading: false,
	unlikePostDone: false,
	unlikePostError: null,
	loadPostLoading: false,
	loadPostDone: false,
	loadPostError: null,
	loadPostsLoading: false,
	loadPostsDone: false,
	loadPostsError: null,
	addPostLoading: false,
	addPostDone: false,
	addPostError: null,
	removePostLoading: false,
	removePostDone: false,
	removePostError: null,
	addCommentLoading: false,
	addCommentDone: false,
	addCommentError: null,
	uploadImagesLoading: false,
	uploadImagesDone: false,
	uploadImagesError: null,
	retweetLoading: false,
	retweetDone: false,
	retweetError: null,
	updatePostLoading: false,
	updatePostDone: false,
	updatePostError: null,
};

export const addPost = createAsyncThunk('post/addPost', async (data) => {
	//addPostToMe는 아직 못넣음.
	const response = await axios.post('/post', data);
	return response.data;
});

export const removePost = createAsyncThunk('post/removePost', async (data) => {
	//RemovePostOfMe는 아직 못넣음.
	const response = await axios.delete(`/post/${data}`);
	return response.data;
});

export const loadPosts = createAsyncThunk('post/loadPosts', async (lastId) => {
	const response = await axios.get(`/posts?lastId=${lastId || 0}`);
	return response.data;
});

export const addComment = createAsyncThunk(
	'post/addComment',
	async (data, { rejectWithValue }) => {
		try {
			const response = await axios.post(`/post/${data.postId}/comment`, data);
			return response.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const likePost = createAsyncThunk('post/likePost', async (data) => {
	const response = await axios.patch(`/post/${data}/like`);
	return response.data;
});

export const unlikePost = createAsyncThunk('post/unlikePost', async (data) => {
	const response = await axios.delete(`/post/${data}/like`);
	return response.data;
});

export const uploadImages = createAsyncThunk(
	'post/uploadImages',
	async (data) => {
		const response = await axios.post('/post/images', data);
		return response.data;
	}
);

export const retweet = createAsyncThunk(
	'post/retweet',
	async (data, { rejectWithValue }) => {
		try {
			const response = await axios.post(`/post/${data}/retweet`);
			return response.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const loadPost = createAsyncThunk(
	'post/loadPost',
	async (data, { rejectWithValue }) => {
		try {
			const response = await axios.get(`/post/${data}`);
			return response.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const loadUserPosts = createAsyncThunk(
	'post/loadUserPosts',
	async ({ data, lastId }) => {
		const response = await axios.get(
			`/user/${data}/posts?lastId=${lastId || 0}`
		);
		return response.data;
	}
);

export const loadHashtagPosts = createAsyncThunk(
	'post/loadHashtagPosts',
	async ({ data, lastId }) => {
		const response = await axios.get(
			`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`
		);
		return response.data;
	}
);

export const updatePost = createAsyncThunk('post/updatePost', async (data) => {
	const response = await axios.patch(`/post/${data.PostId}`, data);
	return response.data;
});

const postSlice = createSlice({
	name: 'post',
	initialState,
	reducers: {
		removeImage(state, action) {
			state.imagePaths = state.imagePaths.filter(
				(v, i) => i !== action.payload
			);
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(HYDRATE, (state, action) => ({
				...state,
				...action.payload.post,
			}))
			.addCase(addPost.pending, (state) => {
				state.addPostLoading = true;
				state.addPostDone = false;
				state.addPostError = null;
			})
			.addCase(addPost.fulfilled, (state, action) => {
				state.addPostLoading = false;
				state.addPostDone = true;
				state.mainPosts.unshift(action.payload);
				state.imagePaths = [];
			})
			.addCase(addPost.rejected, (state, action) => {
				state.addPostLoading = false;
				state.addPostError = action.error;
			})
			.addCase(removePost.pending, (state) => {
				state.removePostLoading = true;
				state.removePostDone = false;
				state.removePostError = null;
			})
			.addCase(removePost.fulfilled, (state, action) => {
				state.removePostLoading = false;
				state.removePostDone = true;
				state.mainPosts = state.mainPosts.filter(
					(v) => v.id !== action.payload.PostId
				);
			})
			.addCase(removePost.rejected, (state, action) => {
				state.removePostLoading = false;
				state.removePostError = action.error;
			})
			.addCase(loadPosts.pending, (state) => {
				state.loadPostsLoading = true;
				state.loadPostsDone = false;
				state.loadPostsError = null;
			})
			.addCase(loadPosts.fulfilled, (state, action) => {
				state.loadPostsLoading = false;
				state.loadPostsDone = true;
				state.mainPosts = state.mainPosts.concat(action.payload);
				state.hasMorePosts = action.payload.length === 10;
			})
			.addCase(loadPosts.rejected, (state, action) => {
				state.loadPostsLoading = false;
				state.loadPostsError = action.error;
			})
			.addCase(addComment.pending, (state) => {
				state.addCommentLoading = true;
				state.addCommentDone = false;
				state.addCommentError = null;
			})
			.addCase(addComment.fulfilled, (state, action) => {
				const post = state.mainPosts.find(
					(v) => v.id === action.payload.PostId
				); //게시글 찾고
				post.Comments.unshift(action.payload); //댓글추가
				state.addCommentLoading = false;
				state.addCommentDone = true;
			})
			.addCase(addComment.rejected, (state, action) => {
				state.addCommentLoading = false;
				state.addCommentError = action.payload;
			})
			.addCase(likePost.pending, (state) => {
				state.likePostLoading = true;
				state.likePostDone = false;
				state.likePostError = null;
			})
			.addCase(likePost.fulfilled, (state, action) => {
				const post = state.mainPosts.find(
					(v) => v.id === action.payload.PostId
				);
				post.Likers.push({ id: action.payload.UserId });
				state.likePostLoading = false;
				state.likePostDone = true;
			})
			.addCase(likePost.rejected, (state, action) => {
				state.likePostLoading = false;
				state.likePostError = action.error;
			})
			.addCase(unlikePost.pending, (state) => {
				state.unlikePostLoading = true;
				state.unlikePostDone = false;
				state.unlikePostError = null;
			})
			.addCase(unlikePost.fulfilled, (state, action) => {
				const post = state.mainPosts.find(
					(v) => v.id === action.payload.PostId
				);
				post.Likers = post.Likers.filter((v) => v.id !== action.payload.UserId);
				state.unlikePostLoading = false;
				state.unlikePostDone = true;
			})
			.addCase(unlikePost.rejected, (state, action) => {
				state.unlikePostLoading = false;
				state.unlikePostError = action.err;
			})
			.addCase(uploadImages.pending, (state) => {
				state.uploadImagesLoading = true;
				state.uploadImagesDone = false;
				state.uploadImagesError = null;
			})
			.addCase(uploadImages.fulfilled, (state, action) => {
				state.uploadImagesLoading = false;
				state.uploadImagesDone = true;
				state.imagePaths = state.imagePaths.concat(action.payload);
			})
			.addCase(uploadImages.rejected, (state, action) => {
				state.uploadImagesLoading = false;
				state.uploadImagesError = action.error;
			})
			.addCase(retweet.pending, (state) => {
				state.retweetLoading = true;
				state.retweetDone = false;
				state.retweetError = null;
			})
			.addCase(retweet.fulfilled, (state, action) => {
				state.retweetLoading = false;
				state.retweetDone = true;
				state.mainPosts.unshift(action.payload);
			})
			.addCase(retweet.rejected, (state, action) => {
				state.retweetLoading = false;
				state.retweetError = action.payload;
			})
			.addCase(loadPost.pending, (state) => {
				state.loadPostLoading = true;
				state.loadPostDone = false;
				state.loadPostError = null;
			})
			.addCase(loadPost.fulfilled, (state, action) => {
				state.loadPostLoading = false;
				state.loadPostDone = true;
				state.singlePost = action.payload; //선택된 하나의 게시글이 singlePost에 저장하도록 한다.
			})
			.addCase(loadPost.rejected, (state, action) => {
				state.loadPostLoading = false;
				state.loadPostError = action.payload;
			})
			.addCase(loadUserPosts.pending, (state) => {
				state.loadPostsLoading = true;
				state.loadPostsDone = false;
				state.loadPostsError = null;
			})
			.addCase(loadUserPosts.fulfilled, (state, action) => {
				state.loadPostsLoading = false;
				state.loadPostsDone = true;
				state.mainPosts = state.mainPosts.concat(action.payload);
				state.hasMorePosts = action.payload.length === 10;
			})
			.addCase(loadUserPosts.rejected, (state, action) => {
				state.loadPostsLoading = false;
				state.loadPostsError = action.error;
			})
			.addCase(loadHashtagPosts.pending, (state) => {
				state.loadPostsLoading = true;
				state.loadPostsDone = false;
				state.loadPostsError = null;
			})
			.addCase(loadHashtagPosts.fulfilled, (state, action) => {
				state.loadPostsLoading = false;
				state.loadPostsDone = true;
				state.mainPosts = state.mainPosts.concat(action.payload);
				state.hasMorePosts = action.payload.length === 10;
			})
			.addCase(loadHashtagPosts.rejected, (state, action) => {
				state.loadPostsLoading = false;
				state.loadPostsError = action.error;
			})
			.addCase(updatePost.pending, (state) => {
				state.updatePostLoading = true;
				state.updatePostDone = false;
				state.updatePostError = null;
			})
			.addCase(updatePost.fulfilled, (state, action) => {
				state.updatePostLoading = false;
				state.updatePostDone = true;
				state.mainPosts.find((v) => v.id === action.payload.PostId).content =
					action.payload.content;
			})
			.addCase(updatePost.rejected, (state, action) => {
				state.updatePostLoading = false;
				state.updatePostError = action.error;
			}),
});

export const everyPosts = (state) => state.post.mainPosts;
export default postSlice;
