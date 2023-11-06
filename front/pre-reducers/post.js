import shortId from 'shortid';
import produce from '../utill/produce';

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
};

// 실제 서버가 있어서 더이상 더미포스트가 필요 없어짐
// export const generateDummyPost = (number) =>
// 	Array(number)
// 		.fill()
// 		.map(() => ({
// 			id: shortId.generate(),
// 			User: {
// 				id: shortId.generate(),
// 				nickname: faker.name.findName(),
// 			},
// 			content: faker.lorem.paragraph(),
// 			Images: [
// 				{
// 					src: faker.image.image(),
// 				},
// 			],
// 			Comments: [
// 				{
// 					User: {
// 						id: shortId.generate(),
// 						nickname: faker.name.findName(),
// 					},
// 					content: faker.lorem.paragraph(),
// 				},
// 			],
// 		}));

// initialState.mainPosts = initialState.mainPosts.concat(
// 	Array(20)
// 		.fill()
// 		.map(() => ({
// 			id: shortId.generate(),
// 			User: {
// 				id: shortId.generate(),
// 				nickname: faker.name.findName(),
// 			},
// 			content: faker.lorem.paragraph(),
// 			Images: [
// 				{
// 					src: faker.image.image(),
// 				},
// 			],
// 			Comments: [
// 				{
// 					User: {
// 						id: shortId.generate(),
// 						nickname: faker.name.findName(),
// 					},
// 					content: faker.lorem.paragraph(),
// 				},
// 			],
// 		}))
// );

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const LIKE_POST_REQUEST = 'LIKE_POST_REQUEST';
export const LIKE_POST_SUCCESS = 'LIKE_POST_SUCCESS';
export const LIKE_POST_FAILURE = 'LIKE_POST_FAILURE';

export const UNLIKE_POST_REQUEST = 'UNLIKE_POST_REQUEST';
export const UNLIKE_POST_SUCCESS = 'UNLIKE_POST_SUCCESS';
export const UNLIKE_POST_FAILURE = 'UNLIKE_POST_FAILURE';

export const LOAD_POST_REQUEST = 'LOAD_POST_REQUEST';
export const LOAD_POST_SUCCESS = 'LOAD_POST_SUCCESS';
export const LOAD_POST_FAILURE = 'LOAD_POST_FAILURE';

export const LOAD_USER_POSTS_REQUEST = 'LOAD_USER_POSTS_REQUEST';
export const LOAD_USER_POSTS_SUCCESS = 'LOAD_USER_POSTS_SUCCESS';
export const LOAD_USER_POSTS_FAILURE = 'LOAD_USER_POSTS_FAILURE';

export const LOAD_HASHTAG_POSTS_REQUEST = 'LOAD_HASHTAG_POSTS_REQUEST';
export const LOAD_HASHTAG_POSTS_SUCCESS = 'LOAD_HASHTAG_POSTS_SUCCESS';
export const LOAD_HASHTAG_POSTS_FAILURE = 'LOAD_HASHTAG_POSTS_FAILURE';

export const LOAD_POSTS_REQUEST = 'LOAD_POSTS_REQUEST';
export const LOAD_POSTS_SUCCESS = 'LOAD_POSTS_SUCCESS';
export const LOAD_POSTS_FAILURE = 'LOAD_POSTS_FAILURE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_SUCCESS = 'ADD_POST_SUCCESS';
export const ADD_POST_FAILURE = 'ADD_POST_FAILURE';

export const REMOVE_POST_REQUEST = 'REMOVE_POST_REQUEST';
export const REMOVE_POST_SUCCESS = 'REMOVE_POST_SUCCESS';
export const REMOVE_POST_FAILURE = 'REMOVE_POST_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const RETWEET_REQUEST = 'RETWEET_REQUEST';
export const RETWEET_SUCCESS = 'RETWEET_SUCCESS';
export const RETWEET_FAILURE = 'RETWEET_FAILURE';

export const REMOVE_IMAGE = 'REMOVE_IMAGE';

//게시물 작성하는 action
export const addPost = (data) => ({
	type: ADD_POST_REQUEST,
	data,
});

export const addComment = (data) => ({
	type: ADD_COMMENT_REQUEST,
	data,
});

