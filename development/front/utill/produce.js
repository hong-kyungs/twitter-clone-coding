//immer가 internet explorer에서는 동작하지 않는다.
//IE11(internet explorer)에서도 동작하게 하기 위헤서 추가해준 파일이다.
import { enableES5, produce } from 'immer';

const produceExtended = (...args) => {
	enableES5; //immer의 produce는 그대로 동작하고 그 위에 enableES5를 추가해준것
	return produce(...args);
};

export default produceExtended;
