exports.isLoggedIn = (req, res, next) => {
	//passport에서 제공하는 isAuthenticated로 로그인 유무 확인
	if (req.isAuthenticated()) {
		//로그인이 되어있으면 다음 미들웨어로 가게 함. next()에 인자가 아무것도 없으면 다음 미들웨어로 넘어감.
		next();
	} else {
		res.status(401).send('로그인이 필요합니다.');
	}
};

exports.isNotLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		next();
	} else {
		res.status(401).send('로그인하지 않은 사용자만 접근 가능합니다.');
	}
};
