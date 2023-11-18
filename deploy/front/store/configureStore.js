// next.js에서 redux를 붙일 때 복잡한데 이것을 간편하게 해주는 라이브러리가 next-redux-wrapper
import { createWrapper } from 'next-redux-wrapper';
import { configureStore } from '@reduxjs/toolkit';
import reducer from '../reducers';

const loggerMiddleware =
	({ dispatch, getState }) =>
	(next) =>
	(action) => {
		console.log(action);
		return next(action);
	};

// function getServerState() {
// 	return typeof document !== 'undefined'
// 		? JSON.parse(document.querySelector('#__NEXT_DATA__').textContent)?.props
// 				.pageProps.initialState
// 		: undefined;
// }
// const serverState = getServerState();
// console.log('serverState', serverState);

// configureStore: store 를 생성
const makeStore = () =>
	configureStore({
		reducer, // 리듀서 모듈들이 합쳐진 루트 리듀서
		// redux-toolkit 은 devTools 등의 미들웨어들을 기본적으로 제공 (사용하고 싶은 미들웨어가 있다면 추가로 정의 ex.logger)
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(loggerMiddleware),
		devTools: process.env.NODE_ENV !== 'production',
		//preloadedState: serverState, // SSR
	});

const wrapper = createWrapper(makeStore, {
	//옵션부분인데 debug부분이 true면 좀 더 리덕스에 관해 자세한 설명이 나오기 때문에 개발할 떄 넣어준다.
	debug: process.env.NODE_ENV === 'development',
});

export default wrapper;
