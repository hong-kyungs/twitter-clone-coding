import produce from '../utill/produce';

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
	me: null,
	userInfo: null,
};

export const LOAD_MY_INFO_REQUEST = 'LOAD_MY_INFO_REQUEST';
export const LOAD_MY_INFO_SUCCESS = 'LOAD_MY_INFO_SUCCESS';
export const LOAD_MY_INFO_FAILURE = 'LOAD_MY_INFO_FAILURE';

export const LOAD_USER_REQUEST = 'LOAD_USER_REQUEST';
export const LOAD_USER_SUCCESS = 'LOAD_USER_SUCCESS';
export const LOAD_USER_FAILURE = 'LOAD_USER_FAILURE';

export const LOG_IN_REQUEST = 'LOG_IN_REQUEST';
export const LOG_IN_SUCCESS = 'LOG_IN_SUCCESS';
export const LOG_IN_FAILURE = 'LOG_IN_FAILURE';

export const LOG_OUT_REQUEST = 'LOG_OUT_REQUEST';
export const LOG_OUT_SUCCESS = 'LOG_OUT_SUCCESS';
export const LOG_OUT_FAILURE = 'LOG_OUT_FAILURE';

export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';

export const CHANGE_NICKNAME_REQUEST = 'CHANGE_NICKNAME_REQUEST';
export const CHANGE_NICKNAME_SUCCESS = 'CHANGE_NICKNAME_SUCCESS';
export const CHANGE_NICKNAME_FAILURE = 'CHANGE_NICKNAME_FAILURE';

export const FOLLOW_REQUEST = 'FOLLOW_REQUEST';
export const FOLLOW_SUCCESS = 'FOLLOW_SUCCESS';
export const FOLLOW_FAILURE = 'FOLLOW_FAILURE';

export const UNFOLLOW_REQUEST = 'UNFOLLOW_REQUEST';
export const UNFOLLOW_SUCCESS = 'UNFOLLOW_SUCCESS';
export const UNFOLLOW_FAILURE = 'UNFOLLOW_FAILURE';

export const REMOVE_FOLLOWER_REQUEST = 'REMOVE_FOLLOWER_REQUEST';
export const REMOVE_FOLLOWER_SUCCESS = 'REMOVE_FOLLOWER_SUCCESS';
export const REMOVE_FOLLOWER_FAILURE = 'REMOVE_FOLLOWER_FAILURE';

export const LOAD_FOLLOWERS_REQUEST = 'LOAD_FOLLOWERS_REQUEST';
export const LOAD_FOLLOWERS_SUCCESS = 'LOAD_FOLLOWERS_SUCCESS';
export const LOAD_FOLLOWERS_FAILURE = 'LOAD_FOLLOWERS_FAILURE';

export const LOAD_FOLLOWINGS_REQUEST = 'LOAD_FOLLOWINGS_REQUEST';
export const LOAD_FOLLOWINGS_SUCCESS = 'LOAD_FOLLOWINGS_SUCCESS';
export const LOAD_FOLLOWINGS_FAILURE = 'LOAD_FOLLOWINGS_FAILURE';

export const ADD_POST_TO_ME = 'ADD_POST_TO_ME';
export const REMOVE_POST_OF_ME = 'REMOVE_POST_OF_ME';

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
//action creator
export const loginRequestAction = (data) => {
	return {
		type: LOG_IN_REQUEST,
		data,
	};
};

export const logoutRequestAction = () => {
	return {
		type: LOG_OUT_REQUEST,
	};
};

