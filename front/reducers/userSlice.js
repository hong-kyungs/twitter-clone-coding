import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { HYDRATE } from 'next-redux-wrapper';

export const initialState = {
	// isLoggingIn: false, //로그인 시도중
	// isLoggedIn: false,
	// isLoggingOut: false, //로그아웃 시도중
	// 한국인이 이해하기 쉬운 이름으로..
	loadMyInfoLoading: false, // 내 정보 가져오기 시도중
	loadMyInfoDone: false,
	loadMyInfoError: null,
	loadUserLoading: false, // 유저(다른 사람)정보 가져오기 시도중
	loadUserDone: false,
	loadUserError: null,
	logInLoading: false, // 로그인 시도중
	logInDone: false,
	logInError: null,
	logOutLoading: false, //로그아웃 시도중
	logOutDone: false,
	logOutError: null,
	followLoading: false, //팔로우 시도중
	followDone: false,
	followError: null,
	unfollowLoading: false, //언팔로우 시도중
	unfollowDone: false,
	unfollowError: null,
	signUpLoading: false, //회원가입 시도중
	signUpDone: false,
	signUpError: null,
	changeNicknameLoading: false, //닉네임 변경 시도중
	changeNicknameDone: false,
	changeNicknameError: null,
	loadFollowersLoading: false, //팔로우 목록 불러오기 시도중
	loadFollowersDone: false,
	loadFollowersError: null,
	loadFollowingsLoading: false, //팔로잉 목록 불러오기 시도중
	loadFollowingsDone: false,
	loadFollowingsError: null,
	removeFollowerLoading: false, //팔로워 차단/삭제 시도중
	removeFollowerDone: false,
	removeFollowerError: null,
	addPostToMeLoading: false, //팔로워 차단/삭제 시도중
	addPostToMeDone: false,
	addPostToMeError: null,
	me: null,
	userInfo: null,
};

const dummyUser = (data) => ({
	...data, // 이메일과 비밀번호가 들어옴
	nickname: 'JennyCho',
	id: 1,
	Posts: [{ id: 1 }],
	Followings: [
		{ nickname: 'Soo' },
		{ nickname: 'Jimin' },
		{ nickname: 'Justin' },
	],
	Followers: [
		{ nickname: 'Soo' },
		{ nickname: 'Jimin' },
		{ nickname: 'Justin' },
	],
});

