const Sequelize = require('sequelize');
const comment = require('./comment');
const hashtag = require('./hashtag');
const image = require('./image');
const post = require('./post');
const user = require('./user');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

//sequelize가 node와 mySQL을 연결해준다.
const sequelize = new Sequelize(
	config.database,
	config.username,
	config.password,
	config
);

db.Comment = comment;
db.Hashtag = hashtag;
db.Image = image;
db.Post = post;
db.User = user;

//class로 넣으면 sequelize init부분을 추가로 넣어줘야한다.
Object.keys(db).forEach((modelName) => {
	db[modelName].init(sequelize);
});

//반복문을 돌면서 associate을 실행한다.
Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