//(이전상태, 액션) => 다음상태
//리듀서는 이전상태와 액션을 받아서 다음상태를 만들어내는 함수
const reducer = (state = initialState, action) => {
	return produce(state, (draft) => {
		switch (action.type) {
			case REMOVE_FOLLOWER_REQUEST:
				draft.removeFollowerLoading = true;
				draft.removeFollowerDone = false;
				draft.removeFollowerError = null;
				break;
			case REMOVE_FOLLOWER_SUCCESS:
				draft.removeFollowerLoading = false;
				draft.me.Followers = draft.me.Followers.filter(
					(v) => v.id !== action.data.UserId
				);
				draft.removeFollowerDone = true;
				break;
			case REMOVE_FOLLOWER_FAILURE:
				draft.removeFollowerLoading = false;
				draft.removeFollowerError = action.error;
				break;

			case LOAD_FOLLOWERS_REQUEST:
				draft.loadFollowersLoading = true;
				draft.loadFollowersDone = false;
				draft.loadFollowersError = null;
				break;
			case LOAD_FOLLOWERS_SUCCESS:
				draft.loadFollowersLoading = false;
				draft.me.Followers = action.data;
				draft.loadFollowersDone = true;
				break;
			case LOAD_FOLLOWERS_FAILURE:
				draft.loadFollowersLoading = false;
				draft.loadFollowersError = action.error;
				break;

			case LOAD_FOLLOWINGS_REQUEST:
				draft.loadFollowingsLoading = true;
				draft.loadFollowingsDone = false;
				draft.loadFollowingsError = null;
				break;
			case LOAD_FOLLOWINGS_SUCCESS:
				draft.loadFollowingsLoading = false;
				draft.me.Followings = action.data;
				draft.loadFollowingsDone = true;
				break;
			case LOAD_FOLLOWINGS_FAILURE:
				draft.loadFollowingsLoading = false;
				draft.loadFollowingsError = action.error;
				break;

			case LOAD_MY_INFO_REQUEST:
				draft.loadMyInfoLoading = true;
				draft.loadMyInfoDone = false;
				draft.loadMyInfoError = null;
				break;
			case LOAD_MY_INFO_SUCCESS:
				draft.loadMyInfoLoading = false;
				draft.me = action.data;
				draft.loadMyInfoDone = true;
				break;
			case LOAD_MY_INFO_FAILURE:
				draft.loadMyInfoLoading = false;
				draft.loadMyInfoError = action.error;
				break;

			case LOAD_USER_REQUEST:
				draft.loadUserLoading = true;
				draft.loadUserDone = false;
				draft.loadUserError = null;
				break;
			case LOAD_USER_SUCCESS:
				draft.loadUserLoading = false;
				draft.userInfo = action.data;
				draft.loadUserDone = true;
				break;
			case LOAD_USER_FAILURE:
				draft.loadUserLoading = false;
				draft.loadUserError = action.error;
				break;

			case LOG_IN_REQUEST:
				draft.logInLoading = true;
				draft.logInDone = false;
				draft.logInError = null;
				break;
			case LOG_IN_SUCCESS:
				draft.logInLoading = false;
				draft.logInDone = true;
				draft.me = action.data;
				break;
			case LOG_IN_FAILURE:
				draft.logInLoading = false;
				draft.logInError = action.error;
				break;

			case LOG_OUT_REQUEST:
				draft.logOutLoading = true;
				draft.logOutDone = false;
				draft.logOutError = null;
				break;
			case LOG_OUT_SUCCESS:
				draft.logOutLoading = false;
				draft.logOutDone = true;
				draft.me = null;
				break;
			case LOG_OUT_FAILURE:
				draft.logOutLoading = false;
				draft.logOutError = action.error;
				break;

			case FOLLOW_REQUEST:
				draft.followLoading = true;
				draft.followDone = false;
				draft.followError = null;
				break;
			case FOLLOW_SUCCESS:
				draft.followLoading = false;
				draft.followDone = true;
				draft.me.Followings.push({ id: action.data.UserId });
				break;
			case FOLLOW_FAILURE:
				draft.followLoading = false;
				draft.followError = action.error;
				break;

			case UNFOLLOW_REQUEST:
				draft.unfollowLoading = true;
				draft.unfollowDone = false;
				draft.unfollowError = null;
				break;
			case UNFOLLOW_SUCCESS:
				draft.unfollowLoading = false;
				draft.unfollowDone = true;
				draft.me.Followings = draft.me.Followings.filter(
					(v) => v.id !== action.data.UserId
				);
				break;
			case UNFOLLOW_FAILURE:
				draft.unfollowLoading = false;
				draft.unfollowError = action.error;
				break;

			case SIGN_UP_REQUEST:
				draft.signUpLoading = true;
				draft.signUpDone = false;
				draft.signUpError = null;
				break;
			case SIGN_UP_SUCCESS:
				draft.signUpLoading = false;
				draft.signUpDone = true;
				break;
			case SIGN_UP_FAILURE:
				draft.signUpLoading = false;
				draft.signUpError = action.error;
				break;

			case CHANGE_NICKNAME_REQUEST:
				draft.changeNicknameLoading = true;
				draft.changeNicknameDone = false;
				draft.changeNicknameError = null;
				break;
			case CHANGE_NICKNAME_SUCCESS:
				draft.me.nickname = action.data.nickname;
				draft.changeNicknameLoading = false;
				draft.changeNicknameDone = true;
				break;
			case CHANGE_NICKNAME_FAILURE:
				draft.changeNicknameLoading = false;
				draft.changeNicknameError = action.error;
				break;

			case ADD_POST_TO_ME:
				draft.me.Posts.unshift({ id: action.data });
				break;
			// return {
			// 	...state,
			// 	me: {
			// 		...state.me,
			// 		Posts: [{ id: action.data }, ...state.me.Posts],
			// 	},
			// };
			case REMOVE_POST_OF_ME:
				draft.me.Posts = draft.me.Posts.filter((v) => v.id !== action.data);
				break;
			// return {
			// 	...state,
			// 	me: {
			// 		...state.me,
			// 		//filter로 id값이 같지 않으면 남겨두고, 같으면 지운다.
			// 		Posts: state.me.Posts.filter((v) => v.id !== action.data),
			// 	},
			// };
			default:
				break;
		}
	});
};

