const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const hpp = require('hpp');
const helmet = require('helmet');

const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const hashtagRouter = require('./routes/hashtag');
const db = require('./models');
const app = express();
const passportConfig = require('./passport');

dotenv.config();
//서버실행 할때 db.sequelize도 같이 연결된다.
db.sequelize
	.sync()
	.then(() => {
		console.log('db 연결 성공');
	})
	.catch(console.error);

passportConfig();

if (process.env.NODE_ENV === 'production') {
	app.use(morgan('combined')); // 배포환경이면
	app.use(hpp());
	app.use(helmet());
} else {
	app.use(morgan('dev')); // 개발환경이면
}

app.use(
	cors({
		//*로 모두 다 허용해줬지만 실무에서는 실제로 요청이 허용될 주소를 넣어준다.
		origin: ['http://localhost:3060', 'http://nodebird.store'],
		credentials: true,
	})
);

app.use('/', express.static(path.join(__dirname, 'uploads'))); // 실제주소는 http://localhost:3065/이미지경로, 프론트는 '/'로 접근하기 때문에 서버쪽 폴더구조를 알수가 없게되고 보안에 조금 유리하다.

//프론트에서 백엔드로 데이터를 보낼때 express.json, express.urlencoded 이 두가지 형식만 받는다.
app.use(express.json()); // 프론트에서 axios로 데이터 보낼때
app.use(express.urlencoded({ extended: true })); //일반 form submit했을 때, urlencoded 방식으로 받는다.

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
	session({
		saveUninitialized: false,
		resave: false,
		secret: process.env.COOKIE_SECRET,
		cookie: {
			httpOnly: true, //쿠키는 자바스크립트로는 접근 못하게 하기-자바스크립트로 접근하면 변조된다.
			secure: false, //일단 false로, https 적용할 때 true로 만들어준다.
			domain: process.env.NODE_ENV === 'production' && '.nodebird.store',
		},
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
	res.send('Hello Express');
});

app.get('/api', (req, res) => {
	res.send('Hello Api');
});

app.use('/posts', postsRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);
app.use('/hashtag', hashtagRouter);

app.listen(80, () => {
	console.log('서버 실행 중');
});