// const dummyPost = (data) => ({
// 	id: data.id,
// 	content: data.content,
// 	User: {
// 		id: 1,
// 		nickname: '제로초',
// 	},
// 	Images: [],
// 	Comments: [],
// });

// const dummyComment = (data) => ({
// 	id: shortId.generate(),
// 	content: data,
// 	User: {
// 		id: 1,
// 		nickname: '제로초',
// 	},
// });

const reducer = (state = initialState, action) => {
	return produce(state, (draft) => {
		switch (action.type) {
			case RETWEET_REQUEST:
				draft.retweetLoading = true;
				draft.retweetDone = false;
				draft.retweetError = null;
				break;
			case RETWEET_SUCCESS: {
				draft.retweetLoading = false;
				draft.retweetDone = true;
				draft.mainPosts.unshift(action.data);
				break;
			}
			case RETWEET_FAILURE:
				draft.retweetLoading = false;
				draft.retweetError = action.error;
				break;

			//서버에서는 보통 이미지를 지우지 않는다. 이미지를 많이 보유하고 있는것은 도움이 될수도 있기 때문에
			//그래서 업로드된 사진을 제거할때는 서버에는 남아있고 프론트에서만 지워지는 동기액션을 사용
			case REMOVE_IMAGE:
				draft.imagePaths = draft.imagePaths.filter((v, i) => i !== action.data);
				break;

			case UPLOAD_IMAGES_REQUEST:
				draft.uploadImagesLoading = true;
				draft.uploadImagesDone = false;
				draft.uploadImagesError = null;
				break;
			case UPLOAD_IMAGES_SUCCESS: {
				draft.imagePaths = action.data;
				draft.uploadImagesLoading = false;
				draft.uploadImagesDone = true;
				break;
			}
			case UPLOAD_IMAGES_FAILURE:
				draft.uploadImagesLoading = false;
				draft.uploadImagesError = action.error;
				break;

			case LIKE_POST_REQUEST:
				draft.likePostLoading = true;
				draft.likePostDone = false;
				draft.likePostError = null;
				break;
			case LIKE_POST_SUCCESS: {
				const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
				post.Likers.push({ id: action.data.UserId });
				draft.likePostLoading = false;
				draft.likePostDone = true;
				break;
			}
			case LIKE_POST_FAILURE:
				draft.likePostLoading = false;
				draft.likePostError = action.error;
				break;

			case UNLIKE_POST_REQUEST:
				draft.unlikePostLoading = true;
				draft.unlikePostDone = false;
				draft.unlikePostError = null;
				break;
			case UNLIKE_POST_SUCCESS: {
				const post = draft.mainPosts.find((v) => v.id === action.data.PostId);
				post.Likers = post.Likers.filter((v) => v.id !== action.data.UserId);
				draft.unlikePostLoading = false;
				draft.unlikePostDone = true;
				break;
			}
			case UNLIKE_POST_FAILURE:
				draft.unlikePostLoading = false;
				draft.unlikePostError = action.error;
				break;

			//공유를 위해 하나의 게시글만 로딩
			case LOAD_POST_REQUEST:
				draft.loadPostLoading = true;
				draft.loadPostDone = false;
				draft.loadPostError = null;
				break;
			case LOAD_POST_SUCCESS:
				draft.loadPostLoading = false;
				draft.loadPostDone = true;
				draft.singlePost = action.data; //선택된 하나의 게시글이 singlePost에 저장하도록 한다.
				break;
			case LOAD_POST_FAILURE:
				draft.loadPostLoading = false;
				draft.loadPostError = action.error;
				break;

			//한페이지에서 그 액션들이 같이 사용되지 않으면 state,상태 공유가 가능하다.
			case LOAD_USER_POSTS_REQUEST:
			case LOAD_HASHTAG_POSTS_REQUEST:
			case LOAD_POSTS_REQUEST:
				draft.loadPostsLoading = true;
				draft.loadPostsDone = false;
				draft.loadPostsError = null;
				break;
			case LOAD_USER_POSTS_SUCCESS:
			case LOAD_HASHTAG_POSTS_SUCCESS:
			case LOAD_POSTS_SUCCESS:
				draft.loadPostsLoading = false;
				draft.loadPostsDone = true;
				draft.mainPosts = draft.mainPosts.concat(action.data);
				draft.hasMorePosts = action.data.length === 10;
				break;
			case LOAD_USER_POSTS_FAILURE:
			case LOAD_HASHTAG_POSTS_FAILURE:
			case LOAD_POSTS_FAILURE:
				draft.loadPostsLoading = false;
				draft.loadPostsError = action.error;
				break;

			case ADD_POST_REQUEST:
				draft.addPostLoading = true;
				draft.addPostDone = false;
				draft.addPostError = null;
				break;
			case ADD_POST_SUCCESS:
				draft.addPostLoading = false;
				draft.addPostDone = true;
				draft.mainPosts.unshift(action.data);
				draft.imagePaths = [];
				break;
			case ADD_POST_FAILURE:
				draft.addPostLoading = false;
				draft.addPostError = action.error;
				break;

			case REMOVE_POST_REQUEST:
				draft.removePostLoading = true;
				draft.removePostDone = false;
				draft.removePostError = null;
				break;
			case REMOVE_POST_SUCCESS:
				draft.removePostLoading = false;
				draft.removePostDone = true;
				draft.mainPosts = draft.mainPosts.filter(
					(v) => v.id !== action.data.PostId
				);
				break;
			case REMOVE_POST_FAILURE:
				draft.removePostLoading = false;
				draft.removePostError = action.error;
				break;

			case ADD_COMMENT_REQUEST:
				draft.addCommentLoading = true;
				draft.addCommentDone = false;
				draft.addCommentError = null;
				break;
			case ADD_COMMENT_SUCCESS:
				//immer를 써서 코드가 엄청 간단해짐
				const post = draft.mainPosts.find((v) => v.id === action.data.PostId); //게시글찾고
				post.Comments.unshift(action.data); //댓글추가
				draft.addCommentLoading = false;
				draft.addCommentDone = true;
				break;
			case ADD_COMMENT_FAILURE:
				draft.addCommentLoading = false;
				draft.addCommentError = action.error;
				break;
			default:
				break;
		}
	});
};

