import { all, fork, put, takeLatest, delay, call } from 'redux-saga/effects';
import axios from 'axios';
import {
	UPLOAD_IMAGES_REQUEST,
	UPLOAD_IMAGES_SUCCESS,
	UPLOAD_IMAGES_FAILURE,
	LIKE_POST_REQUEST,
	LIKE_POST_SUCCESS,
	LIKE_POST_FAILURE,
	UNLIKE_POST_REQUEST,
	UNLIKE_POST_SUCCESS,
	UNLIKE_POST_FAILURE,
	LOAD_POST_REQUEST,
	LOAD_POST_SUCCESS,
	LOAD_POST_FAILURE,
	LOAD_USER_POSTS_REQUEST,
	LOAD_USER_POSTS_SUCCESS,
	LOAD_USER_POSTS_FAILURE,
	LOAD_HASHTAG_POSTS_REQUEST,
	LOAD_HASHTAG_POSTS_SUCCESS,
	LOAD_HASHTAG_POSTS_FAILURE,
	LOAD_POSTS_REQUEST,
	LOAD_POSTS_SUCCESS,
	LOAD_POSTS_FAILURE,
	ADD_POST_REQUEST,
	ADD_POST_SUCCESS,
	ADD_POST_FAILURE,
	REMOVE_POST_REQUEST,
	REMOVE_POST_SUCCESS,
	REMOVE_POST_FAILURE,
	ADD_COMMENT_REQUEST,
	ADD_COMMENT_SUCCESS,
	ADD_COMMENT_FAILURE,
	RETWEET_REQUEST,
	RETWEET_SUCCESS,
	RETWEET_FAILURE,
} from '../reducers/post';
import { ADD_POST_TO_ME, REMOVE_POST_OF_ME } from '../reducers/user';

function retweetAPI(data) {
	return axios.post(`/post/${data}/retweet`);
}
function* retweet(action) {
	try {
		const result = yield call(retweetAPI, action.data);
		yield put({
			type: RETWEET_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: RETWEET_FAILURE,
			error: err.response.data,
		});
	}
}

function uploadImagesAPI(data) {
	return axios.post('/post/images', data); //data에 Formdata가 그대로 들어온다
}
function* uploadImages(action) {
	try {
		const result = yield call(uploadImagesAPI, action.data);
		yield put({
			type: UPLOAD_IMAGES_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: UPLOAD_IMAGES_FAILURE,
			error: err.response.data,
		});
	}
}

function likePostAPI(data) {
	return axios.patch(`/post/${data}/like`);
}
function* likePost(action) {
	try {
		const result = yield call(likePostAPI, action.data);
		yield put({
			type: LIKE_POST_SUCCESS,
			data: result.data, //백에드 좋아요라우터에서 PostId와 UserId를 받는다
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: LIKE_POST_FAILURE,
			error: err.response.data,
		});
	}
}

function unlikePostAPI(data) {
	return axios.delete(`/post/${data}/like`);
}
function* unlikePost(action) {
	try {
		const result = yield call(unlikePostAPI, action.data);
		yield put({
			type: UNLIKE_POST_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: UNLIKE_POST_FAILURE,
			error: err.response.data,
		});
	}
}

function loadPostAPI(data) {
	return axios.get(`/post/${data}`);
}

function* loadPost(action) {
	try {
		const result = yield call(loadPostAPI, action.data);
		yield put({
			type: LOAD_POST_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: LOAD_POST_FAILURE,
			error: err.response.data,
		});
	}
}

function loadHashtagPostsAPI(data, lastId) {
	//data가 한글이나 특수문자면 에러가 발생하므로 data를 encodeURIComponent로 감싸준다.
	//ex) #리액트 #해시태그
	return axios.get(
		`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`
	);
}
function* loadHashtagPosts(action) {
	try {
		const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
		yield put({
			type: LOAD_HASHTAG_POSTS_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: LOAD_HASHTAG_POSTS_FAILURE,
			error: err.response.data,
		});
	}
}

