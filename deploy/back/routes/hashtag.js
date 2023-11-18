const express = require('express');
const { Op } = require('sequelize');

const { User, Post, Image, Comment, Hashtag } = require('../models');
const router = express.Router();

router.get('/:tag', async (req, res, next) => {
	try {
		const where = {};
		if (parseInt(req.query.lastId, 10)) {
			// 초기 로딩이 아닐 때
			where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
		} // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
		const posts = await Post.findAll({
			where,
			limit: 10,
			include: [
				//게시글 가져오는 부분은 동일하고, hashtag 가져오는 부분에 where을 추가해준다.
				// hashtag 가져오는 부분에 where을 추가처럼 include안에서도 조건 적용이 가능하다.
				{
					model: Hashtag,
					//사가에서 encode해서 서버로 보내졌고, 서버에서는 decode해서 보내준다.
					where: { name: decodeURIComponent(req.params.tag) },
					// posts의 where 와 Hashtag의 where, 모든 조건이 동시에 만족하는 것이 선택된다.
				},
				{
					model: User,
					attributes: ['id', 'nickname'],
				},
				{
					model: Image,
				},
				{
					model: User,
					through: 'Like',
					as: 'Likers',
					attributes: ['id'],
				},
				{
					model: Comment,
					include: [
						{
							model: User,
							attributes: ['id', 'nickname'],
							order: [['createdAt', 'DESC']],
						},
					],
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
		res.json(posts);
	} catch (e) {
		console.error(e);
		next(e);
	}
});

module.exports = router;
