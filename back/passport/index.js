const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
	//cookie랑 묶어줄 아이디를 저장하는 과정
	//routes/user.js에 req.login(user,...)에 들어온 user가 아래 user에 들어간다.
	//session에 user정보를 다 가지고 있으면 너무 커지므로, user.id만 저장
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	//deserialize는 DB에서 가져와야 함.
	//그 user.id를 통해서 DB에서 user를 복구한다.
	passport.deserializeUser(async (id, done) => {
		try {
			const user = await User.findOne({ where: { id } });
			done(null, user); //req.user
		} catch (error) {
			console.error(error);
			done(error);
		}
	});
	local(); //로그인 전략이 들어있는 local 파일을 불러온다.
};
