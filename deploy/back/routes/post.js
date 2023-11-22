const express = require('express');
const multer = require('multer');
const path = require('path'); // path는 노드에서 제공
const fs = require('fs'); //노드에서 파일 시스템을 조작해주는 모듈
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const { Post, Image, Comment, User, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
	fs.accessSync('uploads'); //'uploads'라는 폴더가 있는지 확인하고
} catch (error) {
	console.log('uploads 폴더가 없으므로 생성합니다.');
	fs.mkdirSync('uploads'); //'uploads'라는 폴더 생성
}

AWS.config.update({
	accessKeyId: process.env.S3_ACCESS_KEY_ID,
	secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
	region: 'ap-northeast-2',
});

// form마다 형식이 다르기때문에 multer미들웨어를 사용해서 라우터마다 별도의 세팅을 해줘야한다.
const upload = multer({
	//스토리지를 diskstorage에서 multerS3로 바꿔준다.
	storage: multerS3({
		s3: new AWS.S3(),
		bucket: 'twitter-clone-coding',
		key(req, file, cb) {
			cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`);
		},
	}),
	limits: { fileSize: 20 * 1024 * 1024 }, //20MB, 20MB으로 제한
});

// 게시글 작성 라우터
// '/post'로 중복되는 부분을 분리
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
	// '/' 는 실제로는 '/post'다. POST /post
	try {
		const post = await Post.create({
			content: req.body.content,
			UserId: req.user.id,
		});
		const hashtags = req.body.content.match(/#[^\s#]+/g);
		if (hashtags) {
			const result = await Promise.all(
				hashtags.map((tag) =>
					//db에 저장할때 중복을 피하기위해서 #노드라면 #노드가 있는지 확인하고 없으면 등록한다.
					//findOrCreate(where:{})로 있을 때는 가져오고, 없을 때는 등록한다.
					//slice(1)로 #를 떼어내고, toLowerCase로 소문자로 db에 저장해 대,소문자로 검색되게 한다.
					Hashtag.findOrCreate({ where: { name: tag.slice(1).toLowerCase() } })
				)
			);
			//result의 결과가 [[노드, true], [리액트, true]]이라서 배열의 첫번째 노드, 리액트가 추출하기 위해 v[0] 적용
			await post.addHashtags(result.map((v) => v[0]));
		}
		if (req.body.image) {
			//req.body.image에 imagePath가 들어간다.
			//이미지가 여러개일떄
			if (Array.isArray(req.body.image)) {
				//이미지를 여러개 올리면 image: [제로초.png, 부기초.png] 와 같이 배열로 들어간다.
				const images = await Promise.all(
					// Promise.all로 한번에 여러개가 db에 저장된다.
					req.body.image.map((image) => Image.create({ src: image }))
				);
				await post.addImages(images);
			} else {
				//이미지가 하나일때
				//이미지를 하나면 올리면 image: 제로초.png 와 같이 배열로 감싸지지 않는다.
				const image = await Image.create({ src: req.body.image });
				await post.addImages(image);
			}
		}
		const fullpost = await Post.findOne({
			where: { id: post.id },
			include: [
				{
					model: Image,
				},
				{
					model: Comment,
					include: [
						{
							model: User, // 댓글 작성자
							attributes: ['id', 'nickname'],
						},
					],
				},
				{
					model: User, // 게시글 작성자
					attributes: ['id', 'nickname'],
				},
				{
					model: User, // 좋아요 누른 사람
					as: 'Likers',
					attributes: ['id'],
				},
			],
		});
		res.status(201).json(fullpost);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// 이미지 업로드 라우터
router.post(
	'/images',
	isLoggedIn,
	upload.array('image'),
	async (req, res, next) => {
		//POST /post/images
		console.log(req.files); //req.files에 업로드한 이미지에 대한 정보가 들어있다.
		res.json(req.files.map((v) => v.location)); // 어디로 업로드 됐는지 파일명을 다시 프론트로 보내준다.
	}
);

//공유 게시글 불러오는 라우터(특정 하나의 게시글)
router.get('/:postId', async (req, res, next) => {
	// GET /post/1
	try {
		const post = await Post.findOne({
			where: { id: req.params.postId },
		});
		if (!post) {
			return res.status(404).send('존재하지 않는 게시글입니다.');
		}
		const fullPost = await Post.findOne({
			where: { id: post.id },
			include: [
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
				{
					model: User,
					attributes: ['id', 'nickname'],
				},
				{
					model: User,
					as: 'Likers',
					attributes: ['id', 'nickname'],
				},
				{
					model: Image,
				},
				{
					model: Comment,
					include: [
						{
							model: User,
							attributes: ['id', 'nickname'],
						},
					],
				},
			],
		});
		res.status(200).json(fullPost);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//리트윗 생성 라우터
router.post('/:postId/retweet', isLoggedIn, async (req, res, next) => {
	// POST /post/1/retweet
	try {
		//리트윗은 게시글 작성자와 리트윗 작성자의 관계를 고려해야해서 다른 라우터에 비해 복잡하다.
		//게시글을 찾을때 리트윗에 관한 조건도 함께 찾아야한다.
		const post = await Post.findOne({
			where: { id: req.params.postId },
			include: [
				{
					model: Post,
					as: 'Retweet',
				},
			],
		});
		if (!post) {
			return res.status(403).send('존재하지 않는 게시글입니다.');
		}
		//자기 게시글을 리트윗하는것과, 자기 게시글에 다른사람이 리트윗한것에 내가 리트윗하는 것을 막아준다.
		if (
			req.user.id === post.UserId ||
			(post.Retweet && post.Retweet.UserId === req.user.id)
		) {
			return res.status(403).send('자신의 글은 리트윗할 수 없습니다.');
		}
		//리트윗이 가능한 대상찾고, 이미 리트윗했으면 다시 리트윗못하게 막기
		const retweetTargetId = post.RetweetId || post.id;
		const exPost = await Post.findOne({
			where: { UserId: req.user.id, RetweetId: retweetTargetId },
		});
		if (exPost) {
			return res.status(403).send('이미 리트윗했습니다');
		}
		const retweet = await Post.create({
			UserId: req.user.id,
			RetweetId: retweetTargetId,
			content: 'retweet', // 게시글은 content를 필수로 설정해두었기에 넘어둠.
		});
		//내가 어떤 게시글을 리트윗했는지..
		const retweetWithPrevPost = await Post.findOne({
			where: { id: retweet.id },
			include: [
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
				{
					model: User,
					attributes: ['id', 'nickname'],
				},
				{
					model: User,
					as: 'Likers',
					attributes: ['id'],
				},
				{
					model: Image,
				},
				{
					model: Comment,
					include: [
						{
							model: User,
							attributes: ['id', 'nickname'],
						},
					],
				},
			],
		});
		res.status(201).json(retweetWithPrevPost);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

// 댓글 작성 라우터
router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
	// POST /post/1/comment
	try {
		//게시글이 존재하는 검사
		const post = await Post.findOne({
			where: { id: req.params.postId },
		});
		if (!post) {
			// 게시글이 존재하지 않으면
			return res.status(403).send('존재하지 않는 게시글입니다.');
		}
		const comment = await Comment.create({
			content: req.body.content,
			PostId: parseInt(req.params.postId, 10),
			UserId: req.user.id,
		});
		const fullComment = await Comment.findOne({
			where: { id: comment.id },
			include: [
				{
					model: User,
					attributes: ['id', 'nickname'],
				},
			],
		});
		res.status(201).json(fullComment);
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//좋아요 라우터
router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
	// PATCH /post/1/like
	try {
		//먼저 게시글이 있는지 확인
		const post = await Post.findOne({ where: { id: req.params.postId } });
		//게시글이 없으면(게시글이 없는데 좋아요를 누르면)
		if (!post) {
			return res.status(403).send('게시글이 존재하지 않습니다.');
		}
		//게시글이 있으면
		await post.addLikers(req.user.id);
		res.json({ PostId: post.id, UserId: req.user.id });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//좋아요 취소 라우터
router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
	//DELETE /post/1/like
	try {
		//먼저 게시글이 있는지 확인
		const post = await Post.findOne({ where: { id: req.params.postId } });
		//게시글이 없으면(게시글이 없는데 좋아요를 누르면)
		if (!post) {
			return res.status(403).send('게시글이 존재하지 않습니다.');
		}
		//게시글이 있으면
		await post.removeLikers(req.user.id);
		res.json({ PostId: post.id, UserId: req.user.id });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//게시글 삭제 라우터
router.delete('/:postId', isLoggedIn, async (req, res, next) => {
	// '/' 는 실제로는 '/post'다. // DELETE /post/1
	try {
		//시퀄라이즈에서 제거할 때는 destroy를 쓴다.
		await Post.destroy({
			//내가 쓴 게시글만 삭제할 수 있도록 게시글 아이디, 내 아이디를 넣어준다.
			where: { id: req.params.postId, UserId: req.user.id },
		});
		res.json({ PostId: parseInt(req.params.postId, 10) });
	} catch (error) {
		console.error(error);
		next(error);
	}
});

//게시글 수정 라우터
router.patch('/:postId', isLoggedIn, async (req, res, next) => {
	// '/' 는 실제로는 '/post'다. // PATCH /post/1
	try {
		//1. 게시글을 업데이트하고 - 게시글 수정
		await Post.update(
			{ content: req.body.content },
			{
				where: { id: req.params.postId, UserId: req.user.id },
			}
		);
		//2.게시글을 찾아서 그 게시글에 setHashtag해야한다. - 해시태그 수정
		const hashtags = req.body.content.match(/#[^\s#]+/g);
		const post = await Post.findOne({ where: { id: req.params.postId } });
		if (hashtags) {
			const result = await Promise.all(
				hashtags.map((tag) =>
					Hashtag.findOrCreate({ where: { name: tag.slice(1).toLowerCase() } })
				)
			);
			//result의 결과가 [[노드, true], [리액트, true]]이라서 배열의 첫번째 노드, 리액트가 추출하기 위해 v[0] 적용
			await post.setHashtags(result.map((v) => v[0]));
		}
		res.json({
			PostId: parseInt(req.params.postId, 10),
			content: req.body.content,
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
});

module.exports = router;
