import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import userSaga from './user';
import postSaga from './post';

//saga에서 보내는 axios 요청에는 기본적으로 baseURL 과 withCredectials이 true로 들어간다.
axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials = true;

export default function* rootSaga() {
	yield all([fork(userSaga), fork(postSaga)]);
}