// const reducer = (state = initialState, action) => {
// 	switch (action.type) {
// 		case LOG_IN_REQUEST:
// 			console.log('reducer login');
// 			return {
// 				...state,
// 				logInLoading: true,
// 				logInDone: false,
// 				logInError: null, //로딩할떄 에러는 없어준다.
// 			};
// 		case LOG_IN_SUCCESS:
// 			return {
// 				...state,
// 				logInLoading: false,
// 				logInDone: true,
// 				me: dummyUser(action.data),
// 			};
// 		case LOG_IN_FAILURE:
// 			return {
// 				...state,
// 				logInLoading: false,
// 				logInError: action.error,
// 			};
// 		case LOG_OUT_REQUEST:
// 			return {
// 				...state,
// 				logOutLoading: true,
// 				logOutDone: false,
// 				logOutError: null,
// 			};
// 		case LOG_OUT_SUCCESS:
// 			return {
// 				...state,
// 				logOutLoading: false,
// 				logOutDone: true,
// 				me: null,
// 			};
// 		case LOG_OUT_FAILURE:
// 			return {
// 				...state,
// 				logOutLoading: false,
// 				logOutError: action.error,
// 				me: null,
// 			};

// 		case SIGN_UP_REQUEST:
// 			return {
// 				...state,
// 				signUpLoading: true,
// 				signUpDone: false,
// 				signUpError: null,
// 			};
// 		case SIGN_UP_SUCCESS:
// 			return {
// 				...state,
// 				signUpLoading: false,
// 				signUpDone: true,
// 			};
// 		case SIGN_UP_FAILURE:
// 			return {
// 				...state,
// 				signUpLoading: false,
// 				signUpError: action.error,
// 			};

// 		case CHANGE_NICKNAME_REQUEST:
// 			return {
// 				...state,
// 				changeNicknameLoading: true,
// 				changeNicknameDone: false,
// 				changeNicknameError: null,
// 			};
// 		case CHANGE_NICKNAME_SUCCESS:
// 			return {
// 				...state,
// 				changeNicknameLoading: false,
// 				changeNicknameDone: true,
// 			};
// 		case CHANGE_NICKNAME_FAILURE:
// 			return {
// 				...state,
// 				changeNicknameLoading: false,
// 				changeNicknameError: action.error,
// 			};
// 		case ADD_POST_TO_ME:
// 			return {
// 				...state,
// 				me: {
// 					...state.me,
// 					Posts: [{ id: action.data }, ...state.me.Posts],
// 				},
// 			};
// 		case REMOVE_POST_OF_ME:
// 			return {
// 				...state,
// 				me: {
// 					...state.me,
// 					//filter로 id값이 같지 않으면 남겨두고, 같으면 지운다.
// 					Posts: state.me.Posts.filter((v) => v.id !== action.data),
// 				},
// 			};
// 		default:
// 			return state;
// 	}
// };

export default reducer;