// const reducer = (state = initialState, action) => {
// 	switch (action.type) {
// 		case ADD_POST_REQUEST:
// 			return {
// 				...state,
// 				addPostLoading: true,
// 				addPostDone: false,
// 				addPostError: null,
// 			};
// 		case ADD_POST_SUCCESS:
// 			return {
// 				...state,
// 				mainPosts: [dummyPost(action.data), ...state.mainPosts],
// 				addPostLoading: false,
// 				addPostDone: true,
// 			};
// 		case ADD_POST_FAILURE:
// 			return {
// 				...state,
// 				addPostLoading: false,
// 				addPostError: action.error,
// 			};

// 		case REMOVE_POST_REQUEST:
// 			return {
// 				...state,
// 				removePostLoading: true,
// 				removePostDone: false,
// 				removePostError: null,
// 			};
// 		case REMOVE_POST_SUCCESS:
// 			return {
// 				...state,
// 				mainPosts: state.mainPosts.filter((v) => v.id !== action.data),
// 				removePostLoading: false,
// 				removePostDone: true,
// 			};
// 		case REMOVE_POST_FAILURE:
// 			return {
// 				...state,
// 				removePostLoading: false,
// 				removePostError: action.error,
// 			};

// 		case ADD_COMMENT_REQUEST:
// 			return {
// 				...state,
// 				addCommentLoading: true,
// 				addCommentDone: false,
// 				addCommentError: null,
// 			};
// 		case ADD_COMMENT_SUCCESS:
// 			const postIndex = state.mainPosts.findIndex(
// 				(v) => v.id === action.data.postId
// 			);
// 			const post = { ...state.mainPosts[postIndex] };
// 			post.Comments = [dummyComment(action.data.content), ...post.Comments];
// 			const mainPosts = [...state.mainPosts];
// 			mainPosts[postIndex] = post;
// 			return {
// 				...state,
// 				mainPosts,
// 				addCommentLoading: false,
// 				addCommentDone: true,
// 			};
// 		case ADD_COMMENT_FAILURE:
// 			return {
// 				...state,
// 				addCommentLoading: false,
// 				addCommentError: action.error,
// 			};
// 		default:
// 			return state;
// 	}
// };

export default reducer;
