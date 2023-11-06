import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';
import axios from 'axios';

import userSlice from './userSlice';
import postSlice from './postSlice';

axios.defaults.baseURL = 'http://localhost:3065';
axios.defaults.withCredentials = true;

const rootReducer = combineReducers({
	user: userSlice.reducer,
	post: postSlice.reducer,
});

// const rootReducer = (state, action) => {
//   // SSR 작업 수행 시 필요한 코드
//   if (action.type === HYDRATE) {
//     return {
//       ...state,
//       ...action.payload,
//     };
//   }
//   return combineReducers({
//     user: userSlice.reducer,
//    	post: postSlice.reducer,
//   })(state, action);
// };

export default rootReducer;
