const express = require('express');
const { Op } = require('sequelize');

const { Post, User, Image, Comment } = require('../models');

const router = express.Router();

//게시글 불러오는 라우터
router.get('/', async (req, res, next) => {
	// GET /posts
	try {
		const where = {};
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

module.exports = router;
