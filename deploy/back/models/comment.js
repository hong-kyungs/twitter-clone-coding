const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Comment extends Model {
	static init(sequelize) {
		return super.init(
			{
				content: {
					type: DataTypes.TEXT, //TEXT를 넣으면 글자 무제한
					allowNull: false,
				},
			},
			{
				modelName: 'Comment',
				tableName: 'comments', //tableName은 자동으로 modelName의 소문자, 복수로 생기지만 혹시 모른다면 추가해주기
				charset: 'utf8mb4',
				collate: 'utf8mb4_general_ci', // 한글+이모티콘 저장
				sequelize, //연결객체를 class로 보내줄것이기 때문에, 그 연결객체인 sequelize를 마지막에 넣어줌
			}
		);
	} // 상속받은 것에서 부모인 Model을 사용하고 싶다면 super를 쓴다.

	static associate(db) {
		db.Comment.belongsTo(db.User);
		db.Comment.belongsTo(db.Post);
	}
};
