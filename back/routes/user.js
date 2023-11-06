const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');

const { User, Post, Image, Comment } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

//로그인 상태 유지 라우터
router.get('/', async (req, res, next) => {
	//GET /user
	try {
		if (req.user) {
			//req.user가 true면, 즉 로그인 정보가 있다면
			const fullUserWithoutPassword = await User.findOne({
				where: { id: req.user.id },
				attributes: {
					exclude: ['password'],
				},
				include: [
					{
						model: Post,
						attributes: ['id'],
					},
					{
						model: User,
						as: 'Followings',
						attributes: ['id'],
					},
					{
						model: User,
						as: 'Followers',
						attributes: ['id'],
					},
				],
			});
			res.status(200).json(fullUserWithoutPassword);
		} else {
			//로그인 정보가 없으면 아무것도 보내주지 않으면 된다.
			res.status(200).json(null);
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//팔로우 목록 불러오기 라우터
router.get('/followers', isLoggedIn, async (req, res, next) => {
	// GET /user/followers
	//PATCH /user/1/follow
	try {
		const user = await User.findOne({ where: { id: req.user.id } }); //1. 일단 나를 찾고,
		if (!user) {
			res.status(403).send('없는 사람을 찾으려고 하시네여?');
		}
		const followers = await user.getFollowers({
			limit: parseInt(req.query.limit, 10),
		}); //2. getFollowers로 팔로우 목록 가져오기
		res.status(200).json(followers);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//팔로잉 목록 불러오기 라우터
router.get('/followings', isLoggedIn, async (req, res, next) => {
	// GET /user/followings
	//PATCH /user/1/follow
	try {
		const user = await User.findOne({ where: { id: req.user.id } }); //1. 일단 나를 찾고
		if (!user) {
			res.status(403).send('없는 사람을 찾으려고 하시네여?');
		}
		const followings = await user.getFollowings({
			limit: parseInt(req.query.limit, 10),
		}); //2. getFollowings로 팔로잉 목록 가져오기
		res.status(200).json(followings);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//특정 사용자 정보 가져오는 라우터
router.get('/:userId', async (req, res, next) => {
	//GET /user/1
	try {
		//req.user가 true면, 즉 로그인 정보가 있다면
		const fullUserWithoutPassword = await User.findOne({
			where: { id: req.params.userId },
			attributes: {
				exclude: ['password'], //비밀번호 제외하기
			},
			include: [
				{
					model: Post,
					attributes: ['id'],
				},
				{
					model: User,
					as: 'Followings',
					attributes: ['id'],
				},
				{
					model: User,
					as: 'Followers',
					attributes: ['id'],
				},
			],
		});

		if (fullUserWithoutPassword) {
			//개인정보침해 예방 ->
			//게시글, 팔로워, 팔로잉에 다른 사용자들 id가 들어가지 않게 data를 length로 갯수만 보여지게 변화시켜서 보내준다.
			const data = fullUserWithoutPassword.toJSON();
			data.Posts = data.Posts.length;
			data.Followers = data.Followers.length;
			data.Followings = data.Followings.length;
			res.status(200).json(data);
		} else {
			//로그인 정보가 없으면 아무것도 보내주지 않으면 된다.
			res.status(404).json('존재하지 않는 사용자입니다. ');
		}
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//로그인 라우터
router.post('/login', isNotLoggedIn, (req, res, next) => {
	// POST /user/login
	//local - done이 콜백같은 거라서 done이 가진 인자들이 전달된다
	//(서버에러, 성공객체, 클라이언트에러) = (err, user, info)
	passport.authenticate('local', (err, user, info) => {
		//서버쪽 에러
		if (err) {
			console.error(err);
			return next(err);
		}
		//클라이언트 에러가 있으면 - 로그인 실패하면
		if (info) {
			// passport/local의 클라이언트 에러 부분이 info.reason에 들어간다.
			return res.status(401).send(info.reason);
		}
		//성공하면
		return req.login(user, async (loginErr) => {
			// login은 passport의 함수
			//혹시 패스포트 로그인에서 에러가 나면 -> 극히 드문경우
			if (loginErr) {
				console.error(loginErr);
				return next(loginErr);
			}
			//원래 있는 사용자 정보를 다시 가져와서 부족한 부분 추가
			const fullUserWithoutPassword = await User.findOne({
				where: { id: user.id },
				attributes: {
					exclude: ['password'],
				},
				include: [
					{
						model: Post,
						attributes: ['id'],
					},
					{
						model: User,
						as: 'Followings',
						attributes: ['id'],
					},
					{
						model: User,
						as: 'Followers',
						attributes: ['id'],
					},
				],
			});
			//여기까지 에러가 없으면 사용자 정보를 프론트로 넘겨주기
			//로그인시 cookie가 res.setHeader('Cookie', 'cxlhy') 와 같은 형식으로 보내준다.
			return res.status(200).json(fullUserWithoutPassword);
		});
	})(req, res, next);
});

//특정 사용자의 게시글만 가져오는 라우터
//posts의 게시글 불러오는 라우터 복사해서 필요한 부분만 바꿔주기
router.get('/:userId/posts', async (req, res, next) => {
	// GET /user/1/posts
	try {
		const where = { UserId: req.params.userId }; // 특정 사용자 찾기
		if (parseInt(req.query.lastId, 10)) {
			//초기 로딩이 아닐 때, 스크롤 내려서 더 불러올 때
			where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; //lastId보다 작은 id에서 10개(limit) 불러오기
			//ex)21 20 19 18 17 16 15 14 13 12    11 10 9 8 7 6 5 4 3 2   1 ,
			//초기로딩: 21~12, lastId=12로 12보다 작은 11에서 두번때로딩시작, 12두번째로딩: 11~3
		}
		const posts = await Post.findAll({
			where,
			limit: 10,
			order: [
				['createdAt', 'DESC'], //게시글 내림차순 정렬
				[Comment, 'createdAt', 'DESC'], // 댓글 내림차순 정렬
			],
			include: [
				{
					model: User, // 게시글 작성자 정보도 같이 가져오기
					attributes: ['id', 'nickname'],
				},
				{
					model: Image,
				},
				{
					model: Comment,
					//댓글의 작성자 이름, 닉네임까지 가져오기
					include: [
						{
							model: User,
							attributes: ['id', 'nickname'],
						},
					],
				},
				{
					model: User,
					as: 'Likers',
					attributes: ['id'],
				},
				{
					model: Post,
					as: 'Retweet',
					include: [
						{
							model: User,
							attributes: ['id', 'nickname'],
						},
						{
							model: Image,
						},
					],
				},
			],
		});
		console.log(posts);
		res.status(200).json(posts);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//회원가입 라우터
router.post('/', isNotLoggedIn, async (req, res, next) => {
	// POST/ user/
	try {
		const exUser = await User.findOne({
			where: {
				email: req.body.email,
			},
		});
		if (exUser) {
			return res.status(403).send('이미 사용중인 아이디입니다.');
		}
		const hashedPassword = await bcrypt.hash(req.body.password, 12);
		await User.create({
			email: req.body.email,
			nickname: req.body.nickname,
			password: hashedPassword,
		});
		res.status(200).send('ok');
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//로그아웃 라우터
router.post('/logout', isLoggedIn, (req, res) => {
	req.logout(() => {
		res.redirect('/');
	});
	// req.logout(() => {});
	// req.session.destroy();
	// res.send('ok');
});

//닉네임 수정 라우터
router.patch('/nickname', isLoggedIn, async (req, res, next) => {
	try {
		await User.update(
			{
				nickname: req.body.nickname, // 2. 프론트에 작성된 nickname을 update를 통해서 수정
			},
			{
				where: { id: req.user.id }, // 1. 내 아이디의 닉네임을 찾아서
			}
		);
		res.status(200).json({ nickname: req.body.nickname });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//팔로우 라우터
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
	//PATCH /user/1/follow - 1번 유저를 팔로우하겠다.
	try {
		const user = await User.findOne({ where: { id: req.params.userId } }); //1. 게시글의 유저가 있는지 확인하고
		if (!user) {
			res.status(403).send('없는 사람을 팔로우하려고 하시네여?');
		}
		await user.addFollowers(req.user.id); //2.나를 그 게시글 유저의 팔로워로 넣는다. 나는 1번 유저의 팔로워
		res.status(200).json({ UserId: parseInt(req.params.userId, 10) }); //3. 그 게시글 유저 아이디를 보내준다.
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//언팔로우 라우터
router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
	//DELETE /user/1/follow
	try {
		const user = await User.findOne({ where: { id: req.params.userId } }); //1. 게시글의 유저를 찾고
		if (!user) {
			res.status(403).send('없는 사람을 언팔로우하려고 하시네여?');
		}
		await user.removeFollowers(req.user.id); //2.나를 그 게시글 유저의 팔로워에서 제거한다.
		res.status(200).json({ UserId: parseInt(req.params.userId, 10) }); //3. 그 게시글 유저 아이디를 보내준다.
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//팔로워 차단/삭제 라우터
router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
	//DELETE /user/follow/1
	try {
		const user = await User.findOne({ where: { id: req.params.userId } }); //차단할 사람을 찾고
		if (!user) {
			res.status(403).send('없는 사람을 차단하려고 하시네여?');
		}
		await user.removeFollowings(req.user.id); //그 차단할 사람에게서 팔로잉을 끊는다. -> 대칭관계이므로 팔로워가 차단된다.
		res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//게시글 작성시 내 정보에 추가하는 라우터
router.patch('/post/:lastId', isLoggedIn, async (req, res, next) => {
	try {
		await Post.findOne({
			where: { id: req.params.lastId, UserId: req.user.id },
		});
		res.json({ PostId: parseInt(req.params.lastId, 10) });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

module.exports = router;