export const logIn = createAsyncThunk(
	'user/logIn',
	async (data, { rejectWithValue }) => {
		try {
			const response = await axios.post('/user/login', data);
			return response.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const logOut = createAsyncThunk('user/logOut', async () => {
	const response = await axios.post('/user/logout');
	return response.data;
});

export const follow = createAsyncThunk('user/follow', async (data) => {
	const response = await axios.patch(`/user/${data}/follow`);
	return response.data;
});

export const unfollow = createAsyncThunk('user/unfollow', async (data) => {
	const response = await axios.delete(`/user/${data}/follow`);
	return response.data;
});

export const signUp = createAsyncThunk(
	'user/signUp',
	async (data, { rejectWithValue }) => {
		try {
			const response = await axios.post('/user', data);
			return response.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const loadMyInfo = createAsyncThunk('user/loadMyInfo', async () => {
	const response = await axios.get('/user');
	return response.data;
});

export const changeNickname = createAsyncThunk(
	'user/changeNickname',
	async (data) => {
		const response = await axios.patch('/user/nickname', { nickname: data });
		return response.data;
	}
);

export const loadFollowers = createAsyncThunk(
	'user/loadFollowers',
	async () => {
		const response = await axios.get('/user/followers');
		return response.data;
	}
);

export const loadFollowings = createAsyncThunk(
	'user/loadFollowings',
	async () => {
		const response = await axios.get('/user/followings');
		return response.data;
	}
);

export const removeFollower = createAsyncThunk(
	'user/removeFollower',
	async (data) => {
		const response = await axios.delete(`/user/follower/${data}`);
		return response.data;
	}
);

export const loadUser = createAsyncThunk(
	'user/loadUser',
	async (data, { rejectWithValue }) => {
		try {
			const response = await axios.get(`/user/${data}`);
			return response.data;
		} catch (err) {
			return rejectWithValue(err.response.data);
		}
	}
);

export const addPostToMe = createAsyncThunk('/user/addPost', async (lastId) => {
	const response = await axios.patch(`/user/post/${lastId}`);
	return response.data;
});

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		// addPostToMe(state, action) {
		// 	state.me.Posts.unshift({ id: action.payload });
		// },
		removePostOfMe(state, action) {
			state.me.Posts = state.me.Posts.filter((v) => v.id !== action.payload);
		},
	},
	extraReducers: (builder) =>
		builder
			.addCase(HYDRATE, (state, action) => ({
				...state,
				...action.payload.user,
			}))
			.addCase(addPostToMe.pending, (state) => {
				state.addPostToMeLoading = true;
				state.addPostToMeDone = false;
				state.addPostToMeError = null;
			})
			.addCase(addPostToMe.fulfilled, (state, action) => {
				state.addPostToMeLoading = false;
				state.addPostToMeDone = true;
				state.me.Posts.push({ id: action.payload.PostId });
			})
			.addCase(addPostToMe.rejected, (state, action) => {
				state.addPostToMeLoading = false;
				state.addPostToMeError = action.payload;
			})
			.addCase(logIn.pending, (state) => {
				state.logInLoading = true;
				state.logInDone = false;
				state.logInError = null;
			})
			.addCase(logIn.fulfilled, (state, action) => {
				state.logInLoading = false;
				state.logInDone = true;
				state.me = action.payload;
			})
			.addCase(logIn.rejected, (state, action) => {
				state.logInLoading = false;
				state.logInError = action.payload;
			})
			.addCase(logOut.pending, (state) => {
				state.logOutLoading = true;
				state.logOutDone = false;
				state.logOutError = null;
			})
			.addCase(logOut.fulfilled, (state) => {
				state.logOutLoading = false;
				state.logOutDone = true;
				state.me = null;
			})
			.addCase(logOut.rejected, (state, action) => {
				state.logOutLoading = false;
				state.logOutError = action.error;
			})
			.addCase(follow.pending, (state) => {
				state.followLoading = true;
				state.followDone = false;
				state.followError = null;
			})
			.addCase(follow.fulfilled, (state, action) => {
				state.followLoading = false;
				state.followDone = true;
				state.me.Followings.push({ id: action.payload.UserId });
			})
			.addCase(follow.rejected, (state, action) => {
				state.followLoading = false;
				state.followError = action.error;
			})
			.addCase(unfollow.pending, (state) => {
				state.unfollowLoading = true;
				state.unfollowDone = false;
				state.unfollowError = null;
			})
			.addCase(unfollow.fulfilled, (state, action) => {
				state.unfollowLoading = false;
				state.unfollowDone = true;
				state.me.Followings = state.me.Followings.filter(
					(v) => v.id !== action.payload.UserId
				);
			})
			.addCase(unfollow.rejected, (state, action) => {
				state.unfollowLoading = false;
				state.unfollowError = action.error;
			})
			.addCase(signUp.pending, (state) => {
				state.signUpLoading = true;
				state.signUpDone = false;
				state.signUpError = null;
			})
			.addCase(signUp.fulfilled, (state) => {
				state.signUpLoading = false;
				state.signUpDone = true;
			})
			.addCase(signUp.rejected, (state, action) => {
				state.signUpLoading = false;
				state.signUpError = action.payload;
			})
			.addCase(loadMyInfo.pending, (state) => {
				state.loadMyInfoLoading = true;
				state.loadMyInfoDone = false;
				state.loadMyInfoError = null;
			})
			.addCase(loadMyInfo.fulfilled, (state, action) => {
				state.loadMyInfoLoading = false;
				state.me = action.payload;
				state.loadMyInfoDone = true;
			})
			.addCase(loadMyInfo.rejected, (state, action) => {
				state.loadMyInfoLoading = false;
				state.loadMyInfoError = action.error;
			})
			.addCase(changeNickname.pending, (state) => {
				state.changeNicknameLoading = true;
				state.changeNicknameDone = false;
				state.changeNicknameError = null;
			})
			.addCase(changeNickname.fulfilled, (state, action) => {
				state.me.nickname = action.payload.nickname;
				state.changeNicknameLoading = false;
				state.changeNicknameDone = true;
			})
			.addCase(changeNickname.rejected, (state, action) => {
				state.changeNicknameLoading = false;
				state.changeNicknameError = action.error;
			})
			.addCase(loadFollowers.pending, (state) => {
				state.loadFollowersLoading = true;
				state.loadFollowersDone = false;
				state.loadFollowersError = null;
			})
			.addCase(loadFollowers.fulfilled, (state, action) => {
				state.loadFollowersLoading = false;
				state.me.Followers = action.payload;
				state.loadFollowersDone = true;
			})
			.addCase(loadFollowers.rejected, (state, action) => {
				state.loadFollowersLoading = false;
				state.loadFollowersError = action.error;
			})
			.addCase(loadFollowings.pending, (state) => {
				state.loadFollowingsLoading = true;
				state.loadFollowingsDone = false;
				state.loadFollowingsError = null;
			})
			.addCase(loadFollowings.fulfilled, (state, action) => {
				state.loadFollowingsLoading = false;
				state.me.Followings = action.payload;
				state.loadFollowingsDone = true;
			})
			.addCase(loadFollowings.rejected, (state, action) => {
				state.loadFollowingsLoading = false;
				state.loadFollowingsError = action.error;
			})
			.addCase(removeFollower.pending, (state) => {
				state.removeFollowerLoading = true;
				state.removeFollowerDone = false;
				state.removeFollowerError = null;
			})
			.addCase(removeFollower.fulfilled, (state, action) => {
				state.removeFollowerLoading = false;
				state.me.Followers = state.me.Followers.filter(
					(v) => v.id !== action.payload.UserId
				);
				state.removeFollowerDone = true;
			})
			.addCase(removeFollower.rejected, (state, action) => {
				state.removeFollowerLoading = false;
				state.removeFollowerError = action.error;
			})
			.addCase(loadUser.pending, (state) => {
				state.loadUserLoading = true;
				state.loadUserDone = false;
				state.loadUserError = null;
			})
			.addCase(loadUser.fulfilled, (state, action) => {
				state.loadUserLoading = false;
				state.userInfo = action.payload;
				state.loadUserDone = true;
			})
			.addCase(loadUser.rejected, (state, action) => {
				state.loadUserLoading = false;
				state.loadUserError = action.payload;
			}),
});

export default userSlice;