function loadUserPostsAPI(data, lastId) {
	return axios.get(`/user/${data}/posts?lastId=${lastId || 0}`);
}
function* loadUserPosts(action) {
	try {
		const result = yield call(loadUserPostsAPI, action.data, action.lastId);
		yield put({
			type: LOAD_USER_POSTS_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: LOAD_USER_POSTS_FAILURE,
			error: err.response.data,
		});
	}
}

function loadPostsAPI(lastId) {
	//get방식에는 data를 넣을수가 없어서, data를 넣어려면 /posts 뒤에 ?key={값}으로 넣어준다.
	//쿼리스트링으로 lastId를 보내준다. 게시물이 하나도 없어 lastId가 undefined면 lastId를 0으로 만든다.
	return axios.get(`/posts?lastId=${lastId || 0}`);
}
function* loadPosts(action) {
	try {
		const result = yield call(loadPostsAPI, action.lastId);
		yield put({
			type: LOAD_POSTS_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: LOAD_POSTS_FAILURE,
			error: err.response.data,
		});
	}
}

function addPostAPI(data) {
	//formData는 { formData: data }처럼 묶어주면 안되고 바로 data로 전달해야한다.
	return axios.post('/post', data);
}
function* addPost(action) {
	try {
		const result = yield call(addPostAPI, action.data);
		yield put({
			type: ADD_POST_SUCCESS,
			data: result.data,
		});
		yield put({
			type: ADD_POST_TO_ME,
			data: result.data.id,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: ADD_POST_FAILURE,
			error: err.response.data,
		});
	}
}

function removePostAPI(data) {
	return axios.delete(`/post/${data}`); //data는 post.id를 받는다
}
function* removePost(action) {
	try {
		const result = yield call(removePostAPI, action.data);
		yield put({
			type: REMOVE_POST_SUCCESS,
			data: result.data,
		});
		yield put({
			type: REMOVE_POST_OF_ME,
			data: action.data,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: REMOVE_POST_FAILURE,
			error: err.response.data,
		});
	}
}

function addCommentAPI(data) {
	return axios.post(`/post/${data.postId}/comment`, data); //Post /post/1/comment - '1번 게시글에 댓글을 작성' 의미의 주소 생성
}
function* addComment(action) {
	try {
		const result = yield call(addCommentAPI, action.data);
		yield put({
			type: ADD_COMMENT_SUCCESS,
			data: result.data,
		});
	} catch (err) {
		console.error(err);
		yield put({
			type: ADD_COMMENT_FAILURE,
			error: err.response.data,
		});
	}
}

function* WatchRetweet() {
	yield takeLatest(RETWEET_REQUEST, retweet);
}
function* WatchuploadImages() {
	yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}
function* WatchLikePost() {
	yield takeLatest(LIKE_POST_REQUEST, likePost);
}
function* WatchUnlikePost() {
	yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function* WatchLoadPost() {
	yield takeLatest(LOAD_POST_REQUEST, loadPost);
}

function* WatchLoadUserPosts() {
	yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}
function* WatchLoadHashtagPosts() {
	yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}
function* WatchLoadPosts() {
	yield takeLatest(LOAD_POSTS_REQUEST, loadPosts);
}

function* WatchAddPost() {
	yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* WatchRemovePost() {
	yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* WatchAddComment() {
	yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

export default function* postSaga() {
	yield all([
		fork(WatchRetweet),
		fork(WatchuploadImages),
		fork(WatchLikePost),
		fork(WatchUnlikePost),
		fork(WatchLoadPost),
		fork(WatchLoadUserPosts),
		fork(WatchLoadHashtagPosts),
		fork(WatchLoadPosts),
		fork(WatchAddPost),
		fork(WatchRemovePost),
		fork(WatchAddComment),
	]);
}
